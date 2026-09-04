import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award,
  Send,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setCategoryFilter, setSportFilter, resetFilters } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 text-zinc-400 mt-24 font-sans">
      {/* Editorial Ticker Strip */}
      <div className="border-b border-white/10 bg-[#050505] py-3 overflow-hidden">
        <div className="flex items-center justify-between space-x-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            <span className="text-zinc-300">ESTABLISHED 2021</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            <span className="text-zinc-300">GENUINE LEATHER & MICROFIBER</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            <span className="text-zinc-300">VIETNAM COMBAT LAB</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            <span className="text-red-500">STAND YOUR GROUND</span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Highlight */}
      <div className="border-b border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center shrink-0 text-red-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">Chính Hãng 100%</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Da Microfiber & da bò cao cấp, chuẩn kích thước và trọng lượng thi đấu quốc tế.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center shrink-0 text-red-500">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">Đổi Size 30 Ngày</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Chưa vừa tay hoặc đổi ý? Hỗ trợ đổi size tận nơi nhanh chóng, minh bạch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center shrink-0 text-red-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">Giao Hoả Tốc 2H</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Giao hoả tốc 2 giờ tại nội thành Hà Nội & TP.HCM kịp buổi tập cùng HLV.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center shrink-0 text-red-500">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">Bảo Hành 12 Tháng</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Bảo hành đường may, khóa dán dính và foam đệm. Đồng hành trên mọi sàn đấu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div 
              onClick={() => {
                resetFilters();
                navigateTo('home');
              }}
              className="flex items-center gap-3 cursor-pointer group inline-flex"
            >
              <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black rounded-none border border-white">
                <span className="font-display text-xl text-black">DF</span>
              </div>
              <span className="font-display text-2xl font-black tracking-tighter text-white uppercase">
                DA<span className="text-red-600">FIST</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Thương hiệu trang thiết bị võ thuật và đối kháng tiêu chuẩn cao cấp tại Việt Nam. Thiết kế cho võ sĩ Boxing, MMA, Muay Thai với tiêu chí tối giản, chuẩn mực và bền bỉ.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                Đăng Ký Nhận Voucher 10% Cho Đơn Đầu Tiên
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-[#0a150a] border border-emerald-800/60 p-3 rounded-none">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Cảm ơn bạn! Mã voucher <strong>BOXING10</strong> đã sẵn sàng áp dụng.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/10 text-xs text-white placeholder-zinc-500 rounded-none px-3.5 py-3 flex-1 focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Gửi</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-red-600 pl-2.5">
              Danh Mục Sản Phẩm
            </h5>
            <ul className="space-y-3 text-xs tracking-wide">
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setCategoryFilter('gloves');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Găng Tay Boxing Chuyên Nghiệp
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setCategoryFilter('mma-gloves');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Găng MMA Hở Ngón 4oz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setCategoryFilter('protection');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Băng Quấn Tay & Bọc Răng
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setCategoryFilter('protection');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Mũ Bảo Hộ & Bọc Ống Chân
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setCategoryFilter('training-gear');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Bao Cát & Đích Đấm Huấn Luyện
                </button>
              </li>
            </ul>
          </div>

          {/* Disciplines */}
          <div>
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-red-600 pl-2.5">
              Bộ Môn Võ Thuật
            </h5>
            <ul className="space-y-3 text-xs tracking-wide">
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setSportFilter('boxing');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Quyền Anh (Boxing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setSportFilter('mma');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Võ Tổng Hợp (MMA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    resetFilters();
                    setSportFilter('muaythai');
                    navigateTo('products');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Muay Thai & Kickboxing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('about');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Về DAFIST Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('contact');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Hệ Thống Showroom
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact Info */}
          <div>
            <h5 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-red-600 pl-2.5">
              Hệ Thống Cửa Hàng
            </h5>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-zinc-300">248 Lý Thường Kiệt, P.14, Quận 10, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-zinc-300">182 Tây Sơn, Trung Liệt, Đống Đa, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">0988.123.888 / 0909.555.666</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">support@dafistcombat.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">08:30 - 21:30 (Thứ 2 - Chủ Nhật)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment */}
      <div className="border-t border-white/10 bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="tracking-wide">© {new Date().getFullYear()} DAFIST Combat Gear. All rights reserved.</p>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-zinc-400 hover:text-red-500 font-bold uppercase tracking-wider text-[10px] transition-colors"
            >
              Khu Vực Quản Trị Viên (Admin)
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="bg-[#0a0a0a] px-2.5 py-1 rounded-none border border-white/10 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              VietQR
            </span>
            <span className="bg-[#0a0a0a] px-2.5 py-1 rounded-none border border-white/10 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              COD
            </span>
            <span className="bg-[#0a0a0a] px-2.5 py-1 rounded-none border border-white/10 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              VISA / MASTER
            </span>
            <span className="bg-[#0a0a0a] px-2.5 py-1 rounded-none border border-white/10 text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              MOMO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
