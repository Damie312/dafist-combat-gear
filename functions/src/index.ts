import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const SHIPPING_CONFIG = {
  STANDARD_FEE: 35000,
  FREE_SHIPPING_THRESHOLD: 1000000,
  EXPRESS_ADDITIONAL_FEE: 30000,
} as const;

function calculateShippingFee(
  subtotal: number, 
  shippingMethod: 'standard' | 'express' = 'standard'
): number {
  if (subtotal <= 0) return 0;
  let fee = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CONFIG.STANDARD_FEE;
  if (shippingMethod === 'express') {
    fee += SHIPPING_CONFIG.EXPRESS_ADDITIONAL_FEE;
  }
  return fee;
}

export const executeCheckout = functions.https.onCall(async (data, context) => {
  const { items, shippingInfo, idempotencyKey } = data;
  const shippingMethod = data.shippingMethod || shippingInfo?.shippingMethod || 'standard';
  const paymentMethod = data.paymentMethod || shippingInfo?.paymentMethod || 'cod';

  // Basic validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "Giỏ hàng của bạn đang trống.");
  }
  if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
    throw new functions.https.HttpsError("invalid-argument", "Vui lòng cung cấp đầy đủ thông tin giao hàng.");
  }
  if (!idempotencyKey) {
    throw new functions.https.HttpsError("invalid-argument", "Thiếu mã xác nhận đơn hàng.");
  }

  const targetOrderId = idempotencyKey;
  const authUid = context.auth?.uid;
  const authEmail = context.auth?.token?.email;

  // Aggregate quantities by product ID
  const aggregatedQtyByProduct = new Map<string, number>();
  for (const item of items) {
    if (typeof item.quantity !== "number" || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      throw new functions.https.HttpsError("invalid-argument", `Số lượng không hợp lệ cho sản phẩm ${item.productId}`);
    }
    const currentQty = aggregatedQtyByProduct.get(item.productId) || 0;
    aggregatedQtyByProduct.set(item.productId, currentQty + item.quantity);
  }
  const uniqueProductIds = Array.from(aggregatedQtyByProduct.keys());

  try {
    const result = await db.runTransaction(async (transaction) => {
      // 1. Idempotency Check
      const orderRef = db.collection("orders").doc(targetOrderId);
      const orderSnap = await transaction.get(orderRef);
      if (orderSnap.exists) {
        return orderSnap.data(); // Safe return
      }

      // 2. Read products
      const productDataMap = new Map<string, any>();
      const productRefMap = new Map<string, admin.firestore.DocumentReference>();

      for (const productId of uniqueProductIds) {
        const pRef = db.collection("products").doc(productId);
        productRefMap.set(productId, pRef);
        const pSnap = await transaction.get(pRef);
        
        if (!pSnap.exists) {
          throw new functions.https.HttpsError("not-found", `Sản phẩm mã "${productId}" không còn tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.`);
        }
        productDataMap.set(productId, pSnap.data());
      }

      // 3. Validate items and prepare OrderItem snapshot
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const trustedProduct = productDataMap.get(item.productId);
        
        // Size check
        if (Array.isArray(trustedProduct.sizes) && trustedProduct.sizes.length > 0) {
          if (!item.selectedSize || !trustedProduct.sizes.includes(item.selectedSize)) {
            throw new functions.https.HttpsError("invalid-argument", `Kích cỡ "${item.selectedSize || 'Chưa chọn'}" không hợp lệ cho sản phẩm "${trustedProduct.name}".`);
          }
        }

        const trustedPrice = trustedProduct.price;
        if (typeof trustedPrice !== "number" || trustedPrice < 0) {
          throw new functions.https.HttpsError("internal", `Giá của sản phẩm "${trustedProduct.name}" trong cơ sở dữ liệu không hợp lệ.`);
        }

        subtotal += trustedPrice * item.quantity;
        orderItems.push({
          productId: item.productId,
          name: trustedProduct.name,
          slug: trustedProduct.slug,
          price: trustedPrice,
          image: (Array.isArray(trustedProduct.images) && trustedProduct.images[0]) ? trustedProduct.images[0] : "",
          selectedSize: item.selectedSize,
          quantity: item.quantity
        });
      }

      // 4. Check Stock Oversold
      for (const [productId, totalRequested] of aggregatedQtyByProduct.entries()) {
        const trustedProduct = productDataMap.get(productId);
        const currentStock = trustedProduct.stock;
        if (typeof currentStock !== 'number' || isNaN(currentStock)) {
           throw new functions.https.HttpsError("internal", `Sản phẩm "${trustedProduct.name}" chưa có dữ liệu tồn kho hợp lệ trên hệ thống.`);
        }
        if (currentStock <= 0) {
           throw new functions.https.HttpsError("failed-precondition", `Sản phẩm "${trustedProduct.name}" hiện đã hết hàng.`);
        }
        if (totalRequested > currentStock) {
          throw new functions.https.HttpsError("failed-precondition", `Số lượng yêu cầu (${totalRequested}) vượt quá số lượng tồn kho khả dụng (${currentStock}) của sản phẩm "${trustedProduct.name}".`);
        }
      }

      // 5. Math
      const shippingFee = calculateShippingFee(subtotal, shippingMethod);
      const discountAmount = 0; // Fixed at 0 to ensure safety. Server does not blindly trust client discount.
      const total = Math.max(0, subtotal + shippingFee - discountAmount);

      const placedOrder = {
        orderId: targetOrderId,
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "unpaid",
        items: orderItems,
        shippingInfo: { ...shippingInfo, shippingMethod, paymentMethod },
        subtotal,
        shippingFee,
        discountAmount,
        total,
        ...(authUid ? { userId: authUid } : {}),
        ...(authEmail ? { customerEmail: authEmail } : {})
      };

      // 6. Write Data
      for (const [productId, totalRequested] of aggregatedQtyByProduct.entries()) {
        const trustedProduct = productDataMap.get(productId);
        const pRef = productRefMap.get(productId)!;
        const newStock = (trustedProduct.stock || 0) - totalRequested;
        transaction.update(pRef, { 
          stock: newStock,
          lastOrderRef: targetOrderId
        });
      }

      transaction.set(orderRef, placedOrder);
      return placedOrder;
    });

    return result;
  } catch (error: any) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error("Transaction Error:", error);
    throw new functions.https.HttpsError("internal", error.message || "Đã xảy ra lỗi hệ thống khi xử lý đơn hàng.");
  }
});
