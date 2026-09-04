import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCcw, 
  Truck, 
  Star, 
  Award, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Zap
} from 'lucide-react';
import { ProductCategory, CombatSport } from '../types';

export const HomePage: React.FC = () => {
  const { 
    products,
    navigateTo, 
    setCategoryFilter, 
    setSportFilter, 
    setLevelFilter,
    resetFilters,
    setSizeGuideOpen 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'boxing' | 'mma' | 'muaythai'>('all');

  const featuredProducts = products.filter((p) => {
    if (activeTab === 'all') return p.isFeatured || p.isBestSeller;
    return p.sport === activeTab;
  }).slice(0, 8);

  const categories = [
    {
      id: 'gloves' as ProductCategory,
      sport: 'boxing' as CombatSport,
      title: 'Găng Tay Boxing',
      subtitle: '8oz - 16oz | Foam 4 Lớp Chống Chấn',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
      tag: 'Bán chạy nhất'
    },
    {
      id: 'mma-gloves' as ProductCategory,
      sport: 'mma' as CombatSport,
      title: 'Găng MMA 4oz',
      subtitle: 'Hở Ngón | Grappling & Striking',
      image: 'https://images.unsplash.com/photo-1615117972428-28bd748abf50?w=800&auto=format&fit=crop&q=80',
      tag: 'Chuẩn Thi Đấu'
    },
    {
      id: 'protection' as ProductCategory,
      sport: 'all' as CombatSport,
      title: 'Bảo Hộ & Băng Quấn',
      subtitle: 'Mũ Sparring, Giáp Chân, Bọc Răng',
      image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800&auto=format&fit=crop&q=80',
      tag: 'An Toàn Tuyệt Đối'
    },
    {
      id: 'training-gear' as ProductCategory,
      sport: 'all' as CombatSport,
      title: 'Bao Cát & Đích Đấm',
      subtitle: 'Đích Bàn Tay HLV, Bao Cát 1.2m',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80',
      tag: 'Chịu Lực Cực Đại'
    }
  ];

  const testimonials = [
    {
      name: 'Võ Minh Kha',
      role: 'HLV Boxing tại Saigon Sports Club',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      comment: 'Học viên của tôi từ người mới đến bán chuyên đều được tôi khuyên dùng DAFIST. Cổ tay găng đệm rất đầm, đấm bao cát cả tiếng đồng hồ vẫn không bị mỏi hay đau khớp ngón tay.',
      rating: 5,
      date: 'Võ sĩ ONE Warrior Series'
    },
    {
      name: 'Nguyễn Thảo Nguyên',
      role: 'Nhân viên văn phòng, tập Boxing 1.5 năm',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      comment: 'Là nữ tập boxing để giải tỏa áp lực và giữ dáng, mình từng mua găng rẻ trên mạng bị đau cổ tay. Chuyển sang dòng Vandal 10oz của DAFIST cảm giác khác biệt hoàn toàn: form rất ôm tay và tone đen viền đỏ nhìn cực sang!',
      rating: 5,
      date: 'Khách hàng xác thực'
    },
    {
      name: 'Bùi Thanh Tùng',
      role: 'Võ sĩ MMA nghiệp dư, 28 tuổi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      comment: 'Găng MMA Apex Combat 4oz có độ bám ngón lúc vật khóa cực kỳ linh hoạt. Đệm mu bàn tay đủ dày để đấm spar an toàn mà không làm rách da bạn tập.',
      rating: 5,
      date: 'Khách hàng xác thực'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 bg-black text-white font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-black overflow-hidden border-b border-white/10">
        {/* Background Image with Dark Editorial Tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517438476312-10d79c077509?w=1600&auto=format&fit=crop&q=85"
            alt="Boxing Gear Hero"
            className="w-full h-full object-cover object-center filter brightness-[0.28] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        </div>

        {/* Ambient Red Glow */}
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none select-none" />

        {/* Giant Watermark Chapter Marker */}
        <div className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 text-[140px] sm:text-[240px] font-black text-white/[0.04] select-none pointer-events-none font-display leading-none">
          01
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl space-y-8">
            
            {/* Editorial Rule & Tagline */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-0.5 bg-red-600" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-red-500 font-black">
                THE 2025 COMBAT COLLECTION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-black tracking-tighter text-white uppercase leading-[0.9]">
              VƯỢT QUA <br />
              <span className="text-zinc-400">GIỚI HẠN.</span> <br />
              CHINH PHỤC <span className="text-red-600">SÀN ĐẤU.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
              Trang thiết bị đối kháng chuyên nghiệp từ da Microfiber và da bò thật tuyển chọn. Thiết kế công thái học triệt tiêu xung chấn, gia cố cổ tay tối đa cho võ sĩ Boxing, MMA và Muay Thai.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={() => {
                  resetFilters();
                  navigateTo('products');
                }}
                className="px-8 sm:px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-black tracking-[0.2em] uppercase rounded-none transition-all flex items-center gap-3 group"
              >
                <span>Khám Phá Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                id="hero-size-guide-btn"
                onClick={() => setSizeGuideOpen(true)}
                className="px-8 sm:px-9 py-4 bg-transparent hover:bg-white hover:text-black text-white border border-white/20 font-sans text-xs font-black tracking-[0.2em] uppercase rounded-none transition-all flex items-center gap-2.5"
              >
                <HelpCircle className="w-4 h-4 text-red-500" />
                <span>Bảng Chọn Size Chuẩn</span>
              </button>
            </div>

            {/* Quick Badges Strip */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-zinc-400 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">100% Da Thật & Microfiber</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCcw className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Đổi Size 30 Ngày</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Hoả Tốc 2H Nội Thành</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Bảo Hành 1 Năm</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span>CATEGORY OVERVIEW</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              Trang Thiết Bị Chuyên Biệt
            </h2>
          </div>
          <button
            onClick={() => {
              resetFilters();
              navigateTo('products');
            }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                resetFilters();
                setCategoryFilter(cat.id);
                if (cat.sport !== 'all') setSportFilter(cat.sport);
                navigateTo('products');
              }}
              className="group relative h-88 rounded-none overflow-hidden bg-[#080808] border border-white/10 hover:border-white/40 cursor-pointer transition-all duration-300 shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.7] group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute top-3.5 left-3.5">
                <span className="bg-black/90 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-none">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 space-y-1.5">
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Khám phá ngay</span> &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span>SELECTED EDITIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              Top Trang Bị Bán Chạy
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-[#0a0a0a] p-1 rounded-none border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-colors ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nổi Bật
            </button>
            <button
              onClick={() => setActiveTab('boxing')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-colors ${
                activeTab === 'boxing'
                  ? 'bg-red-600 text-white font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Boxing
            </button>
            <button
              onClick={() => setActiveTab('mma')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-colors ${
                activeTab === 'mma'
                  ? 'bg-red-600 text-white font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MMA
            </button>
            <button
              onClick={() => setActiveTab('muaythai')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-colors ${
                activeTab === 'muaythai'
                  ? 'bg-red-600 text-white font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Muay Thai
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              resetFilters();
              navigateTo('products');
            }}
            className="px-10 py-4 bg-transparent hover:bg-white hover:text-black border border-white/20 text-white font-sans text-xs font-black tracking-[0.2em] uppercase rounded-none transition-all inline-flex items-center gap-3"
          >
            <span>Xem Toàn Bộ 12+ Sản Phẩm Trong Cửa Hàng</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </section>

      {/* 4. TARGET AUDIENCE GUIDANCE */}
      <section className="bg-[#050505] border-y border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
              DISCIPLINE & TARGET ROADMAP
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mt-2">
              Bạn Đang Tập Luyện Bộ Môn Nào?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
              Mỗi bộ môn võ thuật đòi hỏi cấu trúc găng và bảo hộ chuyên biệt để hạn chế chấn thương và bộc phát tối đa sức mạnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner */}
            <div className="bg-[#080808] border border-white/10 p-8 rounded-none flex flex-col justify-between hover:border-white/30 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-2xl font-black font-display text-red-500">01</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">FOUNDATION</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Người Mới Tập Boxing & Fitness
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cổ tay và khớp ngón tay chưa quen chịu phản lực từ bao cát. Cần găng 10oz - 12oz có đệm dày êm, ôm tay dễ nắm và bắt buộc phải có băng quấn tay co giãn 4.5m.
                </p>
                <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Găng DAFIST Vandal (Chống trẹo cổ tay)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Băng quấn tay Cotton Spandex 4.5m</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Dây nhảy tốc độ rèn luyện thể lực</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    resetFilters();
                    setLevelFilter('beginner');
                    navigateTo('products');
                  }}
                  className="w-full py-3 bg-[#0f0f0f] hover:bg-white hover:text-black border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-none transition-colors"
                >
                  Xem Combo Cho Người Mới
                </button>
              </div>
            </div>

            {/* MMA */}
            <div className="bg-[#080808] border border-white/10 p-8 rounded-none flex flex-col justify-between hover:border-white/30 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-2xl font-black font-display text-red-500">02</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">HYBRID COMBAT</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Võ Sĩ Võ Tổng Hợp (MMA)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Đòi hỏi sự linh hoạt tối đa để chuyển đổi giữa các cú đấm cận chiến và kỹ thuật bẻ khớp, siết cổ (Grappling/BJJ) trên sàn đấu.
                </p>
                <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Găng MMA hở ngón 4oz Apex Combat</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Bọc răng tự khuôn nhiệt Dual Guard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Bọc chân bảo vệ ống đồng siêu nhẹ</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    resetFilters();
                    setSportFilter('mma');
                    navigateTo('products');
                  }}
                  className="w-full py-3 bg-[#0f0f0f] hover:bg-white hover:text-black border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-none transition-colors"
                >
                  Xem Trang Bị MMA
                </button>
              </div>
            </div>

            {/* Muay Thai */}
            <div className="bg-[#080808] border border-white/10 p-8 rounded-none flex flex-col justify-between hover:border-white/30 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-2xl font-black font-display text-red-500">03</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">8-LIMB ART</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Muay Thai & Kickboxing
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bộ môn của 8 chi (đấm, đá, gối, chỏ). Cần găng có mu bàn tay bè để đỡ đòn đá và cổ găng linh hoạt cho tư thế Clinch ghì đối thủ.
                </p>
                <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Găng da bò thật phong cách Băng Cốc</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Giáp ống chân Titan Shield chống nứt xương</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Quần Satin xẻ hông biên độ đá tối đa</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    resetFilters();
                    setSportFilter('muaythai');
                    navigateTo('products');
                  }}
                  className="w-full py-3 bg-[#0f0f0f] hover:bg-white hover:text-black border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-none transition-colors"
                >
                  Xem Trang Bị Muay Thai
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
            FIGHTER TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mt-1.5">
            Tin Tưởng Bởi Hơn 50.000+ Võ Sĩ & HLV
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#080808] border border-white/10 p-8 rounded-none flex flex-col justify-between hover:border-white/30 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-red-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-red-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-white/10 mt-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-none object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">{t.name}</h4>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM BANNER PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-none overflow-hidden bg-[#070707] border border-white/10 p-10 sm:p-16 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center space-x-2 border border-red-600/40 bg-red-600/10 px-3 py-1">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                EXCLUSIVE OFFER
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              SẴN SÀNG LÊN SÀN ĐẤU?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
              Nhập mã <span className="text-red-500 font-mono font-black border border-white/20 px-2 py-0.5 bg-black">BOXING10</span> tại bước thanh toán để nhận ngay ưu đãi giảm 10% và miễn phí vận chuyển cho đơn hàng từ 1.000.000₫.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  resetFilters();
                  navigateTo('products');
                }}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-black tracking-[0.2em] uppercase rounded-none transition-all inline-flex items-center gap-2"
              >
                <span>Mua Ngay Hôm Nay</span>
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
