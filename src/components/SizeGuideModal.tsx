import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, HelpCircle, Shield, Scale, Target } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { sizeGuideOpen, setSizeGuideOpen } = useShop();

  if (!sizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-display text-lg tracking-wider text-white uppercase font-bold">
              Bảng Hướng Dẫn Chọn Size Găng Boxing & Đồ Bảo Hộ
            </h3>
          </div>
          <button
            onClick={() => setSizeGuideOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Summary Advice */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded text-xs space-y-2">
            <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-sm">
              <Target className="w-4 h-4 text-red-500" />
              Khái niệm & Quy ước "OZ" (Ounce) Trong Boxing:
            </p>
            <p className="text-neutral-400 leading-relaxed">
              "Oz" không phải là kích cỡ chiều dài của bàn tay, mà là <span className="text-white font-semibold">trọng lượng lớp đệm mút bên trong găng</span>. Số Oz càng lớn thì lớp đệm mút càng dày, hấp thụ lực đấm càng êm và bảo vệ khớp tay cũng như bạn tập an toàn hơn.
            </p>
          </div>

          {/* Table: Boxing Gloves Size Chart */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-500" />
              1. Bảng Chọn Size Găng Boxing & Muay Thai Theo Cân Nặng:
            </h4>
            <div className="overflow-x-auto border border-neutral-800 rounded">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[11px] font-bold border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Size Găng (Oz)</th>
                    <th className="py-2.5 px-3">Cân Nặng Phù Hợp</th>
                    <th className="py-2.5 px-3">Mục Đích Sử Dụng Chính</th>
                    <th className="py-2.5 px-3">Đối Tượng Phổ Biến</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr className="hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">8 oz - 10 oz</td>
                    <td className="py-2.5 px-3">Dưới 55 kg</td>
                    <td className="py-2.5 px-3">Đấm bao cát, tập tốc độ, pad work</td>
                    <td className="py-2.5 px-3 text-neutral-400">Nữ giới, thanh thiếu niên, người mới tập</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                    <td className="py-2.5 px-3 font-bold text-red-400">12 oz</td>
                    <td className="py-2.5 px-3">55 kg - 70 kg</td>
                    <td className="py-2.5 px-3">Toàn diện (Bao cát, đích đấm, kỹ thuật)</td>
                    <td className="py-2.5 px-3 text-white font-semibold">Size phổ biến nhất cho người mới bắt đầu!</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-bold text-red-400">14 oz</td>
                    <td className="py-2.5 px-3">68 kg - 82 kg</td>
                    <td className="py-2.5 px-3">Đấm bao + Đấu tập đối kháng nhẹ (Light Sparring)</td>
                    <td className="py-2.5 px-3 text-neutral-400">Nam giới trưởng thành, tập luyện đều đặn</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                    <td className="py-2.5 px-3 font-bold text-white">16 oz</td>
                    <td className="py-2.5 px-3">Trên 80 kg</td>
                    <td className="py-2.5 px-3">Bắt buộc cho Sparring đối kháng mạnh phòng tránh knock-out</td>
                    <td className="py-2.5 px-3 text-neutral-400">Võ sĩ hạng nặng, đấu tập an toàn tuyệt đối</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: MMA Gloves & Shin Guards */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              2. Bảng Size Găng MMA & Giáp Ống Chân (S / M / L / XL):
            </h4>
            <div className="overflow-x-auto border border-neutral-800 rounded">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[11px] font-bold border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chu vi lòng bàn tay</th>
                    <th className="py-2.5 px-3">Chiều cao người dùng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr className="hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">Size S</td>
                    <td className="py-2.5 px-3">16 - 18 cm</td>
                    <td className="py-2.5 px-3">Dưới 1m62 (45 - 55kg)</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                    <td className="py-2.5 px-3 font-bold text-white">Size M</td>
                    <td className="py-2.5 px-3">18 - 20 cm</td>
                    <td className="py-2.5 px-3">1m63 - 1m73 (56 - 70kg)</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">Size L</td>
                    <td className="py-2.5 px-3">20 - 22 cm</td>
                    <td className="py-2.5 px-3">1m74 - 1m82 (71 - 85kg)</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                    <td className="py-2.5 px-3 font-bold text-white">Size XL</td>
                    <td className="py-2.5 px-3">Trên 22 cm</td>
                    <td className="py-2.5 px-3">Trên 1m83 (&gt; 85kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-red-950/30 border border-red-900/50 rounded text-xs text-neutral-300">
            <span className="text-red-400 font-bold">💡 Lưu ý quan trọng:</span> Hãy luôn dùng <span className="text-white font-semibold">băng quấn tay 4.5m</span> bên trong găng. Băng quấn sẽ chiếm thêm khoảng 10-15% không gian trong lòng găng, giúp găng ôm sát và bảo vệ khớp ngón tay chắc chắn nhất.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={() => setSizeGuideOpen(false)}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded transition-colors"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
