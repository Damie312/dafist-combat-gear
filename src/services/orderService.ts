import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { PlacedOrder, OrderStatus, OrderItem, Product, Coupon, OrderShippingInfo, calculateShippingFee } from '../types';
import { DEMO_PRODUCTS } from '../data/products';
import { formatVND } from '../utils/formatters';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

const ORDERS_COLLECTION = 'orders';

export type CheckoutErrorCode = 
  | 'PRODUCT_NOT_FOUND'
  | 'OUT_OF_STOCK'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_QUANTITY'
  | 'INVALID_SIZE'
  | 'PRICE_CHANGED'
  | 'INVALID_STOCK_DATA'
  | 'ORDER_CREATION_FAILED'
  | 'PERMISSION_DENIED'
  | 'TRANSACTION_FAILED';

export class CheckoutError extends Error {
  code: CheckoutErrorCode;
  productId?: string;
  productName?: string;
  currentStock?: number;
  requestedQuantity?: number;
  expectedPrice?: number;
  actualPrice?: number;
  orderId?: string;
  originalError?: string;

  constructor(code: CheckoutErrorCode, message: string, details?: Partial<CheckoutError>) {
    super(message);
    this.name = 'CheckoutError';
    this.code = code;
    if (details) {
      Object.assign(this, details);
    }
  }
}

export interface CheckoutItemRequest {
  productId: string;
  selectedSize: string;
  quantity: number;
  expectedPrice?: number; // client-reported price to verify against trusted price
}

export interface ExecuteCheckoutParams {
  items: CheckoutItemRequest[];
  shippingInfo: OrderShippingInfo;
  appliedCoupon?: Coupon | null;
  shippingMethod?: 'standard' | 'express';
  orderId?: string;
  idempotencyKey?: string;
  notes?: string;
  adminNotes?: string;
  userId?: string | null;
  customerEmail?: string;
}

export interface ExecuteCheckoutResult {
  order: PlacedOrder;
  deductions: Array<{
    productId: string;
    productName: string;
    previousStock: number;
    deductedQuantity: number;
    newStock: number;
  }>;
  isIdempotentReplay?: boolean;
}

/**
 * Normalizes an individual order item for backward and forward compatibility.
 * Supports both modern OrderItem format (with snapshot fields) and legacy format (with full product object).
 */
export function normalizeOrderItem(rawItem: any): OrderItem {
  if (!rawItem) {
    return {
      productId: '',
      name: 'Sản phẩm',
      slug: '',
      price: 0,
      image: '',
      selectedSize: '',
      quantity: 1
    };
  }

  const productId = rawItem.productId || rawItem.product?.id || '';
  const name = rawItem.name || rawItem.product?.name || 'Sản phẩm';
  const slug = rawItem.slug || rawItem.product?.slug || '';
  const price = typeof rawItem.price === 'number' 
    ? rawItem.price 
    : (typeof rawItem.product?.price === 'number' ? rawItem.product.price : 0);
  const image = rawItem.image || rawItem.product?.images?.[0] || '';
  const selectedSize = rawItem.selectedSize || '';
  const quantity = typeof rawItem.quantity === 'number' && rawItem.quantity > 0 
    ? rawItem.quantity 
    : 1;

  const item: OrderItem = {
    productId,
    name,
    slug,
    price,
    image,
    selectedSize,
    quantity
  };

  // Retain legacy product object reference if present for backward compatibility
  if (rawItem.product) {
    item.product = rawItem.product;
  }

  return item;
}

/**
 * Normalizes a placed order document so items are always valid OrderItem[]
 */
export function normalizeOrder(rawOrder: any): PlacedOrder {
  if (!rawOrder) return rawOrder;

  const items: OrderItem[] = Array.isArray(rawOrder.items)
    ? rawOrder.items.map(normalizeOrderItem)
    : [];

  return {
    ...rawOrder,
    items,
    paymentStatus: rawOrder.paymentStatus || 'unpaid'
  };
}

/**
 * Executes an atomic checkout transaction:
 * 1. Reads all products from Firestore inside an atomic transaction.
 * 2. Validates product existence, active numeric stock, size validity, and client price matches trusted Firestore price.
 * 3. Validates total requested quantity per product does not exceed current stock.
 * 4. Computes trusted order subtotal and total using Firestore prices.
 * 5. Atomically decrements product stock and creates order document in Firestore.
 * 
 * If stock is insufficient or any failure occurs, the entire transaction is aborted and rolled back.
 */
export async function executeAtomicCheckout(
  params: ExecuteCheckoutParams,
  firestoreDb = db
): Promise<ExecuteCheckoutResult> {
  const { 
    items, 
    shippingInfo, 
    shippingMethod,

    idempotencyKey,
  } = params;

  if (!items || items.length === 0) {
    throw new CheckoutError('INVALID_QUANTITY', 'Giỏ hàng của bạn đang trống.');
  }

  const targetOrderId = idempotencyKey || `DF-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const executeCheckout = httpsCallable(functions, 'executeCheckout');
    
    // We only send trusted primitives, ignoring any client-calculated subtotals or prices
    const response = await executeCheckout({
      items: items.map(item => ({
        productId: item.productId,
        selectedSize: item.selectedSize,
        quantity: item.quantity
      })),
      shippingInfo,
      shippingMethod,
  
      idempotencyKey: targetOrderId
    });

    const orderData = response.data as PlacedOrder;

    return {
      order: normalizeOrder(orderData),
      deductions: [] // No longer tracking local deductions, server handles this safely
    };
  } catch (error: any) {
    console.error('Cloud Function checkout failed:', error);
    
    const errorCode = error?.code || 'internal';
    const message = error?.message || 'Quá trình đặt hàng thất bại.';

    if (errorCode === 'not-found') {
       throw new CheckoutError('PRODUCT_NOT_FOUND', message);
    }
    if (errorCode === 'failed-precondition') {
       throw new CheckoutError('OUT_OF_STOCK', message);
    }
    if (errorCode === 'invalid-argument') {
       throw new CheckoutError('INVALID_QUANTITY', message);
    }
    
    throw new CheckoutError(
      'TRANSACTION_FAILED',
      message,
      { originalError: error }
    );
  }
}

/**
 * Update order status and optional notes in Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: OrderStatus,
  adminNotes?: string
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (typeof adminNotes === 'string') {
      updates.adminNotes = adminNotes;
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
    throw error;
  }
}

/**
 * Update order payment status (Admin only)
 */
export async function updateOrderPaymentStatusInFirestore(
  orderId: string,
  paymentStatus: 'unpaid' | 'paid'
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating order ${orderId} payment status:`, error);
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
    throw error;
  }
}

/**
 * Fetch all orders sorted by newest first with normalization (Admin only)
 */
export async function getOrdersFromFirestore(): Promise<PlacedOrder[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      await seedInitialOrdersIfEmpty();
      const retrySnap = await getDocs(q);
      return retrySnap.docs.map(d => normalizeOrder(d.data()));
    }
    
    return snapshot.docs.map(d => normalizeOrder(d.data()));
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return [];
  }
}

/**
 * Fetch orders for a specific authenticated customer.
 * Uses query filter where('userId', '==', currentUser.uid) to comply with Firestore security rules.
 */
export async function getCustomerOrders(userId: string): Promise<PlacedOrder[]> {
  if (!userId) return [];
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    try {
      const q = query(
        ordersRef, 
        where('userId', '==', userId), 
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => normalizeOrder(d.data()));
    } catch (err: any) {
      // In case Firestore composite index for (userId ASC, createdAt DESC) is not yet created,
      // fallback to where filter with in-memory sorting so the user is never blocked.
      if (err?.message?.includes('index') || err?.code === 'failed-precondition') {
        console.warn('Index not ready, querying by userId with in-memory sorting:', err);
        const fallbackQ = query(ordersRef, where('userId', '==', userId));
        const snapshot = await getDocs(fallbackQ);
        const orders = snapshot.docs.map(d => normalizeOrder(d.data()));
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      throw err;
    }
  } catch (error) {
    console.error(`Error fetching customer orders for ${userId}:`, error);
    handleFirestoreError(error, OperationType.LIST, `${ORDERS_COLLECTION}?userId=${userId}`);
    return [];
  }
}

/**
 * Fetch a single order by ID for customer detail view
 */
export async function getCustomerOrderById(orderId: string): Promise<PlacedOrder | null> {
  if (!orderId) return null;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return normalizeOrder(snap.data());
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    handleFirestoreError(error, OperationType.GET, `${ORDERS_COLLECTION}/${orderId}`);
    return null;
  }
}

/**
 * Seed realistic initial combat sports orders if orders collection is empty
 */
export async function seedInitialOrdersIfEmpty(): Promise<void> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const checkSnap = await getDocs(ordersRef);
    if (!checkSnap.empty) return;

    const sampleOrders: PlacedOrder[] = [
      {
        orderId: 'DF-829104',
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(), // 3 hours ago
        status: 'pending',
        paymentStatus: 'unpaid',
        items: [
          {
            productId: DEMO_PRODUCTS[0].id,
            name: DEMO_PRODUCTS[0].name,
            slug: DEMO_PRODUCTS[0].slug,
            price: DEMO_PRODUCTS[0].price,
            image: DEMO_PRODUCTS[0].images[0] || '',
            selectedSize: '12oz',
            quantity: 1
          },
          {
            productId: DEMO_PRODUCTS[4].id,
            name: DEMO_PRODUCTS[4].name,
            slug: DEMO_PRODUCTS[4].slug,
            price: DEMO_PRODUCTS[4].price,
            image: DEMO_PRODUCTS[4].images[0] || '',
            selectedSize: '4.5 Mét (Chuẩn quốc tế)',
            quantity: 2
          }
        ],
        shippingInfo: {
          fullName: 'Trần Hoàng Nam',
          phone: '0908123456',
          email: 'nam.tran@boxingvn.com',
          province: 'TP. Hồ Chí Minh',
          district: 'Quận 7',
          ward: 'Phường Tân Hưng',
          address: '42 Đường số 10, KDC Him Lam',
          notes: 'Giao giờ hành chính, gọi trước khi đến',
          paymentMethod: 'cod',
          shippingMethod: 'standard'
        },
        subtotal: 2290000,
        shippingFee: 0,
        discountAmount: 50000,
        total: 2240000,
        adminNotes: 'Khách hàng mới, cần gọi điện xác nhận size 12oz'
      },
      {
        orderId: 'DF-741920',
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(), // 12 hours ago
        status: 'confirmed',
        paymentStatus: 'unpaid',
        items: [
          {
            productId: DEMO_PRODUCTS[2].id,
            name: DEMO_PRODUCTS[2].name,
            slug: DEMO_PRODUCTS[2].slug,
            price: DEMO_PRODUCTS[2].price,
            image: DEMO_PRODUCTS[2].images[0] || '',
            selectedSize: 'M',
            quantity: 1
          },
          {
            productId: DEMO_PRODUCTS[5].id,
            name: DEMO_PRODUCTS[5].name,
            slug: DEMO_PRODUCTS[5].slug,
            price: DEMO_PRODUCTS[5].price,
            image: DEMO_PRODUCTS[5].images[0] || '',
            selectedSize: 'L (1m70 - 1m85)',
            quantity: 1
          }
        ],
        shippingInfo: {
          fullName: 'Lê Quốc Đạt',
          phone: '0912348899',
          email: 'dat.le@mmafighter.vn',
          province: 'Hà Nội',
          district: 'Quận Cầu Giấy',
          ward: 'Phường Dịch Vọng',
          address: 'Tòa nhà FPT, Số 10 Phạm Văn Bạch',
          notes: 'Giao cho lễ tân nếu không nghe máy',
          paymentMethod: 'vietqr',
          shippingMethod: 'express'
        },
        subtotal: 2540000,
        shippingFee: 0,
        discountAmount: 0,
        total: 2540000,
        adminNotes: 'Đã nhận chuyển khoản MB Bank thành công. Chuẩn bị đóng gói.'
      },
      {
        orderId: 'DF-632015',
        createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(), // 1.5 days ago
        status: 'shipping',
        paymentStatus: 'unpaid',
        items: [
          {
            productId: DEMO_PRODUCTS[6].id,
            name: DEMO_PRODUCTS[6].name,
            slug: DEMO_PRODUCTS[6].slug,
            price: DEMO_PRODUCTS[6].price,
            image: DEMO_PRODUCTS[6].images[0] || '',
            selectedSize: 'L (Chu vi đầu 58-61cm)',
            quantity: 1
          },
          {
            productId: DEMO_PRODUCTS[7].id,
            name: DEMO_PRODUCTS[7].name,
            slug: DEMO_PRODUCTS[7].slug,
            price: DEMO_PRODUCTS[7].price,
            image: DEMO_PRODUCTS[7].images[0] || '',
            selectedSize: 'Free Size (Người lớn từ 16 tuổi)',
            quantity: 1
          }
        ],
        shippingInfo: {
          fullName: 'Phạm Minh Tuấn',
          phone: '0983112233',
          email: 'tuan.pm@combatclub.vn',
          province: 'Đà Nẵng',
          district: 'Quận Hải Châu',
          ward: 'Phường Hải Châu 1',
          address: '88 Bạch Đằng',
          notes: 'Giao nhanh giúp mình để kịp thứ Bảy sparring',
          paymentMethod: 'vietqr',
          shippingMethod: 'express'
        },
        subtotal: 1880000,
        shippingFee: 0,
        discountAmount: 100000,
        total: 1780000,
        adminNotes: 'Mã vận đơn ViettelPost: VTP88392019VN'
      },
      {
        orderId: 'DF-518290',
        createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(), // 3 days ago
        status: 'completed',
        paymentStatus: 'paid',
        items: [
          {
            productId: DEMO_PRODUCTS[1].id,
            name: DEMO_PRODUCTS[1].name,
            slug: DEMO_PRODUCTS[1].slug,
            price: DEMO_PRODUCTS[1].price,
            image: DEMO_PRODUCTS[1].images[0] || '',
            selectedSize: '10oz',
            quantity: 1
          },
          {
            productId: DEMO_PRODUCTS[10].id,
            name: DEMO_PRODUCTS[10].name,
            slug: DEMO_PRODUCTS[10].slug,
            price: DEMO_PRODUCTS[10].price,
            image: DEMO_PRODUCTS[10].images[0] || '',
            selectedSize: 'M (55-68kg)',
            quantity: 1
          }
        ],
        shippingInfo: {
          fullName: 'Nguyễn Thị Bích Ngọc',
          phone: '0977889900',
          email: 'bichngoc.fit@gmail.com',
          province: 'Hà Nội',
          district: 'Quận Đống Đa',
          ward: 'Phường Láng Thượng',
          address: 'Số 15 Ngõ 82 Chùa Láng',
          paymentMethod: 'cod',
          shippingMethod: 'standard'
        },
        subtotal: 1380000,
        shippingFee: 0,
        discountAmount: 50000,
        total: 1330000,
        adminNotes: 'Khách đã nhận hàng và thanh toán COD đầy đủ.'
      }
    ];

    const batch = writeBatch(db);
    for (const order of sampleOrders) {
      const docRef = doc(db, ORDERS_COLLECTION, order.orderId);
      batch.set(docRef, JSON.parse(JSON.stringify(order)));
    }
    await batch.commit();
    console.log('Seeded initial orders into Firestore');
  } catch (err) {
    console.error('Failed to seed sample orders:', err);
  }
}
