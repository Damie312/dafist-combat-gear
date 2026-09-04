import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, 
  Target, 
  Flame, 
  Award, 
  Users, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="space-y-16 sm:space-y-24 py-10 bg-black text-white font-sans">
      {/* 1. HERO ABOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-none overflow-hidden bg-[#080808] border border-white/10 p-8 sm:p-16">
          {/* Editorial Watermark */}
          <div className="absolute right-4 bottom-0 text-[12rem] font-display font-black text-white/[0.02] select-none pointer-events-none leading-none">
            01
          </div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                CÂU CHUYỆN THƯƠNG HIỆU
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
              SINH RA TỪ ĐAM MÊ VÕ THUẬT.
              <br />
              <span className="text-red-600">ĐỒNG HÀNH CÙNG MỌI VÕ SĨ.</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              DAFIST COMBAT GEAR được thành lập bởi nhóm võ sĩ quyền Anh và huấn luyện viên võ thuật với một khát vọng duy nhất: mang lại những chiếc găng tay boxing, giáp bảo hộ MMA và Muay Thai đạt chuẩn thi đấu thế giới đến với cộng đồng võ sinh tại Việt Nam với mức giá hợp lý và chất lượng không khoan nhượng.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-[#080808] border border-white/10 p-6 sm:p-8 rounded-none space-y-2">
            <span className="font-display text-3xl sm:text-5xl font-black text-white">50.000+</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">Võ Sinh Đã Tin Dùng</p>
          </div>
          <div className="bg-[#080808] border border-white/10 p-6 sm:p-8 rounded-none space-y-2">
            <span className="font-display text-3xl sm:text-5xl font-black text-red-500">120+</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">Câu Lạc Bộ & Gym Đối Tác</p>
          </div>
          <div className="bg-[#080808] border border-white/10 p-6 sm:p-8 rounded-none space-y-2">
            <span className="font-display text-3xl sm:text-5xl font-black text-white">100%</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">Kiểm Định Lực Ép Đệm</p>
          </div>
          <div className="bg-[#080808] border border-white/10 p-6 sm:p-8 rounded-none space-y-2">
            <span className="font-display text-3xl sm:text-5xl font-black text-red-500">30 Ngày</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">Chính Sách Đổi Size Tận Nơi</p>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-2 border-b border-white/10 pb-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              TRIẾT LÝ PHÁT TRIỂN
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            4 Tiêu Chuẩn Vàng Của DAFIST
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#080808] border border-white/10 p-8 rounded-none space-y-4">
            <div className="w-12 h-12 rounded-none bg-black border border-white/15 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-black uppercase text-white tracking-wider">
              1. An Toàn Là Tiên Quyết
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mỗi cú đấm khi tác động vào bao cát hay bạn tập đều tạo phản lực cực lớn lên các đốt xương bàn tay và cổ tay. Đệm găng DAFIST được thử nghiệm nén 10.000 chu kỳ để đảm bảo hấp thụ ít nhất 85% xung chấn, giữ khớp tay an toàn qua năm tháng.
            </p>
          </div>

          <div className="bg-[#080808] border border-white/10 p-8 rounded-none space-y-4">
            <div className="w-12 h-12 rounded-none bg-black border border-white/15 flex items-center justify-center text-red-500">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-black uppercase text-white tracking-wider">
              2. Chất Liệu Đạt Chuẩn Quốc Tế
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Chúng tôi chỉ sử dụng da Microfiber chịu mòn thế hệ mới hoặc 100% da bò thuộc tự nhiên. Nói KHÔNG với da PU mỏng tái chế dễ nổ da, bong tróc sau vài tháng sử dụng trong điều kiện khí hậu nóng ẩm tại Việt Nam.
            </p>
          </div>

          <div className="bg-[#080808] border border-white/10 p-8 rounded-none space-y-4">
            <div className="w-12 h-12 rounded-none bg-black border border-white/15 flex items-center justify-center text-red-500">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-black uppercase text-white tracking-wider">
              3. Phong Cách Thể Thao Tối Giản (Monochrome & Red)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Lấy cảm hứng từ tinh thần kỷ luật và uy lực của các môn võ đối kháng, thiết kế của DAFIST tập trung vào sắc đen và trắng mạnh mẽ, điểm xuyết sắc đỏ nhiệt huyết. Tối giản, hiện đại và trường tồn cùng thời gian.
            </p>
          </div>

          <div className="bg-[#080808] border border-white/10 p-8 rounded-none space-y-4">
            <div className="w-12 h-12 rounded-none bg-black border border-white/15 flex items-center justify-center text-red-500">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-black uppercase text-white tracking-wider">
              4. Đồng Hành Cùng Người Mới Tập
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dù bạn 18 tuổi hay 35 tuổi, nam hay nữ, tập boxing vì sức khỏe hay khao khát thượng đài, đội ngũ tư vấn viên am hiểu kỹ thuật võ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn chọn đúng size găng và cách quấn băng bảo vệ chuẩn xác.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SHOWROOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#080808] border border-white/10 p-8 sm:p-14 rounded-none flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-6 h-0.5 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                SHOWROOM DIRECT
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight">
              Trải Nghiệm Thử Găng Trực Tiếp Tại Showroom
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Ghé thăm 3 showroom của DAFIST tại Hà Nội, TP.HCM và Đà Nẵng để xỏ thử găng, kiểm tra form tay và đấm thử bao cát trước khi mua hàng.
            </p>
          </div>
          <button
            onClick={() => navigateTo('contact')}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-none transition-colors shrink-0 flex items-center gap-2.5 shadow-xl"
          >
            <span>Xem Địa Chỉ Showroom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
