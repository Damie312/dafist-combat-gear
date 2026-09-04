import React from 'react';
import { 
  X, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { PlacedOrder, OrderStatus } from '../../types';
import { formatVND } from '../../utils/formatters';

interface CustomerOrderDetailModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
}

export const CustomerOrderDetailModal: React.FC<CustomerOrderDetailModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Chờ Xử Lý
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã Xác Nhận
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" /> Đang Giao Hàng
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" /> Hoàn Thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" /> Đã Hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        id="customer-order-detail-modal"
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-none shadow-2xl my-8 text-white overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                CHI TIẾT ĐƠN HÀNG
              </span>
              <span className="font-mono text-sm font-bold text-white bg-white/10 px-2 py-0.5">
                {order.orderId}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Status Banner */}
          <div className="p-4 bg-zinc-900/70 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                Trạng Thái Hiện Tại
              </p>
              <div className="mt-1">
                {getStatusBadge(order.status)}
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 sm:text-right">
              {order.status === 'pending' && 'Đơn hàng đang chờ nhân viên DAFIST liên hệ xác nhận size và thời gian giao.'}
              {order.status === 'confirmed' && 'Đơn hàng đã được xác nhận và đang được đóng gói cẩn thận.'}
              {order.status === 'shipping' && 'Đơn hàng đang trên đường vận chuyển tới địa chỉ của bạn.'}
              {order.status === 'completed' && 'Đơn hàng đã được giao thành công. Chúc bạn có những giờ tập luyện bùng nổ!'}
              {order.status === 'cancelled' && 'Đơn hàng này đã bị hủy.'}
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-2">
              Danh Sách Sản Phẩm ({order.items.length} món)
            </h4>
            <div className="divide-y divide-white/5 border border-white/10 bg-black">
              {order.items.map((item, idx) => {
                const itemName = item.name || item.product?.name || 'Sản phẩm';
                const itemImg = item.image || item.product?.images?.[0];
                const itemTotal = item.price * item.quantity;

                return (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {itemImg ? (
                        <img 
                          src={itemImg} 
                          alt={itemName} 
                          className="w-12 h-12 object-cover bg-zinc-900 shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{itemName}</p>
                        {item.selectedSize && (
                          <p className="text-zinc-400 text-[11px]">
                            Kích cỡ: <span className="text-zinc-200">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-zinc-400 text-[11px]">
                          Số lượng: <strong className="text-white">x{item.quantity}</strong> × {formatVND(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-white text-xs">
                        {formatVND(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Receiver & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Địa Chỉ Giao Hàng
              </h4>
              <div className="space-y-1 text-zinc-300 text-[11px] leading-relaxed">
                <p className="font-bold text-white">{order.shippingInfo.fullName}</p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  <span>{order.shippingInfo.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  <span>{order.shippingInfo.email}</span>
                </p>
                <p className="pt-1 text-zinc-400">
                  {order.shippingInfo.address}, {order.shippingInfo.ward ? `${order.shippingInfo.ward}, ` : ''}{order.shippingInfo.district}, {order.shippingInfo.province}
                </p>
                {order.notes && (
                  <p className="pt-1 text-amber-400 text-[10px] italic">
                    Ghi chú khách: "{order.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-zinc-900/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500" />
                Vận Chuyển & Thanh Toán
              </h4>
              <div className="space-y-1.5 text-zinc-300 text-[11px]">
                <div>
                  <span className="text-zinc-500">Hình thức giao: </span>
                  <span className="font-semibold text-white uppercase">
                    {order.shippingInfo.shippingMethod === 'express' ? 'Hỏa tốc (Express 24h)' : 'Tiêu chuẩn (Standard 2-4 ngày)'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Phương thức: </span>
                  <span className="font-semibold text-white">
                    {order.shippingInfo.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản VietQR'}
                  </span>
                </div>

                {order.shippingInfo.paymentMethod === 'vietqr' && (
                  <div className="p-2.5 bg-black border border-red-600/30 text-[10px] text-zinc-300 space-y-1 mt-2">
                    <p className="font-bold text-red-400 uppercase">Thông tin tài khoản DAFIST:</p>
                    <p>MB Bank: <strong>8888.6666.9999</strong></p>
                    <p>Cú pháp: <strong className="text-red-400 font-mono">{order.orderId}</strong></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Totals Breakdown */}
          <div className="p-4 bg-zinc-900/60 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-zinc-400 text-xs">
              <span>Tạm tính ({order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm):</span>
              <span className="font-mono text-zinc-200">{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400 text-xs">
              <span>Phí vận chuyển:</span>
              <span className="font-mono text-zinc-200">
                {order.shippingFee === 0 ? 'Miễn phí (Free)' : formatVND(order.shippingFee)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center text-red-400 text-xs">
                <span>Giảm giá khuyến mãi:</span>
                <span className="font-mono">-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-bold text-white uppercase tracking-wider text-xs">Tổng Thanh Toán:</span>
              <span className="font-display font-black text-xl text-red-500">
                {formatVND(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-zinc-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
