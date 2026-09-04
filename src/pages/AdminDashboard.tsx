import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, PlacedOrder, OrderStatus, ProductCategory, CombatSport } from '../types';
import { formatVND } from '../utils/formatters';
import { 
  CATEGORY_LABELS, 
  SPORT_LABELS 
} from '../data/products';
import { 
  updateProductStockInFirestore, 
  deleteProductFromFirestore 
} from '../services/productService';
import { 
  getOrdersFromFirestore, 
  updateOrderStatusInFirestore,
  seedInitialOrdersIfEmpty,
  normalizeOrder
} from '../services/orderService';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminProductModal } from '../components/admin/AdminProductModal';
import { AdminOrderDetailModal } from '../components/admin/AdminOrderDetailModal';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  RefreshCw, 
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  Filter,
  Eye,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    refreshProducts, 
    navigateTo, 
    showToast 
  } = useShop();

  const { user, logout } = useAdminAuth();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('products');

  // Orders state with Firestore listener
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<PlacedOrder | null>(null);

  // Products filtering in Admin
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSportFilter, setProductSportFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Orders filtering in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Real-time Firestore orders listener
  useEffect(() => {
    setIsLoadingOrders(true);
    // Seed initial orders if collection is empty
    seedInitialOrdersIfEmpty();

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => {
        const data = normalizeOrder(doc.data());
        return { ...data, orderId: data.orderId || doc.id };
      });
      const uniqueOrdersMap = new Map<string, PlacedOrder>();
      liveOrders.forEach(o => uniqueOrdersMap.set(o.orderId, o));
      setOrders(Array.from(uniqueOrdersMap.values()));
      setIsLoadingOrders(false);
    }, (error) => {
      if (error.code === 'unavailable') {
        console.warn('Firestore orders temporarily unavailable, operating in offline/cached mode:', error.message);
      } else {
        console.error('Error listening to Firestore orders:', error);
      }
      getOrdersFromFirestore().then(fallbackOrders => {
        const uniqueOrdersMap = new Map<string, PlacedOrder>();
        fallbackOrders.forEach(o => uniqueOrdersMap.set(o.orderId, o));
        setOrders(Array.from(uniqueOrdersMap.values()));
        setIsLoadingOrders(false);
      });
    });

    return () => unsubscribe();
  }, []);

  // Filtered Products for Table
  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesId = p.id.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesBrand) return false;
      }

      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }

      if (productSportFilter !== 'all' && p.sport !== 'all' && p.sport !== productSportFilter) {
        return false;
      }

      const currentStock = typeof p.stock === 'number' ? p.stock : 25;
      if (stockStatusFilter === 'out-of-stock' && currentStock > 0) return false;
      if (stockStatusFilter === 'low-stock' && (currentStock <= 0 || currentStock > 10)) return false;
      if (stockStatusFilter === 'in-stock' && currentStock <= 10) return false;

      return true;
    });
  }, [products, productSearch, productCategoryFilter, productSportFilter, stockStatusFilter]);

  // Filtered Orders for Table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }

      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim();
        const matchId = o.orderId.toLowerCase().includes(q);
        const matchName = o.shippingInfo?.fullName?.toLowerCase().includes(q);
        const matchPhone = o.shippingInfo?.phone?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Quick stock adjuster
  const handleAdjustStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await updateProductStockInFirestore(productId, newStock);
      showToast(`Đã cập nhật tồn kho: ${newStock} chiếc`, 'info');
    } catch (err) {
      console.error('Failed to update stock:', err);
      showToast('Không thể cập nhật tồn kho', 'error');
    }
  };

  // Direct manual stock change
  const handleDirectStockChange = async (productId: string, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    try {
      await updateProductStockInFirestore(productId, num);
      showToast(`Đã lưu số lượng tồn: ${num}`, 'info');
    } catch (err) {
      console.error('Failed to update stock:', err);
      showToast('Lỗi cập nhật số lượng tồn kho', 'error');
    }
  };

  // Delete product action
  const confirmDeleteProduct = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteProductFromFirestore(deleteCandidate.id);
      showToast(`Đã xóa sản phẩm "${deleteCandidate.name}" khỏi Firestore!`, 'success');
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast('Có lỗi xảy ra khi xóa sản phẩm', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Order Status change from table
  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      showToast(`Đã chuyển đơn ${orderId} sang trạng thái mới`, 'success');
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  // Analytics summary
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'completed' || o.status === 'shipping')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => (p.stock ?? 25) <= 10).length;

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> Đã xác nhận</span>;
      case 'shipping':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase"><Truck className="w-3 h-3" /> Đang giao</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase"><Package className="w-3 h-3" /> Hoàn thành</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase"><XCircle className="w-3 h-3" /> Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-zinc-950 border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Admin Title & Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 bg-red-600 text-white flex items-center justify-center font-black rounded-none">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                    DAFIST <span className="text-red-500">ADMIN</span>
                  </span>
                  <span className="hidden sm:inline-block bg-zinc-800 text-zinc-300 text-[9px] font-bold uppercase px-2 py-0.5 border border-white/10">
                    Console v2.0
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Firestore Cloud Database Connected</span>
                </div>
              </div>
            </div>

            {/* View Mode Switching / Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user?.email && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-300 font-mono text-[11px] max-w-[180px] truncate">{user.email}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 font-bold border border-red-500/30">ADMIN</span>
                </div>
              )}

              <button
                id="btn-back-to-store"
                onClick={() => navigateTo('home')}
                className="px-3.5 sm:px-4 py-2 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Về Cửa Hàng</span>
                <span className="sm:hidden">Store</span>
              </button>

              <button
                id="btn-admin-logout"
                onClick={logout}
                className="px-3 sm:px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600 text-red-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                title="Đăng xuất khỏi Cổng Quản Trị"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-4 border-t border-white/5 pt-1 text-xs font-bold uppercase tracking-widest overflow-x-auto scrollbar-none">
            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-red-600 text-white bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-red-500" />
              <span>Sản Phẩm & Quản Lý Kho ({products.length})</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-red-600 text-white bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-red-500" />
              <span>Quản Lý Đơn Hàng ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount} mới
                </span>
              )}
            </button>

            <button
              id="admin-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-red-600 text-white bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-red-500" />
              <span>Tổng Quan & Doanh Số</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= TAB 1: SẢN PHẨM & KHO HÀNG ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-950 p-4 sm:p-5 border border-white/10">
              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm tên, mã sản phẩm..."
                    className="w-full bg-zinc-900 border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-red-600 font-sans"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-zinc-900 border border-white/10 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-red-600"
                >
                  <option value="all">Tất Cả Danh Mục</option>
                  <option value="gloves">{CATEGORY_LABELS['gloves']}</option>
                  <option value="mma-gloves">{CATEGORY_LABELS['mma-gloves']}</option>
                  <option value="protection">{CATEGORY_LABELS['protection']}</option>
                  <option value="training-gear">{CATEGORY_LABELS['training-gear']}</option>
                  <option value="apparel-acc">{CATEGORY_LABELS['apparel-acc']}</option>
                </select>

                <select
                  value={productSportFilter}
                  onChange={(e) => setProductSportFilter(e.target.value)}
                  className="bg-zinc-900 border border-white/10 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-red-600"
                >
                  <option value="all">Tất Cả Bộ Môn</option>
                  <option value="boxing">{SPORT_LABELS['boxing']}</option>
                  <option value="mma">{SPORT_LABELS['mma']}</option>
                  <option value="muaythai">{SPORT_LABELS['muaythai']}</option>
                </select>

                <select
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value as any)}
                  className="bg-zinc-900 border border-white/10 text-xs text-white px-3 py-2.5 focus:outline-none focus:border-red-600"
                >
                  <option value="all">Mọi mức tồn kho</option>
                  <option value="in-stock">Sẵn hàng (&gt; 10)</option>
                  <option value="low-stock">Cận hết hàng (1 - 10)</option>
                  <option value="out-of-stock">Hết hàng (0)</option>
                </select>
              </div>

              {/* Add New Product Button */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-create-product"
                  onClick={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Sản Phẩm Mới
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-900/60 text-zinc-400 uppercase tracking-wider font-bold text-[10px]">
                      <th className="p-3.5 sm:p-4">Sản Phẩm & Thương Hiệu</th>
                      <th className="p-3.5 sm:p-4">Bộ Môn / Phân Loại</th>
                      <th className="p-3.5 sm:p-4">Giá Bán</th>
                      <th className="p-3.5 sm:p-4">Tồn Kho (Realtime)</th>
                      <th className="p-3.5 sm:p-4">Cờ Trạng Thái</th>
                      <th className="p-3.5 sm:p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((prod) => {
                        const stockVal = typeof prod.stock === 'number' ? prod.stock : 25;
                        const isLowStock = stockVal > 0 && stockVal <= 10;
                        const isOutOfStock = stockVal === 0;

                        return (
                          <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors group">
                            {/* Product Info */}
                            <td className="p-3.5 sm:p-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black border border-white/10 shrink-0 overflow-hidden relative">
                                  <img
                                    src={prod.images[0]}
                                    alt={prod.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="min-w-0 max-w-xs sm:max-w-sm">
                                  <span className="text-[10px] text-zinc-500 uppercase font-mono block truncate">
                                    ID: {prod.id}
                                  </span>
                                  <p className="font-bold text-white text-xs sm:text-sm truncate">
                                    {prod.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                    <span className="text-red-400 font-bold uppercase">{prod.brand}</span>
                                    <span>•</span>
                                    <span>Sizes: {prod.sizes?.slice(0, 3).join(', ')}{prod.sizes?.length > 3 ? '...' : ''}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category & Sport */}
                            <td className="p-3.5 sm:p-4">
                              <div className="space-y-1">
                                <span className="inline-block px-2 py-0.5 bg-zinc-900 border border-white/10 text-zinc-300 text-[10px] font-medium">
                                  {CATEGORY_LABELS[prod.category] || prod.category}
                                </span>
                                <div className="text-[11px] text-zinc-400 capitalize">
                                  {SPORT_LABELS[prod.sport] || prod.sport}
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="p-3.5 sm:p-4 font-mono">
                              <div className="font-bold text-white text-sm">
                                {formatVND(prod.price)}
                              </div>
                              {prod.originalPrice && (
                                <div className="text-[10px] text-zinc-500 line-through">
                                  {formatVND(prod.originalPrice)}
                                </div>
                              )}
                            </td>

                            {/* Stock Management */}
                            <td className="p-3.5 sm:p-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  {/* Decrement Button */}
                                  <button
                                    onClick={() => handleAdjustStock(prod.id, stockVal, -1)}
                                    className="w-7 h-7 bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-white font-bold transition-colors"
                                    title="Giảm 1 chiếc"
                                  >
                                    -
                                  </button>

                                  {/* Input field */}
                                  <input
                                    type="number"
                                    min="0"
                                    defaultValue={stockVal}
                                    key={`${prod.id}-${stockVal}`}
                                    onBlur={(e) => handleDirectStockChange(prod.id, e.target.value)}
                                    className="w-14 bg-black border border-white/20 text-center font-mono font-bold text-xs py-1 text-white focus:outline-none focus:border-red-500"
                                  />

                                  {/* Increment Button */}
                                  <button
                                    onClick={() => handleAdjustStock(prod.id, stockVal, 5)}
                                    className="w-7 h-7 bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-white font-bold transition-colors"
                                    title="Tăng 5 chiếc"
                                  >
                                    +5
                                  </button>
                                </div>

                                {/* Stock Badge */}
                                <div>
                                  {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold uppercase">
                                      <AlertTriangle className="w-2.5 h-2.5" /> Hết hàng
                                    </span>
                                  ) : isLowStock ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase">
                                      <Clock className="w-2.5 h-2.5" /> Sắp hết ({stockVal})
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                                      <CheckCircle2 className="w-2.5 h-2.5" /> Sẵn hàng ({stockVal})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Status Flags */}
                            <td className="p-3.5 sm:p-4">
                              <div className="flex flex-wrap gap-1">
                                {prod.isFeatured && (
                                  <span className="px-1.5 py-0.5 bg-red-600/20 text-red-400 border border-red-600/40 text-[9px] font-bold uppercase">
                                    Nổi bật
                                  </span>
                                )}
                                {prod.isBestSeller && (
                                  <span className="px-1.5 py-0.5 bg-amber-600/20 text-amber-300 border border-amber-600/40 text-[9px] font-bold uppercase">
                                    Bán chạy
                                  </span>
                                )}
                                {prod.isNew && (
                                  <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-300 border border-blue-600/40 text-[9px] font-bold uppercase">
                                    Mới
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="p-3.5 sm:p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setProductToEdit(prod);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-2 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-zinc-300 transition-colors"
                                  title="Chỉnh sửa sản phẩm"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteCandidate(prod)}
                                  className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white border border-white/10 text-red-400 transition-colors"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: QUẢN LÝ ĐƠN HÀNG ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-950 p-4 sm:p-5 border border-white/10">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[260px] flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                    className="w-full bg-zinc-900 border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-red-600 font-sans"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Quick Filter Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Tất cả', count: orders.length },
                    { id: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
                    { id: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
                    { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
                    { id: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
                    { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length },
                  ].map((filterItem) => (
                    <button
                      key={filterItem.id}
                      onClick={() => setOrderStatusFilter(filterItem.id)}
                      className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                        orderStatusFilter === filterItem.id
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {filterItem.label} ({filterItem.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-900/60 text-zinc-400 uppercase tracking-wider font-bold text-[10px]">
                      <th className="p-3.5 sm:p-4">Mã Đơn & Ngày Đặt</th>
                      <th className="p-3.5 sm:p-4">Khách Hàng & Địa Chỉ</th>
                      <th className="p-3.5 sm:p-4">Sản Phẩm Đặt</th>
                      <th className="p-3.5 sm:p-4">Tổng Tiền & Thanh Toán</th>
                      <th className="p-3.5 sm:p-4">Trạng Thái Đơn Hàng</th>
                      <th className="p-3.5 sm:p-4 text-right">Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoadingOrders ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-400">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                            <span>Đang đồng bộ đơn hàng từ Firestore...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          Không tìm thấy đơn hàng nào trong trạng thái này.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-white/[0.02] transition-colors">
                          {/* Order ID & Time */}
                          <td className="p-3.5 sm:p-4">
                            <span className="font-mono font-bold text-white text-sm block">
                              {order.orderId}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(order.createdAt).toLocaleString('vi-VN')}
                            </span>
                            {order.adminNotes && (
                              <div className="text-[10px] text-red-400 bg-red-950/40 px-1.5 py-0.5 mt-1 border border-red-900/50 truncate max-w-[180px]" title={order.adminNotes}>
                                Note: {order.adminNotes}
                              </div>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="p-3.5 sm:p-4">
                            <p className="font-bold text-white text-xs">
                              {order.shippingInfo?.fullName || 'Khách hàng'}
                            </p>
                            <p className="text-zinc-400 text-[11px] font-mono">
                              {order.shippingInfo?.phone}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate max-w-[200px]" title={`${order.shippingInfo?.address || ''}, ${order.shippingInfo?.ward ? `${order.shippingInfo.ward}, ` : ''}${order.shippingInfo?.district || ''}, ${order.shippingInfo?.province || ''}`}>
                              {order.shippingInfo?.ward ? `${order.shippingInfo.ward}, ` : ''}{order.shippingInfo?.district}, {order.shippingInfo?.province}
                            </p>
                          </td>

                          {/* Items summary */}
                          <td className="p-3.5 sm:p-4">
                            <div className="space-y-1">
                              {order.items?.map((it, idx) => {
                                const itemName = it.name || it.product?.name || 'Sản phẩm';
                                return (
                                  <div key={idx} className="text-zinc-300 text-[11px] truncate max-w-xs">
                                    <strong className="text-white">x{it.quantity}</strong> {itemName} {it.selectedSize ? `(${it.selectedSize})` : ''}
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* Total & Payment */}
                          <td className="p-3.5 sm:p-4">
                            <span className="font-mono font-bold text-white text-sm block">
                              {formatVND(order.total)}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                              {order.shippingInfo?.paymentMethod === 'cod' ? 'COD' : 'VietQR'}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === 'paid' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'Đã T/Toán' : 'Chưa T/Toán'}
                            </span>
                          </td>

                          {/* Status changer */}
                          <td className="p-3.5 sm:p-4">
                            <div className="space-y-1.5">
                              <div>{renderStatusBadge(order.status || 'pending')}</div>
                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => handleQuickStatusChange(order.orderId, e.target.value as OrderStatus)}
                                className="bg-zinc-900 border border-white/10 text-[10px] text-zinc-300 px-2 py-1 focus:outline-none focus:border-red-600 block"
                              >
                                <option value="pending">Chờ xử lý</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="shipping">Đang giao hàng</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                              </select>
                            </div>
                          </td>

                          {/* Details Button */}
                          <td className="p-3.5 sm:p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderForDetail(order)}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Chi Tiết</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TỔNG QUAN & DOANH THU ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-950 p-5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Doanh Thu Thực Thu
                </span>
                <div className="font-mono text-2xl font-black text-white">
                  {formatVND(totalRevenue)}
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Tính từ các đơn hoàn thành và đang giao
                </p>
              </div>

              <div className="bg-zinc-950 p-5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Tổng Số Đơn Hàng
                </span>
                <div className="font-mono text-2xl font-black text-white flex items-center justify-between">
                  <span>{orders.length}</span>
                  {pendingOrdersCount > 0 && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                      {pendingOrdersCount} chờ duyệt
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Lưu trữ trực tiếp trên Firestore
                </p>
              </div>

              <div className="bg-zinc-950 p-5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Mã Hàng Trong Kho
                </span>
                <div className="font-mono text-2xl font-black text-white">
                  {products.length} Sản Phẩm
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Boxing, MMA & Thiết bị bảo hộ DAFIST
                </p>
              </div>

              <div className="bg-zinc-950 p-5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Cảnh Báo Tồn Kho Thấp
                </span>
                <div className={`font-mono text-2xl font-black ${lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {lowStockCount} Mặt Hàng
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Sản phẩm còn ≤ 10 chiếc trong kho
                </p>
              </div>
            </div>

            {/* Low stock alerts table */}
            {lowStockCount > 0 && (
              <div className="bg-zinc-950 border border-amber-500/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      Cảnh Báo Mặt Hàng Cần Bổ Sung Kho Ngay ({lowStockCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setStockStatusFilter('low-stock');
                      setActiveTab('products');
                    }}
                    className="text-xs text-zinc-400 hover:text-white underline"
                  >
                    Xem tất cả trong bảng sản phẩm →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.filter(p => (p.stock ?? 25) <= 10).slice(0, 6).map(p => (
                    <div key={p.id} className="p-3 bg-black border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover shrink-0" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-amber-400 font-mono">Tồn hiện tại: {p.stock ?? 25} chiếc</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdjustStock(p.id, p.stock ?? 25, 20)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-[10px] font-bold uppercase transition-colors shrink-0 ml-2"
                      >
                        +20
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-zinc-950 border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  Đơn Hàng Mới Nhất Cần Xử Lý
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider"
                >
                  Xem toàn bộ đơn hàng →
                </button>
              </div>

              <div className="divide-y divide-white/5 border border-white/5">
                {orders.slice(0, 5).map(ord => (
                  <div key={ord.orderId} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-white text-xs">{ord.orderId}</span>
                        {renderStatusBadge(ord.status || 'pending')}
                        <span className="text-[10px] text-zinc-500">{new Date(ord.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        {ord.shippingInfo?.fullName} ({ord.shippingInfo?.phone}) - {ord.items?.length} sản phẩm
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm text-white">{formatVND(ord.total)}</span>
                      <button
                        onClick={() => setSelectedOrderForDetail(ord)}
                        className="px-3 py-1 bg-zinc-900 hover:bg-white hover:text-black text-xs font-bold border border-white/10 transition-colors"
                      >
                        Xem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaved={refreshProducts}
        showToast={showToast}
      />

      {/* Order Detail Modal */}
      <AdminOrderDetailModal
        order={selectedOrderForDetail}
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
        onUpdated={() => {
          // Orders are updated live via onSnapshot
        }}
        showToast={showToast}
      />

      {/* Delete Product Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-zinc-950 border border-red-600/40 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display font-black text-lg uppercase tracking-tight">
                Xác Nhận Xóa Sản Phẩm
              </h3>
            </div>
            
            <p className="text-xs text-zinc-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm <strong className="text-white">"{deleteCandidate.name}"</strong> (ID: <code className="text-red-400">{deleteCandidate.id}</code>) khỏi Firestore? Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-white/10"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteProduct}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider"
              >
                {isDeleting ? 'Đang Xóa...' : 'Xóa Khỏi Hệ Thống'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
