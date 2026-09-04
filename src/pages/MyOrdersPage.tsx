import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useShop } from '../context/ShopContext';
import { getCustomerOrders } from '../services/orderService';
import { PlacedOrder, OrderStatus } from '../types';
import { formatVND } from '../utils/formatters';
import { CustomerOrderDetailModal } from '../components/customer/CustomerOrderDetailModal';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  RefreshCw, 
  ShoppingBag, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { customer, isLoading: isAuthLoading } = useCustomerAuth();
  const { navigateTo } = useShop();

  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadOrders = async () => {
    if (!customer?.uid) return;
    setIsLoadingOrders(true);
    setFetchError(null);
    try {
      const customerOrders = await getCustomerOrders(customer.uid);
      setOrders(customerOrders);
    } catch (err: any) {
      console.error('Failed to load customer orders:', err);
      setFetchError('Không thể tải danh sách đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (customer?.uid) {
      loadOrders();
    }
  }, [customer?.uid]);

  // Auth loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-zinc-400">
        <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Đang kiểm tra tài khoản...</p>
      </div>
    );
  }

  // If customer is not authenticated: Prompt to login/redirect to account
  if (!customer) {
    return (
      <div className="min-h-[70vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-none bg-red-950/40 border border-red-600 text-red-500 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Đơn Hàng Của Bạn
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vui lòng đăng nhập tài khoản DAFIST để xem lịch sử và tra cứu trạng thái các đơn hàng đã đặt.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigateTo('account')}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Đăng Nhập Ngay
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest border border-white/10 transition-colors cursor-pointer"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Chờ Xử Lý
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Đã Xác Nhận
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold uppercase tracking-wider">
            <Truck className="w-3 h-3" /> Đang Giao
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
            <Package className="w-3 h-3" /> Hoàn Thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Đã Hủy
          </span>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigateTo('account')}
              className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tài Khoản</span>
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-red-500 uppercase tracking-widest font-bold">Lịch Sử Đơn Hàng</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Theo dõi tình trạng đơn hàng và xem lại thông tin những trang thiết bị bạn đã đặt mua tại DAFIST.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            disabled={isLoadingOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mua Sắm Thêm</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'Tất cả', count: orders.length },
          { id: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
          { id: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
          { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
          { id: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
          { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-[#0a0a0a] text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {fetchError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {fetchError}
        </div>
      )}

      {/* Orders Content */}
      {isLoadingOrders ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Đang đồng bộ danh sách đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 px-6 bg-[#0a0a0a] border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-900 text-zinc-600 mx-auto flex items-center justify-center border border-white/10">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {statusFilter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng nào trong trạng thái này'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {statusFilter === 'all' 
                ? 'Khi bạn tiến hành đặt hàng với tài khoản DAFIST, các đơn hàng sẽ được lưu tại đây để bạn tiện theo dõi.'
                : 'Thử chuyển sang bộ lọc khác hoặc kiểm tra lại các đơn hàng đã đặt.'}
            </p>
          </div>
          {statusFilter === 'all' && (
            <button
              onClick={() => navigateTo('products')}
              className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Khám Phá Sản Phẩm Ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div 
                key={order.orderId}
                className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Top header row: Order ID, Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Mã Đơn:</span>
                    <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-1">
                      {order.orderId}
                    </span>
                    <span className="text-zinc-500 text-xs">
                      • {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items summary list */}
                <div className="space-y-2.5">
                  {order.items.map((it, idx) => {
                    const itName = it.name || it.product?.name || 'Sản phẩm';
                    const itImg = it.image || it.product?.images?.[0];

                    return (
                      <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {itImg ? (
                            <img 
                              src={itImg} 
                              alt={itName} 
                              className="w-10 h-10 object-cover bg-zinc-900 border border-white/10 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate max-w-sm sm:max-w-md">
                              {itName}
                            </p>
                            <p className="text-zinc-400 text-[11px]">
                              {it.selectedSize ? `Size: ${it.selectedSize} • ` : ''}Số lượng: <strong className="text-zinc-200">x{it.quantity}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-mono text-zinc-300 text-xs">
                            {formatVND(it.price * it.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom summary bar: Total & Action */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-zinc-400">
                    <span>Tổng cộng ({totalItemsCount} món): </span>
                    <span className="font-display font-black text-base text-red-500 ml-1">
                      {formatVND(order.total)}
                    </span>
                    <span className="text-[11px] text-zinc-500 ml-2">
                      ({order.shippingInfo.paymentMethod === 'cod' ? 'COD' : 'VietQR'})
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                  >
                    <span>Xem Chi Tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Order Detail Modal */}
      {selectedOrder && (
        <CustomerOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
