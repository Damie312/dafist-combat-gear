import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_LABELS, SPORT_LABELS, LEVEL_LABELS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ArrowUpDown,
  Filter,
  Check
} from 'lucide-react';
import { ProductCategory, CombatSport, ExperienceLevel } from '../types';

export const ProductsPage: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    sportFilter,
    setSportFilter,
    levelFilter,
    setLevelFilter,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Price presets
  const pricePresets: { label: string; range: [number, number] }[] = [
    { label: 'Tất cả mức giá', range: [0, 3500000] },
    { label: 'Dưới 500.000₫', range: [0, 500000] },
    { label: '500.000₫ - 1.500.000₫', range: [500000, 1500000] },
    { label: '1.500.000₫ - 2.500.000₫', range: [1500000, 2500000] },
    { label: 'Trên 2.500.000₫', range: [2500000, 5000000] },
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDesc.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }

      // Category
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Sport
      if (sportFilter !== 'all' && product.sport !== 'all' && product.sport !== sportFilter) {
        return false;
      }

      // Level
      if (levelFilter !== 'all' && product.targetLevel !== 'all' && product.targetLevel !== levelFilter) {
        return false;
      }

      // Price
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured / popularity
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [searchTerm, categoryFilter, sportFilter, levelFilter, priceRange, sortBy]);

  const activeFiltersCount = 
    (categoryFilter !== 'all' ? 1 : 0) +
    (sportFilter !== 'all' ? 1 : 0) +
    (levelFilter !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 3500000 ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const categories: ProductCategory[] = ['all', 'gloves', 'mma-gloves', 'protection', 'training-gear', 'apparel-acc'];
  const sports: CombatSport[] = ['all', 'boxing', 'mma', 'muaythai'];
  const levels: ExperienceLevel[] = ['all', 'beginner', 'intermediate', 'pro'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-black text-white font-sans">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2">
              <span>CATALOGUE</span>
              <span>/</span>
              <span className="text-zinc-400">{CATEGORY_LABELS[categoryFilter]}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              Trang Thiết Bị Võ Thuật
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-normal">
              Hiển thị <span className="text-white font-bold">{filteredProducts.length}</span> sản phẩm tiêu chuẩn thi đấu
            </p>
          </div>

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Mobile Filter Button */}
            <button
              id="mobile-filter-open-btn"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border border-white/10 text-white rounded-none text-xs font-bold uppercase tracking-widest"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-none bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-none px-3.5 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider hidden sm:inline">Sắp xếp:</span>
              <select
                id="products-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-bold uppercase tracking-wider text-xs"
              >
                <option value="featured" className="bg-black text-white">Nổi bật nhất</option>
                <option value="price-asc" className="bg-black text-white">Giá: Thấp đến Cao</option>
                <option value="price-desc" className="bg-black text-white">Giá: Cao đến Thấp</option>
                <option value="rating" className="bg-black text-white">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
              Đang lọc:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 bg-[#0f0f0f] border border-white/20 text-white px-3 py-1 rounded-none text-xs uppercase tracking-wider">
                Từ khóa: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-red-500 ml-1">✕</button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#0f0f0f] border border-white/20 text-white px-3 py-1 rounded-none text-xs uppercase tracking-wider">
                {CATEGORY_LABELS[categoryFilter]}
                <button onClick={() => setCategoryFilter('all')} className="hover:text-red-500 ml-1">✕</button>
              </span>
            )}
            {sportFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#0f0f0f] border border-white/20 text-white px-3 py-1 rounded-none text-xs uppercase tracking-wider">
                {SPORT_LABELS[sportFilter]}
                <button onClick={() => setSportFilter('all')} className="hover:text-red-500 ml-1">✕</button>
              </span>
            )}
            {levelFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#0f0f0f] border border-white/20 text-white px-3 py-1 rounded-none text-xs uppercase tracking-wider">
                {LEVEL_LABELS[levelFilter]}
                <button onClick={() => setLevelFilter('all')} className="hover:text-red-500 ml-1">✕</button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 3500000) && (
              <span className="inline-flex items-center gap-1.5 bg-[#0f0f0f] border border-white/20 text-white px-3 py-1 rounded-none text-xs uppercase tracking-wider">
                Khoảng giá
                <button onClick={() => setPriceRange([0, 3500000])} className="hover:text-red-500 ml-1">✕</button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-widest ml-3 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại tất cả</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          {/* Search Box */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-red-500" />
              Tìm Kiếm
            </h4>
            <div className="relative">
              <input
                id="sidebar-search-input"
                type="text"
                placeholder="Tên sản phẩm, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white/20 text-xs text-white placeholder-zinc-500 rounded-none px-3.5 py-2.5 focus:outline-none focus:border-red-600 font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-red-500" />
              Danh Mục Sản Phẩm
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-none transition-colors flex items-center justify-between uppercase tracking-wider ${
                    categoryFilter === cat
                      ? 'bg-red-600/15 text-white font-black border-l-2 border-red-600'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{CATEGORY_LABELS[cat]}</span>
                  {categoryFilter === cat && <Check className="w-3.5 h-3.5 text-red-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sport / Discipline */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
              Bộ Môn Võ Thuật
            </h4>
            <div className="space-y-1">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-none transition-colors flex items-center justify-between uppercase tracking-wider ${
                    sportFilter === sport
                      ? 'bg-red-600/15 text-white font-black border-l-2 border-red-600'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{SPORT_LABELS[sport]}</span>
                  {sportFilter === sport && <Check className="w-3.5 h-3.5 text-red-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
              Cấp Độ & Mục Đích
            </h4>
            <div className="space-y-1">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-none transition-colors flex items-center justify-between uppercase tracking-wider ${
                    levelFilter === lvl
                      ? 'bg-red-600/15 text-white font-black border-l-2 border-red-600'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{LEVEL_LABELS[lvl]}</span>
                  {levelFilter === lvl && <Check className="w-3.5 h-3.5 text-red-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Presets */}
          <div className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
              Khoảng Giá
            </h4>
            <div className="space-y-1">
              {pricePresets.map((preset, idx) => {
                const isSelected =
                  priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
                return (
                  <button
                    key={idx}
                    onClick={() => setPriceRange(preset.range)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-none transition-colors flex items-center justify-between uppercase tracking-wider ${
                      isSelected
                        ? 'bg-red-600/15 text-white font-black border-l-2 border-red-600'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full py-3 bg-transparent hover:bg-white hover:text-black border border-white/20 text-xs font-black uppercase tracking-widest text-white rounded-none transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
            <span>Xóa Tất Cả Bộ Lọc</span>
          </button>
        </aside>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#080808] border border-white/10 rounded-none p-16 text-center space-y-5">
              <div className="w-12 h-12 rounded-none bg-black border border-white/20 text-red-500 mx-auto flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Rất tiếc, không có sản phẩm nào thỏa mãn các tiêu chí lọc hiện tại. Hãy thử chọn khoảng giá khác hoặc xóa bộ lọc tìm kiếm.
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-none tracking-widest transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa Bộ Lọc Để Xem Tất Cả</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-black border-l border-white/20 h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-display font-black uppercase text-white tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-red-500" />
                Bộ Lọc Tìm Kiếm
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Danh Mục</h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`w-full text-left text-xs py-2.5 px-3 rounded-none uppercase tracking-wider ${
                      categoryFilter === cat
                        ? 'bg-red-600 text-white font-black'
                        : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sports */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bộ Môn</h4>
              <div className="space-y-1">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={`w-full text-left text-xs py-2.5 px-3 rounded-none uppercase tracking-wider ${
                      sportFilter === sport
                        ? 'bg-red-600 text-white font-black'
                        : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    {SPORT_LABELS[sport]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Levels */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Trình Độ</h4>
              <div className="space-y-1">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`w-full text-left text-xs py-2.5 px-3 rounded-none uppercase tracking-wider ${
                      levelFilter === lvl
                        ? 'bg-red-600 text-white font-black'
                        : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    {LEVEL_LABELS[lvl]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-red-600 text-white text-xs font-black uppercase rounded-none tracking-widest"
              >
                Áp Dụng ({filteredProducts.length} sản phẩm)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-3 bg-[#0a0a0a] text-zinc-400 text-xs font-bold uppercase rounded-none tracking-wider hover:text-white"
              >
                Đặt Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
