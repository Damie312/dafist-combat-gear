import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { formatVND } from '../utils/formatters';
import { executeAtomicCheckout, CheckoutError, CheckoutItemRequest } from '../services/orderService';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ArrowLeft, 
  PackageCheck,
  ChevronRight,
  AlertCircle,
  User as UserIcon
} from 'lucide-react';
import { OrderShippingInfo, PlacedOrder, OrderItem, calculateShippingFee } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    discountAmount, 
    clearCart, 
    navigateTo,
    placedOrder,
    setPlacedOrder,
    showToast,
    activeCoupon
  } = useShop();

  const { customer, customerProfile } = useCustomerAuth();

  const [formData, setFormData] = useState<OrderShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    province: 'Hồ Chí Minh',
    district: '',
    ward: '',
    address: '',
    notes: '',
    paymentMethod: 'cod',
    shippingMethod: 'standard'
  });

  // Track if default shipping info has been pre-filled from customer profile
  const hasPrefilledRef = useRef(false);

  useEffect(() => {
    if (hasPrefilledRef.current) return;
    if (customerProfile || customer) {
      const def = customerProfile?.defaultShippingInfo;
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || def?.fullName || customerProfile?.displayName || customer?.displayName || '',
        phone: prev.phone || def?.phone || customerProfile?.phoneNumber || '',
        email: prev.email || customer?.email || '',
        province: (prev.province && prev.province !== 'Hồ Chí Minh') ? prev.province : (def?.province || prev.province),
        district: prev.district || def?.district || '',
        ward: prev.ward || def?.ward || '',
        address: prev.address || def?.address || ''
      }));
      hasPrefilledRef.current = true;
    }
  }, [customer, customerProfile]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Synchronous submission lock and client idempotency attempt key
  const isSubmittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string>(`DF-${Math.floor(100000 + Math.random() * 900000)}`);

  // If order was placed, display Success screen
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-in fade-in bg-black text-white font-sans">
        <div className="bg-[#080808] border border-white/10 rounded-none p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-none bg-red-950/40 border border-red-600 text-red-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-0.5 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                XÁC NHẬN THÀNH CÔNG
              </span>
              <div className="w-6 h-0.5 bg-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              Cảm Ơn Bạn Đã Chọn DAFIST
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Đơn hàng của bạn đã được tiếp nhận và nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận trong vòng 15 phút.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-black border border-white/10 p-6 rounded-none text-left space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Mã Đơn Hàng:</span>
              <span className="font-mono font-black text-white text-base text-red-500">
                {placedOrder.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Trạng thái thanh toán:</span>
              <span className="font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 uppercase tracking-wider text-[11px]">
                {placedOrder.shippingInfo.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chưa thanh toán'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Người nhận:</span>
              <span className="font-bold text-white">
                {placedOrder.shippingInfo.fullName} - {placedOrder.shippingInfo.phone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Địa chỉ giao:</span>
              <span className="text-zinc-300 text-right max-w-xs truncate">
                {placedOrder.shippingInfo.address}, {placedOrder.shippingInfo.ward ? `${placedOrder.shippingInfo.ward}, ` : ''}{placedOrder.shippingInfo.district}, {placedOrder.shippingInfo.province}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Giao hàng:</span>
              <span className="text-white uppercase font-black text-[11px]">
                {placedOrder.shippingInfo.shippingMethod === 'express' ? 'Hỏa Tốc 24H' : 'Tiêu Chuẩn (2 - 4 ngày)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase tracking-wider font-bold">Phương thức:</span>
              <span className="text-white uppercase font-black text-[11px]">
                {placedOrder.shippingInfo.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
              </span>
            </div>

            {placedOrder.shippingInfo.paymentMethod === 'vietqr' && (
              <div className="p-5 bg-[#080808] border border-red-600/30 rounded-none space-y-4 text-center mt-4">
                <p className="font-black text-white uppercase text-xs text-red-500 tracking-wider">
                  Mã QR Thanh Toán
                </p>
                <div className="w-56 h-56 bg-white mx-auto p-1 flex items-center justify-center border-4 border-black">
                  <img 
                    src={`https://img.vietqr.io/image/970422-888866669999-compact2.jpg?amount=${placedOrder.total}&addInfo=${placedOrder.orderId}&accountName=DAFIST%20COMBAT`} 
                    alt="VietQR Payment"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1.5 text-zinc-300 text-xs leading-relaxed text-left max-w-[280px] mx-auto bg-black p-4 border border-white/10">
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Ngân hàng:</span> 
                    <strong className="text-white">MB Bank (Quân Đội)</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Số tài khoản:</span> 
                    <strong className="text-white font-mono text-sm font-bold">8888.6666.9999</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Chủ tài khoản:</span> 
                    <strong className="text-white text-right">CONG TY TNHH DAFIST COMBAT</strong>
                  </p>
                  <p className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-zinc-500">Nội dung:</span> 
                    <strong className="text-red-500 font-mono text-base font-black tracking-widest">{placedOrder.orderId}</strong>
                  </p>
                  <p className="flex justify-between items-center pt-2">
                    <span className="text-zinc-500">Số tiền:</span> 
                    <strong className="text-white font-mono text-sm font-bold">{formatVND(placedOrder.total)}</strong>
                  </p>
                </div>
                
                <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed max-w-sm mx-auto">
                  Quý khách vui lòng quét mã QR hoặc chuyển khoản chính xác nội dung <strong>{placedOrder.orderId}</strong>. DAFIST sẽ xác nhận đơn hàng ngay sau khi nhận được thanh toán.
                </p>
                
                <button
                  type="button"
                  onClick={() => showToast('Cảm ơn bạn! Đơn hàng sẽ được xử lý ngay khi nhân viên DAFIST xác nhận thanh toán.', 'success')}
                  className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest w-full sm:w-auto transition-colors"
                >
                  Tôi đã chuyển khoản
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline text-sm">
              <span className="font-black text-white uppercase tracking-widest">Tổng thanh toán:</span>
              <span className="font-display font-black text-2xl text-red-500">
                {formatVND(placedOrder.total)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center">
            {customer && (
              <button
                onClick={() => {
                  setPlacedOrder(null);
                  navigateTo('my-orders');
                }}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-lg transition-colors"
              >
                Xem Đơn Hàng Của Tôi
              </button>
            )}
            <button
              onClick={() => {
                setPlacedOrder(null);
                navigateTo('products');
              }}
              className="px-8 py-4 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-none border border-white/10 transition-colors"
            >
              Tiếp Tục Mua Sắm
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                navigateTo('home');
              }}
              className="px-8 py-4 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-none border border-white/10 transition-colors"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shippingFee = cartSubtotal === 0 ? 0 : calculateShippingFee(cartSubtotal, formData.shippingMethod);
  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // If cart is empty and no placed order
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 bg-black text-white font-sans">
        <h2 className="text-2xl font-display font-black uppercase text-white tracking-wide">
          Chưa có sản phẩm nào để thanh toán
        </h2>
        <button
          onClick={() => navigateTo('products')}
          className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-lg transition-colors"
        >
          Chọn sản phẩm ngay
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
    if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại.';
    else if (!/^[0-9]{9,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số).';
    }
    if (!formData.email.trim()) errors.email = 'Vui lòng nhập email để nhận hóa đơn.';
    if (!formData.province.trim()) errors.province = 'Vui lòng chọn tỉnh / thành phố.';
    if (!formData.district.trim()) errors.district = 'Vui lòng nhập quận / huyện.';
    if (!formData.ward.trim()) errors.ward = 'Vui lòng nhập phường / xã.';
    if (!formData.address.trim()) errors.address = 'Vui lòng nhập địa chỉ cụ thể (số nhà, đường).';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous guard against double-clicks and concurrent submissions
    if (isSubmittingRef.current) {
      return;
    }

    if (!validateForm()) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setCheckoutError(null);

    const itemsInput: CheckoutItemRequest[] = cart.map(item => ({
      productId: item.product.id,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      expectedPrice: item.product.price
    }));

    try {
      const attemptOrderId = idempotencyKeyRef.current;
      const result = await executeAtomicCheckout({
        items: itemsInput,
        shippingInfo: formData,
        appliedCoupon: activeCoupon,
        shippingMethod: formData.shippingMethod,
        orderId: attemptOrderId,
        idempotencyKey: attemptOrderId,
        notes: formData.notes,
        userId: customer?.uid,
        customerEmail: customer?.email || formData.email
      });

      setPlacedOrder(result.order);
      clearCart();
      // Prepare new unique idempotency key for any future orders
      idempotencyKeyRef.current = `DF-${Math.floor(100000 + Math.random() * 900000)}`;
      showToast('Đặt hàng thành công! Đơn hàng đã được lưu và trừ kho thành công.', 'success');
    } catch (err: any) {
      console.error('Failed to execute checkout:', err);
      const errorMessage = err instanceof CheckoutError
        ? err.message
        : (err?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng và thử lại.');
      setCheckoutError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-black text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              CHECKOUT DISPATCH
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-none">
            Thanh Toán Đơn Hàng
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Vui lòng điền thông tin người nhận và phương thức thanh toán thuận tiện nhất
          </p>
        </div>
        <button
          onClick={() => navigateTo('cart')}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white uppercase font-black tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại giỏ hàng
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Shipping & Payment Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Customer Authentication & Guest Checkout Indicator */}
          {customer ? (
            <div className="bg-[#080808] border border-emerald-500/30 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {customer.displayName ? customer.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Đang thanh toán:</span>
                    <span className="text-emerald-400">{customerProfile?.displayName || customer.displayName || customer.email}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Đơn hàng sẽ được tự động lưu vào Lịch sử đơn hàng của bạn.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('account')}
                className="text-[11px] text-zinc-400 hover:text-white uppercase font-bold tracking-wider underline shrink-0 cursor-pointer"
              >
                Hồ sơ
              </button>
            </div>
          ) : (
            <div className="bg-[#080808] border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-zinc-400">
                <span className="text-white font-bold">Thanh toán Khách vãng lai:</span> Bạn có thể đặt hàng ngay mà không cần tài khoản.
              </div>
              <button
                type="button"
                onClick={() => navigateTo('account')}
                className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Đăng nhập để lưu đơn</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Section 1: Customer & Shipping Address */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-none space-y-4">
            <h3 className="text-xs font-display font-black uppercase text-white tracking-widest border-b border-white/10 pb-4 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-none bg-red-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">1</span>
              Thông Tin Người Nhận Hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Họ và Tên *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                />
                {formErrors.fullName && <p className="text-[10px] text-red-500">{formErrors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Số Điện Thoại *</label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0988 123 456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600 font-mono"
                />
                {formErrors.phone && <p className="text-[10px] text-red-500">{formErrors.phone}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Địa Chỉ Email * (Nhận hóa đơn & mã vận đơn)</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
              />
              {formErrors.email && <p className="text-[10px] text-red-500">{formErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tỉnh / Thành Phố *</label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
                {formErrors.province && <p className="text-[10px] text-red-500">{formErrors.province}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quận / Huyện *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 10, Cầu Giấy..."
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                />
                {formErrors.district && <p className="text-[10px] text-red-500">{formErrors.district}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Phường / Xã *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phường 12, Dịch Vọng..."
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                />
                {formErrors.ward && <p className="text-[10px] text-red-500">{formErrors.ward}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Địa Chỉ Nhận Hàng Cụ Thể *</label>
              <input
                type="text"
                placeholder="Số nhà, tên đường, tên toà nhà..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
              />
              {formErrors.address && <p className="text-[10px] text-red-500">{formErrors.address}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ghi Chú Đơn Hàng (Tùy chọn)</label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao 15 phút..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-2.5 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Section 2: Shipping Methods */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-none space-y-4">
            <h3 className="text-xs font-display font-black uppercase text-white tracking-widest border-b border-white/10 pb-4 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-none bg-red-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">2</span>
              Phương Thức Giao Hàng
            </h3>

            <div className="space-y-3">
              {/* Standard Shipping */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-none border cursor-pointer transition-all ${
                  formData.shippingMethod === 'standard'
                    ? 'bg-black border-red-600'
                    : 'bg-black/50 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'standard'}
                  onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                  className="mt-1 text-red-600 focus:ring-red-600"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-white" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Tiêu chuẩn (2 - 4 ngày)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {cartSubtotal >= 1000000 ? 'Miễn phí giao hàng' : 'Đồng giá 35.000đ toàn quốc'}
                  </p>
                </div>
              </label>

              {/* Express Shipping */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-none border cursor-pointer transition-all ${
                  formData.shippingMethod === 'express'
                    ? 'bg-black border-red-600'
                    : 'bg-black/50 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={formData.shippingMethod === 'express'}
                  onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                  className="mt-1 text-red-600 focus:ring-red-600"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Hỏa tốc 24H (Nội thành / Máy bay)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Phụ phí +30.000đ (Tổng: {formatVND(cartSubtotal >= 1000000 ? 30000 : 65000)})
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Methods */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-none space-y-4">
            <h3 className="text-xs font-display font-black uppercase text-white tracking-widest border-b border-white/10 pb-4 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-none bg-red-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">3</span>
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              {/* COD */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-none border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'bg-black border-red-600'
                    : 'bg-black/50 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className="mt-1 text-red-600 focus:ring-red-600"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-white" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Thanh Toán Khi Nhận Hàng (COD)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Kiểm tra đúng mẫu găng tay và phụ kiện trước khi thanh toán tiền mặt cho shipper.
                  </p>
                </div>
              </label>

              {/* VietQR */}
              <label 
                className={`flex items-start gap-3.5 p-4 rounded-none border cursor-pointer transition-all ${
                  formData.paymentMethod === 'vietqr'
                    ? 'bg-black border-red-600'
                    : 'bg-black/50 border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'vietqr'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'vietqr' })}
                  className="mt-1 text-red-600 focus:ring-red-600"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Chuyển Khoản Ngân Hàng Qua Mã VietQR</span>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-none font-black uppercase tracking-widest">KHUYÊN DÙNG</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Mã QR tự động điền số tài khoản, số tiền và nội dung đơn hàng, xử lý tự động trong 30 giây.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080808] border border-white/10 p-6 rounded-none space-y-6 sticky top-24">
            <h3 className="text-xs font-display font-black uppercase text-white tracking-widest border-b border-white/10 pb-4">
              Chi Tiết Đơn Hàng ({cart.length} món)
            </h3>

            {/* Product list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-none bg-black border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate uppercase text-[11px] tracking-wide">{item.product.name}</p>
                    <p className="text-zinc-500 text-[10px] font-mono">Size: {item.selectedSize} × {item.quantity}</p>
                  </div>
                  <span className="font-bold text-white font-display">
                    {formatVND(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span className="uppercase tracking-wider text-zinc-400">Tạm tính:</span>
                <span className="font-bold text-white">{formatVND(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="uppercase tracking-wider text-zinc-400">Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? 'text-red-400 font-bold uppercase tracking-wider' : 'text-white font-bold'}>
                  {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span className="uppercase tracking-wider">Giảm giá coupon:</span>
                  <span className="font-bold">-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-xs font-black text-white uppercase tracking-widest">Tổng Thanh Toán:</span>
                <span className="text-2xl font-display font-black text-red-500">
                  {formatVND(cartTotal)}
                </span>
              </div>
            </div>

            {/* Error banner if checkout failed */}
            {checkoutError && (
              <div id="checkout-error-banner" className="p-4 bg-red-950/80 border border-red-600 text-red-200 text-xs flex items-start gap-3 rounded-none">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">Không thể hoàn tất đơn hàng</p>
                  <p className="leading-relaxed text-zinc-300">{checkoutError}</p>
                </div>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Xác Nhận Đặt Hàng ({formatVND(cartTotal)})</span>
                </>
              )}
            </button>

            <div className="text-[10px] text-zinc-500 text-center space-y-1 uppercase tracking-wider">
              <p>Bằng việc nhấn Đặt Hàng, bạn đồng ý với Điều khoản mua sắm và Chính sách bảo hành của DAFIST.</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
