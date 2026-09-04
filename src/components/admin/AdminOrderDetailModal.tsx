import React, { useState } from 'react';
import { PlacedOrder, OrderStatus } from '../../types';
import { formatVND } from '../../utils/formatters';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Save,
  AlertCircle
} from 'lucide-react';
import { updateOrderStatusInFirestore, updateOrderPaymentStatusInFirestore } from '../../services/orderService';

interface AdminOrderDetailModalProps {
  order: PlacedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdated,
  showToast
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status || 'pending');
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<'unpaid'|'paid'>(order.paymentStatus || 'unpaid');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions: { value: OrderStatus; label: string; desc: string }[] = [
    { value: 'pending', label: 'Chờ Xử Lý', desc: 'Đơn hàng mới tạo, chưa xác nhận' },
    { value: 'confirmed', label: 'Đã Xác Nhận', desc: 'Đã liên hệ/xác thực thanh toán' },
    { value: 'shipping', label: 'Đang Giao Hàng', desc: 'Đã bàn giao đơn vị vận chuyển' },
    { value: 'completed', label: 'Hoàn Thành', desc: 'Khách hàng đã nhận & thanh toán' },
    { value: 'cancelled', label: 'Đã Hủy', desc: 'Đơn hàng bị hủy hoặc hết hàng' },
  ];

  const handleSaveStatus = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatusInFirestore(order.orderId, currentStatus, adminNotes);
      if (currentPaymentStatus !== order.paymentStatus) {
        await updateOrderPaymentStatusInFirestore(order.orderId, currentPaymentStatus);
      }
      showToast(`Đã cập nhật đơn ${order.orderId} thành công!`, 'success');
      onUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to update order status in Firestore:', error);
      const isPermission = error?.message?.includes('permission') || error?.message?.includes('PERMISSION_DENIED');
      if (isPermission) {
        showToast('Lỗi bảo mật (403): Thao tác cập nhật đơn hàng bị từ chối bởi Firestore Rules!', 'error');
      } else {
        showToast('Lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại!', 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> Chờ Xử Lý</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider"><CheckCircle2 className="w-3.5 h-3.5" /> Đã Xác Nhận</span>;
      case 'shipping':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider"><Truck className="w-3.5 h-3.5" /> Đang Giao Hàng</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider"><Package className="w-3.5 h-3.5" /> Hoàn Thành</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider"><XCircle className="w-3.5 h-3.5" /> Đã Hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        id="admin-order-detail-modal"
        className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-none shadow-2xl my-8 text-white overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                QUẢN LÝ ĐƠN HÀNG
              </span>
              <span className="font-mono text-sm font-bold text-white bg-white/10 px-2 py-0.5">
                {order.orderId}
              </span>
              {getStatusBadge(order.status || 'pending')}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Thời gian đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Status Update Control Box */}
          <div className="p-4 bg-zinc-900 border border-white/10 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              Cập Nhật Trạng Thái Xử Lý
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = currentStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCurrentStatus(opt.value)}
                    className={`p-2.5 text-center text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-black text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div>{opt.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-amber-500 inline-block" />
                Trạng Thái Thanh Toán
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPaymentStatus('unpaid')}
                  className={`p-2.5 text-center text-xs font-bold border transition-all ${
                    currentPaymentStatus === 'unpaid'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-black text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  Chưa Thanh Toán
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPaymentStatus('paid')}
                  className={`p-2.5 text-center text-xs font-bold border transition-all ${
                    currentPaymentStatus === 'paid'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-black text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  Đã Thanh Toán
                </button>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] uppercase tracking-wider mb-1 font-bold">
                Ghi chú nội bộ dành cho Admin (Mã vận đơn, biên nhận chuyển khoản,...)
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="VD: Đã gửi qua ViettelPost, mã vận đơn VT882910..."
                className="w-full bg-black border border-white/10 px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-white/5 space-y-2.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-1">
                Thông Tin Người Nhận
              </h4>
              <div className="space-y-1.5 text-zinc-300">
                <p className="font-bold text-white text-sm">{order.shippingInfo.fullName}</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <a href={`tel:${order.shippingInfo.phone}`} className="hover:text-red-400 underline">
                    {order.shippingInfo.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{order.shippingInfo.email}</span>
                </p>
                <p className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>{order.shippingInfo.address}, {order.shippingInfo.ward ? `${order.shippingInfo.ward}, ` : ''}{order.shippingInfo.district}, {order.shippingInfo.province}</span>
                </p>
                {order.shippingInfo.notes && (
                  <p className="p-2 bg-black/40 border border-white/5 text-zinc-400 italic text-[11px] mt-2">
                    "Khách ghi chú: {order.shippingInfo.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-zinc-900/50 border border-white/5 space-y-2.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-1">
                Phương Thức & Vận Chuyển
              </h4>
              <div className="space-y-2 text-zinc-300">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Thanh toán</span>
                  <span className="font-bold uppercase text-xs flex items-center gap-1.5 text-white">
                    <CreditCard className="w-3.5 h-3.5 text-red-500" />
                    {order.shippingInfo.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VietQR 24/7'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Gói vận chuyển</span>
                  <span className="font-bold text-xs text-white">
                    {order.shippingInfo.shippingMethod === 'express' ? 'Hỏa Tốc 24H (Nội thành / Máy bay)' : 'Tiêu Chuẩn (2 - 4 ngày)'}
                  </span>
                </div>
                {order.updatedAt && (
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Cập nhật lần cuối</span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(order.updatedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-2">
              Danh Sách Sản Phẩm Đã Đặt ({order.items.length})
            </h4>

            <div className="border border-white/10 divide-y divide-white/5 bg-black">
              {order.items.map((item, index) => {
                const name = item.name || item.product?.name || 'Sản phẩm';
                const image = item.image || item.product?.images?.[0] || '';
                const price = typeof item.price === 'number' 
                  ? item.price 
                  : (typeof item.product?.price === 'number' ? item.product.price : 0);
                const size = item.selectedSize || '';
                const qty = typeof item.quantity === 'number' ? item.quantity : 1;

                return (
                  <div key={index} className="p-3 flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                      {image ? (
                        <img 
                          src={image} 
                          alt={name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-[9px] text-zinc-600 uppercase font-mono">No img</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-white text-xs truncate">
                        {name}
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                        {size && <span>Size: <strong className="text-white">{size}</strong></span>}
                        <span>Số lượng: <strong className="text-white">x{qty}</strong></span>
                        <span>Đơn giá: {formatVND(price)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-white">
                        {formatVND(price * qty)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="p-4 bg-zinc-900/80 border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính sản phẩm:</span>
                <span className="font-mono text-white">{formatVND(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển:</span>
                <span className="font-mono text-white">
                  {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Giảm giá khuyến mãi:</span>
                  <span className="font-mono">-{formatVND(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span className="uppercase tracking-wider">Tổng Đơn Hàng:</span>
                <span className="font-mono text-lg text-red-500">{formatVND(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-zinc-950">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={handleSaveStatus}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isUpdating ? 'Đang Lưu...' : 'Lưu Thay Đổi Trạng Thái'}
          </button>
        </div>
      </div>
    </div>
  );
};
