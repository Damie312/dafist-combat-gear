import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Flame, 
  PhoneCall, 
  ChevronRight,
  ShieldCheck,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { PageType } from '../types';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartCount, 
    searchTerm, 
    setSearchTerm,
    setCategoryFilter,
    setSportFilter,
    resetFilters
  } = useShop();

  const { customer } = useCustomerAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigateTo('products');
      setSearchOpen(false);
    }
  };

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Trang Chủ', page: 'home' },
    { label: 'Sản Phẩm', page: 'products' },
    { label: 'Về DAFIST', page: 'about' },
    { label: 'Liên Hệ & Showroom', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-white/10 transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-[#050505] border-b border-white/10 text-[11px] py-2 px-4 text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-red-500">
              EDITORIAL RELEASE
            </span>
            <span className="text-zinc-300">Miễn phí giao hàng toàn quốc cho đơn từ 1.000.000₫</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
            <span className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => navigateTo('contact')}>
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              Cam kết da & đệm chuẩn quốc tế
            </span>
            <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              Hotline: 0988.123.888
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => {
              resetFilters();
              navigateTo('home');
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-none border border-white group-hover:border-red-600 transition-colors">
              <span className="font-display text-xl tracking-tighter text-black group-hover:text-red-600 transition-colors">
                DF
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase group-hover:text-zinc-200 transition-colors">
                  DA<span className="text-red-600">FIST</span>
                </span>
                <div className="w-1 h-1 bg-red-600 rounded-full" />
              </div>
              <p className="text-[9px] tracking-[0.35em] text-zinc-400 uppercase font-bold -mt-0.5">
                COMBAT GEAR
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-bold uppercase tracking-widest">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => {
                    if (item.page === 'products') {
                      resetFilters();
                    }
                    navigateTo(item.page);
                  }}
                  className={`py-2 transition-colors relative tracking-widest ${
                    isActive 
                      ? 'text-white font-black' 
                      : 'text-zinc-400 hover:text-red-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Search & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Inline Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-52">
              <input
                id="header-search-input"
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 text-xs text-white placeholder-zinc-500 rounded-none px-3 py-2 pl-8 focus:outline-none focus:border-white transition-all font-sans"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2 text-zinc-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Mobile/Tablet Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => navigateTo('cart')}
              className="relative p-2.5 bg-[#0a0a0a] hover:bg-zinc-900 border border-white/10 rounded-none text-white transition-all group flex items-center gap-2"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-red-500 transition-colors" />
              <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest">
                Giỏ hàng
              </span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[9px] font-bold text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            <button
              id="header-account-button"
              onClick={() => navigateTo('account')}
              className={`p-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentPage === 'account' 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-300 hover:text-white border-white/10'
              }`}
              title={customer ? (customer.displayName || customer.email || 'Tài khoản') : 'Tài khoản khách hàng'}
            >
              {customer?.photoURL ? (
                <img 
                  src={customer.photoURL} 
                  alt="Avatar" 
                  className="w-4 h-4 rounded-full object-cover border border-white/20" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-zinc-300" />
              )}
              <span className="hidden sm:inline-block text-[11px]">
                {customer ? (customer.displayName?.split(' ').slice(-1)[0] || 'Tài khoản') : 'Tài khoản'}
              </span>
            </button>

            {/* Admin Console Link Button */}
            <button
              id="header-admin-button"
              onClick={() => navigateTo('admin')}
              className={`p-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 border ${
                currentPage === 'admin' 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-400 hover:text-white border-white/10'
              }`}
              title="Khu Vực Quản Trị Viên"
            >
              <Shield className="w-4 h-4 text-red-500" />
              <span className="hidden xl:inline-block text-[11px]">Quản Trị</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search for Mobile/Tablet */}
      {searchOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black p-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 text-xs text-white placeholder-zinc-500 rounded-none px-4 py-2.5 pl-10 focus:outline-none focus:border-red-600"
              autoFocus
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="ml-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors"
            >
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black px-4 pt-4 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  if (item.page === 'products') resetFilters();
                  navigateTo(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 text-left font-bold uppercase text-xs tracking-widest ${
                  currentPage === item.page
                    ? 'bg-[#0a0a0a] text-red-500 border-l-2 border-red-600'
                    : 'text-zinc-300 hover:bg-[#0a0a0a]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}

            {/* Mobile Customer Account Link */}
            <button
              id="mobile-account-link"
              onClick={() => {
                navigateTo('account');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-3 text-left font-bold uppercase text-xs tracking-widest border-t border-white/5 ${
                currentPage === 'account'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-200 hover:bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-red-500" />
                <span>{customer ? (customer.displayName || customer.email || 'Tài Khoản Khách Hàng') : 'Đăng Nhập / Tài Khoản'}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            {/* Mobile Admin Link */}
            <button
              id="mobile-admin-link"
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-3 text-left font-bold uppercase text-xs tracking-widest border-t border-white/5 ${
                currentPage === 'admin'
                  ? 'bg-red-600 text-white'
                  : 'text-red-500 hover:bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Khu Vực Quản Trị Viên (Admin)</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold px-3 mb-2">
              Bộ Môn Võ Thuật
            </p>
            <div className="grid grid-cols-3 gap-2 px-2">
              <button
                onClick={() => {
                  resetFilters();
                  setSportFilter('boxing');
                  navigateTo('products');
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-center bg-[#0a0a0a] hover:bg-zinc-900 text-[11px] font-bold uppercase tracking-wider text-white border border-white/10"
              >
                Boxing
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setSportFilter('mma');
                  navigateTo('products');
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-center bg-[#0a0a0a] hover:bg-zinc-900 text-[11px] font-bold uppercase tracking-wider text-white border border-white/10"
              >
                MMA
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setSportFilter('muaythai');
                  navigateTo('products');
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-center bg-[#0a0a0a] hover:bg-zinc-900 text-[11px] font-bold uppercase tracking-wider text-white border border-white/10"
              >
                Muay Thai
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
