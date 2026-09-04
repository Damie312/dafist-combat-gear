import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_LABELS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { formatVND, calculateDiscount } from '../utils/formatters';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  HelpCircle, 
  ChevronRight,
  Zap,
  ArrowLeft,
  Share2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    products,
    selectedProduct, 
    navigateTo, 
    addToCart, 
    setSizeGuideOpen, 
    showToast,
    resetFilters,
    setCategoryFilter
  } = useShop();

  // Always resolve live product from products array to ensure realtime stock updates from Firestore are reflected
  const liveProduct = products.find(
    (p) => selectedProduct && (p.id === selectedProduct.id || p.slug === selectedProduct.slug)
  );
  const product = liveProduct || selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product ? (product.sizes[0] || 'Standard') : 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  const isOutOfStock = product ? product.stock === 0 : false;
  const isLowStock = product ? typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5 : false;

  const discountPercent = product ? calculateDiscount(product.price, product.originalPrice) : null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
      navigateTo('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết sản phẩm vào clipboard!', 'info');
    }
  };

  // Related products (same sport or category, excluding current)
  const relatedProducts = products.filter(
    (p) => product && p.id !== product.id && (p.category === product.category || p.sport === product.sport)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-black text-white font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 border-b border-white/10 pb-4 uppercase tracking-wider text-[11px]">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
          Trang Chủ
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <button 
          onClick={() => {
            resetFilters();
            navigateTo('products');
          }} 
          className="hover:text-white transition-colors"
        >
          Sản Phẩm
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <button 
          onClick={() => {
            resetFilters();
            setCategoryFilter(product.category);
            navigateTo('products');
          }} 
          className="hover:text-white transition-colors"
        >
          {CATEGORY_LABELS[product.category]}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-200 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-square w-full bg-[#080808] border border-white/10 rounded-none overflow-hidden">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-none shadow-lg">
                Giảm {discountPercent}%
              </div>
            )}
            <button
              onClick={handleShare}
              title="Chia sẻ sản phẩm"
              className="absolute top-4 right-4 p-2.5 bg-black/80 hover:bg-white hover:text-black text-white rounded-none border border-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-none overflow-hidden border shrink-0 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-red-600 opacity-100 scale-95' 
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0.5 bg-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  {product.brand} DIVISION
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <div className="flex text-red-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-red-500' : 'text-zinc-700'}`} 
                    />
                  ))}
                </div>
                <span className="font-black text-white ml-1">{product.rating.toFixed(1)}</span>
                <span className="text-zinc-500">({product.reviewCount} đánh giá)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest">
              Mã sản phẩm: <span className="font-mono text-zinc-300 font-bold">{product.id.toUpperCase()}</span>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none flex items-baseline gap-4">
            <span className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-zinc-500 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
            {discountPercent && (
              <span className="bg-red-600/15 border border-red-600/40 text-red-500 text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-none">
                Tiết kiệm {formatVND(product.originalPrice! - product.price)}
              </span>
            )}
          </div>

          {/* Short Desc */}
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Size Selector with Guide Button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <span>Chọn Kích Cỡ / Trọng Lượng:</span>
                <span className="text-red-500 font-mono">({selectedSize})</span>
              </label>

              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bảng chọn size</span>
              </button>
            </div>

            {/* Size Buttons Grid */}
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-none transition-all border ${
                    selectedSize === sz
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-[#080808] text-zinc-300 border-white/10 hover:border-white hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-black uppercase tracking-widest text-white">
              Số Lượng:
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-white/20 bg-[#080808] rounded-none">
                <button
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-black text-white font-mono">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  disabled={isOutOfStock || (typeof product.stock === 'number' && quantity >= product.stock)}
                  onClick={() => {
                    const maxStock = typeof product.stock === 'number' ? product.stock : 99;
                    setQuantity(Math.min(maxStock, quantity + 1));
                  }}
                  className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Dynamic stock indicator reflecting live Firestore stock */}
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/60 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Hết Hàng Tạm Thời
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-600/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Chỉ Còn {product.stock} Sản Phẩm Trong Kho (Sắp Hết)
                </span>
              ) : (
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                  (Còn {typeof product.stock === 'number' ? product.stock : 25} sản phẩm trong kho)
                </span>
              )}
            </div>
          </div>

          {/* Actions: Add to cart & Buy now */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-4 border-t border-white/10">
            <button
              id="product-add-to-cart-btn"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-4 font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-2.5 ${
                isOutOfStock
                  ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed opacity-60'
                  : 'bg-transparent hover:bg-white hover:text-black text-white border border-white/20 cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-red-500" />
              <span>{isOutOfStock ? 'Sản Phẩm Tạm Hết Hàng' : 'Thêm Vào Giỏ Hàng'}</span>
            </button>

            <button
              id="product-buy-now-btn"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`flex-1 py-4 font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none shadow-lg transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed opacity-40'
                  : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isOutOfStock ? 'Hết Hàng' : 'Mua Ngay'}</span>
            </button>
          </div>

          {/* Reassurance Features */}
          <div className="bg-[#050505] border border-white/10 p-5 rounded-none space-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Cam kết chính hãng DAFIST, đền 200% nếu phát hiện hàng giả</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-red-500 shrink-0" />
              <span>Đổi size miễn phí trong 30 ngày nếu đeo không vừa vặn</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1.000.000₫</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="border-t border-white/10 pt-10">
        <div className="flex border-b border-white/10 gap-8">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
              activeTab === 'desc' ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Mô Tả Chi Tiết
            {activeTab === 'desc' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
              activeTab === 'specs' ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Thông Số Kỹ Thuật
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
              activeTab === 'reviews' ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Đánh Giá ({product.reviews?.length || 0})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
        </div>

        <div className="py-8 text-sm text-zinc-300 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-6 max-w-4xl">
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{product.fullDesc}</p>
              
              <div className="space-y-3 pt-2">
                <h4 className="text-white font-black uppercase tracking-widest text-xs">
                  Điểm Nổi Bật Vượt Trội:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-[#080808] border border-white/10 p-4 rounded-none text-xs">
                      <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#080808] border border-white/10 p-5 rounded-none text-xs space-y-2">
                <h5 className="font-black text-white uppercase tracking-widest">
                  Hướng Dẫn Bảo Quản Để Găng Bền Hơn 3 Năm:
                </h5>
                <p className="text-zinc-400 leading-relaxed">
                  Sau khi tập luyện, hãy dùng khăn ẩm lau sạch mồ hôi bên ngoài găng. Mở rộng cổ găng và đặt túi hút ẩm hoặc phơi trước quạt gió tại nơi thoáng mát. Tuyệt đối không phơi trực tiếp dưới ánh nắng gay gắt hoặc sấy nhiệt độ cao.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl border border-white/10 rounded-none overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-white/10">
                  <tr className="bg-[#080808]">
                    <td className="py-3.5 px-5 font-bold uppercase tracking-wider text-zinc-400 w-1/3">Chất Liệu Bề Mặt</td>
                    <td className="py-3.5 px-5 text-white font-medium">{product.specs.material}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold uppercase tracking-wider text-zinc-400">Lớp Đệm Giảm Chấn</td>
                    <td className="py-3.5 px-5 text-white font-medium">{product.specs.padding}</td>
                  </tr>
                  <tr className="bg-[#080808]">
                    <td className="py-3.5 px-5 font-bold uppercase tracking-wider text-zinc-400">Khóa Cổ Tay</td>
                    <td className="py-3.5 px-5 text-white font-medium">{product.specs.closure}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold uppercase tracking-wider text-zinc-400">Xuất Xứ & Thương Hiệu</td>
                    <td className="py-3.5 px-5 text-white font-medium">{product.specs.origin}</td>
                  </tr>
                  <tr className="bg-[#080808]">
                    <td className="py-3.5 px-5 font-bold uppercase tracking-wider text-zinc-400">Mục Đích Khuyên Dùng</td>
                    <td className="py-3.5 px-5 text-white font-medium">{product.specs.suitability}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-white uppercase tracking-wider">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-red-950/40 text-red-400 text-[10px] px-2 py-0.5 border border-red-800/60 flex items-center gap-1 uppercase tracking-wider font-bold">
                            <Check className="w-2.5 h-2.5" /> Đã mua hàng
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-500 text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex text-red-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-red-500" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận của bạn!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 pt-12 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Sản Phẩm Thường Được Mua Kèm
            </h3>
            <button
              onClick={() => {
                resetFilters();
                navigateTo('products');
              }}
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
            >
              Xem tất cả &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
