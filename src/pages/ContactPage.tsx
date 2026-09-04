import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    sport: 'boxing',
    weight: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      showToast('Vui lòng điền họ tên và số điện thoại để chúng tôi liên hệ!', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Gửi yêu cầu tư vấn thành công! Chuyên viên sẽ gọi cho bạn trong 15 phút.', 'success');
  };

  const showrooms = [
    {
      city: 'TP. Hồ Chí Minh (Showroom Chính)',
      address: '248 Lý Thường Kiệt, Phường 14, Quận 10',
      hotline: '0988.123.888',
      hours: '08:30 - 21:30 (Mở cửa tất cả các ngày trong tuần)',
      note: 'Có khu vực bao cát thử găng và đo kích thước bàn tay bằng máy laser'
    },
    {
      city: 'Hà Nội',
      address: '182 Tây Sơn, Phường Trung Liệt, Quận Đống Đa',
      hotline: '0988.666.999',
      hours: '09:00 - 21:00 (Thứ 2 - Chủ Nhật)',
      note: 'Gần Đại học Thủy Lợi, có chỗ đỗ ô tô và xe máy rộng rãi'
    },
    {
      city: 'Đà Nẵng',
      address: '79 Nguyễn Văn Linh, Quận Hải Châu',
      hotline: '0909.555.666',
      hours: '08:30 - 21:00 (Thứ 2 - Chủ Nhật)',
      note: 'Tuyến đường trung tâm, đầy đủ các mẫu găng boxing và MMA'
    }
  ];

  const faqs = [
    {
      q: 'Người mới tập Boxing nên chọn găng bao nhiêu Oz?',
      a: 'Nếu bạn nặng dưới 55kg, hãy chọn găng 10oz. Nếu bạn nặng từ 55kg - 72kg, găng 12oz là kích cỡ chuẩn nhất vừa tập bao cát vừa tập kỹ thuật. Nếu bạn trên 75kg hoặc có kế hoạch đấu tập (sparring) có va chạm, hãy cân nhắc găng 14oz hoặc 16oz để bảo vệ xương khớp bạn tập an toàn.'
    },
    {
      q: 'Tại sao bắt buộc phải dùng băng quấn tay (Hand Wraps) khi đeo găng?',
      a: 'Bàn tay con người gồm 27 chiếc xương nhỏ rất mỏng manh. Băng quấn tay đóng vai trò như bộ khung cố định các khớp xương ngón và khóa chặt cổ tay, ngăn chặn hiện tượng gãy xương hoặc trật khớp khi ra đòn lệch góc. Ngoài ra, băng quấn còn thấm mồ hôi giúp găng không bị ẩm mốc.'
    },
    {
      q: 'Găng Boxing và Găng Muay Thai khác nhau như thế nào?',
      a: 'Găng Boxing truyền thống có form dài và hẹp, ngón cái ôm sát để tối ưu đòn đấm thẳng. Trong khi đó, găng Muay Thai có mu bàn tay bè rộng hơn để đỡ đòn đá quét, cổ găng ngắn và mềm hơn giúp võ sĩ linh hoạt ghì cổ (clinch) đối thủ.'
    },
    {
      q: 'Chính sách đổi size nếu mua online về đeo không vừa?',
      a: 'DAFIST hỗ trợ đổi size miễn phí trong 30 ngày kể từ ngày nhận hàng. Shipper sẽ mang đôi găng mới đến tận nhà đổi cho bạn, bạn chỉ cần giữ sản phẩm còn nguyên tem mác và chưa mang ra tập luyện thực tế.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-black text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-0.5 bg-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            KẾT NỐI VỚI DAFIST
          </span>
          <div className="w-6 h-0.5 bg-red-600" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-none">
          Liên Hệ & Hệ Thống Showroom
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Cần tư vấn chọn size găng? Đặt lịch thử trang bị hoặc hợp tác đại lý? Đội ngũ chuyên môn của chúng tôi luôn sẵn sàng hỗ trợ.
        </p>
      </div>

      {/* Grid: Form & Showrooms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact / Consultation Form (6 cols) */}
        <div className="lg:col-span-6 bg-[#080808] border border-white/10 p-6 sm:p-8 rounded-none space-y-6">
          <div className="space-y-1 border-b border-white/10 pb-4">
            <h3 className="text-xs font-display font-black uppercase text-white tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              Đăng Ký Tư Vấn Chọn Size & Đặt Lịch Thử Găng
            </h3>
            <p className="text-[11px] text-zinc-400">
              Nhập cân nặng và môn võ đang tập, chúng tôi sẽ gọi lại ngay để tư vấn mẫu găng phù hợp nhất.
            </p>
          </div>

          {submitted ? (
            <div className="bg-black border border-white/10 p-8 rounded-none text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
              <h4 className="font-display font-black text-white uppercase text-lg tracking-wide">
                Yêu Cầu Đã Được Tiếp Nhận
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cảm ơn bạn <strong className="text-white">{formData.fullName}</strong>. Chuyên viên kỹ thuật sẽ gọi lại theo số <strong className="text-white font-mono">{formData.phone}</strong> trong ít phút tới.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', phone: '', email: '', sport: 'boxing', weight: '', message: '' });
                }}
                className="mt-2 text-xs text-red-500 hover:text-white uppercase font-black tracking-widest transition-colors"
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-zinc-400 text-[11px]">Họ và Tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-zinc-400 text-[11px]">Số Điện Thoại (Zalo) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0988 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-zinc-400 text-[11px]">Bộ Môn Bạn Đang Tập</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                  >
                    <option value="boxing">Quyền Anh (Boxing)</option>
                    <option value="mma">Võ Tổng Hợp (MMA)</option>
                    <option value="muaythai">Muay Thai / Kickboxing</option>
                    <option value="fitness">Fitness Boxing Giảm Cân</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-zinc-400 text-[11px]">Cân Nặng Của Bạn (kg)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 65 kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-3 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-zinc-400 text-[11px]">Nội Dung Hoặc Câu Hỏi Khác</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Mình là người mới chưa từng tập, muốn tư vấn mua găng và băng quấn..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-white/20 text-xs text-white rounded-none px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-black uppercase tracking-[0.2em] rounded-none transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Showrooms (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-display font-black uppercase text-white tracking-widest flex items-center gap-2 pb-2">
            <MapPin className="w-4 h-4 text-red-500" />
            Hệ Thống Showroom Trải Nghiệm
          </h3>

          <div className="space-y-4">
            {showrooms.map((sr, idx) => (
              <div key={idx} className="bg-[#080808] border border-white/10 p-5 rounded-none space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-white text-sm uppercase tracking-wide">{sr.city}</h4>
                  <span className="text-[9px] bg-red-600 text-white font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                    Mở Cửa
                  </span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{sr.address}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-mono text-white font-bold">{sr.hotline}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{sr.hours}</span>
                </div>
                <p className="text-[11px] text-zinc-400 pt-2 border-t border-white/10">
                  <strong className="text-red-500 uppercase font-black text-[10px] tracking-wider mr-1.5">Lưu ý:</strong>
                  {sr.note}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="border-t border-white/10 pt-16 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-0.5 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              CÂU HỎI THƯỜNG GẶP
            </span>
            <div className="w-6 h-0.5 bg-red-600" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Giải Đáp Thắc Mắc Về Trang Thiết Bị Võ Thuật
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#080808] border border-white/10 rounded-none overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-red-500 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-red-500' : 'text-zinc-500'
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
