import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/formatters';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Truck, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEMO_COUPONS } from '../data/products';
import { SHIPPING_CONFIG } from '../types';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    shippingFee, 
    discountAmount, 
    cartTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 bg-black text-white font-sans">
        <div className="w-20 h-20 rounded-none bg-[#080808] border border-white/10 text-zinc-500 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-0.5 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              TRỐNG
            </span>
            <div className="w-6 h-0.5 bg-red-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight">
            Giỏ Hàng Của Bạn Đang Trống
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Hãy khám phá các mẫu găng tay boxing, găng MMA hoặc bộ bảo hộ mới nhất của DAFIST để trang bị cho buổi tập tiếp theo.
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none transition-all inline-flex items-center gap-2.5 shadow-lg"
        >
          <span>Khám Phá Cửa Hàng Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-black text-white font-sans">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              BAG OVERVIEW
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-none">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Đang có <span className="text-white font-bold">{cart.length}</span> loại sản phẩm
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 hover:text-white uppercase font-black tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp tục mua sắm
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2.5 text-zinc-300 font-medium">
            <Truck className="w-4 h-4 text-red-500 shrink-0" />
            {remainingForFreeShipping > 0 ? (
              <span className="text-xs">
                Mua thêm <strong className="text-white font-bold">{formatVND(remainingForFreeShipping)}</strong> để được <strong className="text-red-500 uppercase">Miễn Phí Vận Chuyển</strong> toàn quốc!
              </span>
            ) : (
              <span className="text-red-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                Chúc mừng! Đơn hàng của bạn đã đủ điều kiện Miễn Phí Vận Chuyển.
              </span>
            )}
          </span>
          <span className="font-mono text-zinc-400 font-bold text-xs">{progressPercent}%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Main Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#080808] border border-white/10 rounded-none divide-y divide-white/10">
            {cart.map((item) => (
              <div 
                key={`${item.product.id}-${item.selectedSize}`} 
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors"
              >
                {/* Thumbnail & Name */}
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => navigateTo('product-detail', item.product)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-none bg-black border border-white/10 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                      {item.product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 uppercase tracking-wide">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-zinc-400">
                      Size: <span className="text-white font-mono bg-black px-2 py-0.5 border border-white/10 text-[11px] font-bold">{item.selectedSize}</span>
                    </div>
                    <div className="text-sm font-black text-white font-display">
                      {formatVND(item.product.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/20 bg-black rounded-none">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-white font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-base font-black text-white font-display min-w-[100px] text-right">
                    {formatVND(item.product.price * item.quantity)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    title="Xóa khỏi giỏ"
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500 pt-3 border-t border-white/10">
            <button
              onClick={() => navigateTo('products')}
              className="text-zinc-400 hover:text-white uppercase tracking-wider font-bold"
            >
              &larr; Tiếp tục chọn thêm sản phẩm khác
            </button>
            <button
              onClick={clearCart}
              className="text-zinc-500 hover:text-red-500 uppercase tracking-wider font-bold transition-colors"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#080808] border border-white/10 p-6 rounded-none space-y-6">
            <h3 className="text-base font-display font-black uppercase text-white tracking-widest border-b border-white/10 pb-4">
              Tóm Tắt Đơn Hàng
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span className="uppercase tracking-wider text-zinc-400">Tạm tính ({cart.length} món):</span>
                <span className="font-bold text-white">{formatVND(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span className="uppercase tracking-wider text-zinc-400">Phí vận chuyển:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-red-400 font-bold uppercase tracking-wider">Miễn phí</span>
                  ) : (
                    <span className="text-white font-bold">{formatVND(shippingFee)}</span>
                  )}
                </span>
              </div>

              {activeCoupon && (
                <div className="flex justify-between text-red-400 bg-red-950/20 p-2.5 rounded-none border border-red-800/40">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    <span>Mã {activeCoupon.code}:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">-{formatVND(discountAmount)}</span>
                    <button onClick={removeCoupon} className="text-zinc-400 hover:text-white text-xs">✕</button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-black text-white uppercase tracking-widest">
                  Tổng Tiền:
                </span>
                <span className="text-2xl sm:text-3xl font-display font-black text-red-500">
                  {formatVND(cartTotal)}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 text-right uppercase tracking-wider">
                (Đã bao gồm thuế GTGT & đóng gói tiêu chuẩn)
              </p>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-red-500" />
                Mã Giảm Giá (Coupon)
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="VÍ DỤ: BOXING10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-black border border-white/20 text-xs text-white uppercase placeholder-zinc-600 rounded-none px-3.5 py-2.5 flex-1 focus:outline-none focus:border-red-600 font-mono tracking-wider"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-widest rounded-none transition-colors"
                >
                  Áp dụng
                </button>
              </form>

              {couponError && (
                <div className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {couponError}
                </div>
              )}

              {/* Quick coupons pills */}
              <div className="pt-1">
                <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-widest">Mã gợi ý cho bạn:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => applyCoupon(c.code)}
                      className="text-[10px] bg-black hover:border-white text-zinc-300 hover:text-white px-2.5 py-1 rounded-none border border-white/15 font-mono uppercase tracking-wider"
                    >
                      {c.code} ({c.discountType === 'percentage' ? `-${c.value}%` : `-${formatVND(c.value)}`})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
