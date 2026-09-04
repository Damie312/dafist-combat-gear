import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  getProductsFromFirestore, 
  migrateExistingProductsToFirestore 
} from '../services/productService';
import { 
  PageType, 
  Product, 
  CartItem, 
  ProductCategory, 
  CombatSport, 
  ExperienceLevel, 
  Coupon,
  PlacedOrder,
  calculateShippingFee
} from '../types';
import { DEMO_COUPONS, DEMO_PRODUCTS } from '../data/products';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  currentPage: PageType;
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  selectedProduct: Product | null;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  cartTotal: number;
  activeCoupon: Coupon | null;
  placedOrder: PlacedOrder | null;
  toasts: ToastState[];
  sizeGuideOpen: boolean;
  
  // Filters
  searchTerm: string;
  categoryFilter: ProductCategory;
  sportFilter: CombatSport;
  levelFilter: ExperienceLevel;
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';

  // Actions
  navigateTo: (page: PageType, product?: Product) => void;
  addToCart: (product: Product, selectedSize: string, quantity?: number) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (cat: ProductCategory) => void;
  setSportFilter: (sport: CombatSport) => void;
  setLevelFilter: (level: ExperienceLevel) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  setSizeGuideOpen: (open: boolean) => void;
  setPlacedOrder: (order: PlacedOrder | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dafist_cart_v1';
let toastSequence = 0;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  // Real-time listener for Firestore "products" collection
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const productsRef = collection(db, 'products');
      unsubscribe = onSnapshot(
        productsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const rawDocs = snapshot.docs.map((d) => ({
              ...d.data(),
              id: d.data().id || d.id
            } as Product));

            // Deduplicate products by id to ensure unique keys throughout the application
            const uniqueMap = new Map<string, Product>();
            rawDocs.forEach((prod) => {
              uniqueMap.set(prod.id, prod);
            });
            const fetched = Array.from(uniqueMap.values());

            setProducts(fetched);
            setIsLoadingProducts(false);
          } else {
            // Auto migrate if empty
            migrateExistingProductsToFirestore().then(() => {
              setIsLoadingProducts(false);
            });
          }
        },
        (error) => {
          if (error.code === 'unavailable') {
            console.warn('Firestore backend temporarily unavailable, operating in offline/cached mode:', error.message);
          } else {
            console.error('Firestore products listener error, falling back to initial data:', error);
          }
          setIsLoadingProducts(false);
        }
      );
    } catch (err) {
      console.error('Failed to attach Firestore listener:', err);
      setIsLoadingProducts(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    const updated = await getProductsFromFirestore();
    const uniqueMap = new Map<string, Product>();
    updated.forEach((p) => uniqueMap.set(p.id, p));
    setProducts(Array.from(uniqueMap.values()));
    setIsLoadingProducts(false);
  };

  // Sync selectedProduct if products array updates (including stock updates from Firestore)
  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const updated = products.find((p) => p.id === selectedProduct.id || p.slug === selectedProduct.slug);
      if (
        updated &&
        (updated.price !== selectedProduct.price ||
          updated.name !== selectedProduct.name ||
          updated.stock !== selectedProduct.stock ||
          updated.images[0] !== selectedProduct.images[0])
      ) {
        setSelectedProduct(updated);
      }
    }
  }, [products, selectedProduct]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>('all');
  const [sportFilter, setSportFilter] = useState<CombatSport>('all');
  const [levelFilter, setLevelFilter] = useState<ExperienceLevel>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3500000]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Cart with local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Scroll to top on page navigation
  const navigateTo = (page: PageType, product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}_${++toastSequence}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, selectedSize: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, { product, selectedSize, quantity }];
      }
    });

    showToast(`Đã thêm "${product.name}" (${selectedSize}) vào giỏ hàng!`, 'success');
  };

  const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = DEMO_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }

    if (found.minOrderValue && cartSubtotal < found.minOrderValue) {
      return { 
        success: false, 
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(found.minOrderValue)}₫.` 
      };
    }

    setActiveCoupon(found);
    showToast(`Áp dụng thành công mã ${found.code}!`, 'success');
    return { success: true, message: 'Áp dụng mã giảm giá thành công!' };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Đã hủy áp dụng mã giảm giá', 'info');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSportFilter('all');
    setLevelFilter('all');
    setPriceRange([0, 3500000]);
    setSortBy('featured');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Unified shipping fee: standard 35,000 VND, free if subtotal >= 1,000,000 VND
  const shippingFee = cartSubtotal === 0 ? 0 : calculateShippingFee(cartSubtotal, 'standard');

  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * activeCoupon.value) / 100);
    } else {
      discountAmount = activeCoupon.value;
    }
    if (discountAmount > cartSubtotal) {
      discountAmount = cartSubtotal;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        products,
        isLoadingProducts,
        refreshProducts,
        selectedProduct,
        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        cartTotal,
        activeCoupon,
        placedOrder,
        toasts,
        sizeGuideOpen,
        searchTerm,
        categoryFilter,
        sportFilter,
        levelFilter,
        priceRange,
        sortBy,
        navigateTo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSearchTerm,
        setCategoryFilter,
        setSportFilter,
        setLevelFilter,
        setPriceRange,
        setSortBy,
        resetFilters,
        showToast,
        removeToast,
        setSizeGuideOpen,
        setPlacedOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
