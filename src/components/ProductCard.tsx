import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatVND, calculateDiscount } from '../utils/formatters';
import { Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, showToast } = useShop();
  const discountPercent = calculateDiscount(product.price, product.originalPrice);
  const isOutOfStock = product.stock === 0;
  const isLowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast(`Sản phẩm "${product.name}" hiện đã hết hàng!`, 'error');
      return;
    }
    // Quick add default size (first available)
    const defaultSize = product.sizes[0] || 'Standard';
    addToCart(product, defaultSize, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => navigateTo('product-detail', product)}
      className={`group bg-[#080808] border rounded-none overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl cursor-pointer select-none ${
        isOutOfStock ? 'border-red-900/40 opacity-85' : 'border-white/10 hover:border-white/40'
      }`}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full bg-black overflow-hidden border-b border-white/10">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100 ${
            isOutOfStock ? 'grayscale-[50%]' : ''
          }`}
          loading="lazy"
        />

        {/* Overlay Dark Tint on Hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isOutOfStock && (
            <span className="bg-red-600 text-white border border-red-500/50 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none shadow-lg">
              Hết Hàng
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-amber-600 text-white border border-amber-500/50 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none shadow-lg">
              Còn {product.stock} chiếc
            </span>
          )}
          {product.isBestSeller && !isOutOfStock && (
            <span className="bg-black/90 text-white border border-white/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
              Bán Chạy
            </span>
          )}
          {product.isNew && !isOutOfStock && (
            <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
              Mới 2025
            </span>
          )}
          {discountPercent && !isOutOfStock && (
            <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Sport Indicator */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="bg-black/80 backdrop-blur-sm text-zinc-300 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none border border-white/10">
            {product.sport === 'boxing' ? 'Boxing' : product.sport === 'mma' ? 'MMA' : product.sport === 'muaythai' ? 'Muay Thai' : 'Combat'}
          </span>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            title={isOutOfStock ? "Sản phẩm đã hết hàng" : "Thêm nhanh vào giỏ"}
            className={`w-8 h-8 flex items-center justify-center rounded-none shadow-md transition-colors ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('product-detail', product);
            }}
            title="Xem chi tiết"
            className="w-8 h-8 bg-black hover:bg-white hover:text-black text-white border border-white/20 flex items-center justify-center rounded-none shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-[#080808]">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3 h-3 text-red-500 fill-red-500" />
              <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-500 transition-colors line-clamp-2 leading-snug font-sans uppercase tracking-tight">
            {product.name}
          </h3>

          {/* Available Sizes preview */}
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[9px] font-mono bg-black text-zinc-300 px-1.5 py-0.5 rounded-none border border-white/10"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] text-zinc-500 self-center font-mono">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <span className="text-[10px] font-bold tracking-widest uppercase text-red-500 group-hover:translate-x-0.5 transition-transform flex items-center">
            Chi tiết &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
