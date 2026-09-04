export type PageType = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'about' 
  | 'contact'
  | 'account'
  | 'my-orders'
  | 'admin';

export type CombatSport = 'all' | 'boxing' | 'mma' | 'muaythai';

export type ProductCategory = 
  | 'all'
  | 'gloves'          // Găng tay boxing & Muay Thai
  | 'mma-gloves'      // Găng tay MMA hở ngón
  | 'protection'      // Băng quấn, bọc răng, bảo hộ đầu, bọc ống chân
  | 'training-gear'   // Bao cát, đích đấm, đích đá
  | 'apparel-acc';    // Quần áo thi đấu, bình nước, balo

export type ExperienceLevel = 'beginner' | 'intermediate' | 'pro' | 'all';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface ProductReview {
  id: string;
  author: string;
  role?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  sport: CombatSport;
  targetLevel: ExperienceLevel;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock?: number;
  lastOrderRef?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  images: string[];
  sizes: string[]; // e.g. ['10oz', '12oz', '14oz', '16oz'] or ['S', 'M', 'L']
  shortDesc: string;
  fullDesc: string;
  features: string[];
  specs: {
    material: string;
    padding: string;
    closure: string;
    origin: string;
    suitability: string;
  };
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
  /**
   * Optional backward compatibility field for legacy orders stored before OrderItem refactor
   */
  product?: Partial<Product>;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g., 10 for 10% or 50000 for 50k VND
  minOrderValue?: number;
  description: string;
}

export const SHIPPING_CONFIG = {
  STANDARD_FEE: 35000,
  FREE_SHIPPING_THRESHOLD: 1000000,
  EXPRESS_ADDITIONAL_FEE: 30000,
} as const;

export function calculateShippingFee(
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

export interface OrderShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'vietqr';
  shippingMethod: 'standard' | 'express';
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'paid';
  items: OrderItem[];
  shippingInfo: OrderShippingInfo;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  updatedAt?: string;
  notes?: string;
  adminNotes?: string;
  userId?: string | null;
  customerEmail?: string;
}

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  defaultShippingInfo?: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
  };
}
