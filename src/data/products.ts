import { Product } from '../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'glove-dafist-pro-carbon',
    name: 'Găng Tay Boxing DAFIST Pro Stealth Carbon',
    slug: 'gang-tay-boxing-dafist-pro-stealth-carbon',
    brand: 'DAFIST',
    category: 'gloves',
    sport: 'boxing',
    targetLevel: 'intermediate',
    price: 1850000,
    originalPrice: 2200000,
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['10oz', '12oz', '14oz', '16oz'],
    shortDesc: 'Găng tay cao cấp chất liệu Microfiber bọc lớp vân Carbon chống mòn, lớp đệm foam 4 tầng bảo vệ tối đa khớp ngón.',
    fullDesc: 'DAFIST Pro Stealth Carbon là dòng găng biểu tượng dành cho các võ sĩ quyền Anh hiện đại. Thiết kế công thái học khóa chặt cổ tay, lớp lót kháng khuẩn CoolMax thoát mồ hôi siêu tốc. Phù hợp cho cả luyện tập bao cát hàng ngày lẫn sparring đối kháng cường độ cao.',
    features: [
      'Chất liệu da Microfiber siêu bền thế hệ mới, đàn hồi gấp 2 lần da tổng hợp thông thường',
      'Đệm Foam đa lớp đúc nguyên khối hấp thụ tối đa lực phản chấn',
      'Khóa dán bản rộng 10cm bảo vệ cổ tay, triệt tiêu nguy cơ trật khớp',
      'Thiết kế ngón cái gắn liền cố định chống chấn thương bẻ gập',
      'Lỗ thông khí laser ở lòng bàn tay giữ khô thoáng suốt buổi tập'
    ],
    specs: {
      material: 'Da Microfiber vân Carbon cao cấp',
      padding: 'Foam 4 lớp đúc công nghệ Shock-Absorb',
      closure: 'Khóa dán Velcro cường lực bản rộng',
      origin: 'Chính hãng DAFIST',
      suitability: 'Tập bao cát, đích đấm, Sparring đối kháng'
    },
    reviews: [
      {
        id: 'r1',
        author: 'Nguyễn Tiến Minh',
        role: 'VĐV Boxing Bán Chuyên',
        rating: 5,
        date: '12/02/2025',
        comment: 'Cầm lên là thấy độ đầm và chắc chắn. Khóa dán cổ tay cực kỳ ôm, đấm bao cát lực nén rất sướng, không bị đau cổ tay.',
        verified: true
      },
      {
        id: 'r2',
        author: 'Trần Hoàng Long',
        role: 'Người tập 2 năm',
        rating: 5,
        date: '28/01/2025',
        comment: 'Da microfiber này dùng nửa năm vẫn bóng và không bị nổ như găng PU rẻ tiền. Đáng tiền từng xu.',
        verified: true
      }
    ]
  },
  {
    id: 'glove-dafist-vandal-beginner',
    name: 'Găng Tay Boxing DAFIST Vandal (Cho Người Mới)',
    slug: 'gang-tay-boxing-dafist-vandal-beginner',
    brand: 'DAFIST',
    category: 'gloves',
    sport: 'boxing',
    targetLevel: 'beginner',
    price: 890000,
    originalPrice: 1050000,
    rating: 4.8,
    reviewCount: 245,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: ['10oz', '12oz', '14oz'],
    shortDesc: 'Dòng găng thiết kế riêng cho người mới bắt đầu tập luyện Boxing & Fitness, form găng ôm khít dễ nắm tay.',
    fullDesc: 'DAFIST Vandal là giải pháp toàn diện cho người vừa bắt đầu hành trình võ thuật. Với trọng tâm cân bằng, lớp đệm êm giảm chấn và cổ tay trợ lực, sản phẩm giúp người mới làm quen với kỹ thuật ra đòn đúng chuẩn mà không lo chấn thương.',
    features: [
      'Lớp mút đệm phân bổ đều bảo vệ các đốt xương mu bàn tay',
      'Form găng uốn cong tự nhiên giúp người mới nắm chặt tay đúng kỹ thuật',
      'Chất liệu da tổng hợp PU Grade-A bền bỉ, dễ vệ sinh sau buổi tập',
      'Trọng lượng chuẩn xác giúp rèn luyện cơ vai và thể lực'
    ],
    specs: {
      material: 'Da PU cao cấp phủ mờ thể thao',
      padding: 'Dual-Layer Compressed Foam',
      closure: 'Velcro Quick-Lock linh hoạt',
      origin: 'DAFIST Sports',
      suitability: 'Người mới tập từ 0 - 1 năm, Fitness Boxing'
    },
    reviews: [
      {
        id: 'r3',
        author: 'Lê Thảo My',
        role: 'Tập Fitness Boxing nữ',
        rating: 5,
        date: '04/03/2025',
        comment: 'Mình nữ 52kg dùng bản 10oz rất vừa vặn, màu đen viền đỏ nhìn siêu ngầu và cá tính. Tập xong không bị hôi tay.',
        verified: true
      }
    ]
  },
  {
    id: 'glove-dafist-apex-mma',
    name: 'Găng Tay MMA Hở Ngón DAFIST Apex Combat 4oz',
    slug: 'gang-tay-mma-ho-ngon-dafist-apex-combat-4oz',
    brand: 'DAFIST',
    category: 'mma-gloves',
    sport: 'mma',
    targetLevel: 'intermediate',
    price: 1150000,
    originalPrice: 1350000,
    rating: 4.9,
    reviewCount: 89,
    isFeatured: true,
    isNew: true,
    images: [
      '/images/gang-tay-mma-apex-combat-4oz.jpg',
      '/images/gang-tay-mma-apex-combat-4oz-2.jpg',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    shortDesc: 'Găng MMA tiêu chuẩn thi đấu 4oz hở ngón, hỗ trợ tối đa kỹ thuật địa chiến (grappling) và striking chuẩn xác.',
    fullDesc: 'Được nghiên cứu bởi các võ sĩ MMA chuyên nghiệp, găng DAFIST Apex Combat kết hợp hoàn hảo giữa độ linh hoạt ngón tay khi bẻ khóa vật (submission) và độ đệm knuckle dày 25mm khi tung đòn đấm.',
    features: [
      'Lòng bàn tay mở hoàn toàn tối đa hoá cảm giác nắm và vật (Grappling)',
      'Phần đệm mu bàn tay cong tự nhiên bảo vệ xương khi va đập',
      'Dây quấn cổ tay 2 vòng (Dual-Strap) khóa cứng vị trí cổ tay',
      'Gia cố viền may đôi bằng sợi nylon chống tưa rách khi cọ xát thảm'
    ],
    specs: {
      material: 'Da Microfiber chịu ma sát cao',
      padding: 'High-Density Gel-Infused Foam',
      closure: 'Khóa dán cổ tay kép 2 vòng xoay',
      origin: 'DAFIST MMA Series',
      suitability: 'Tập luyện MMA, BJJ, No-Gi, Takedown & Striking'
    },
    reviews: [
      {
        id: 'r4',
        author: 'Đặng Tuấn Anh',
        role: 'VĐV MMA Nghiệp Dư',
        rating: 5,
        date: '15/02/2025',
        comment: 'Form ôm ngón tay rất gọn, lúc siết guillotine hay rear naked choke không bị cấn hay vướng.',
        verified: true
      }
    ]
  },
  {
    id: 'muaythai-fairthai-pro-leather',
    name: 'Găng Tay Muay Thai DAFIST Băng Cốc Pro Genuine Leather',
    slug: 'gang-tay-muay-thai-dafist-bang-coc-pro',
    brand: 'DAFIST',
    category: 'gloves',
    sport: 'muaythai',
    targetLevel: 'pro',
    price: 2450000,
    originalPrice: 2790000,
    rating: 5.0,
    reviewCount: 76,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['10oz', '12oz', '14oz', '16oz'],
    shortDesc: 'Dòng găng Muay Thai truyền thống làm từ 100% da bò thật, đệm cạnh bàn tay dày chuyên dụng để đỡ đòn đá.',
    fullDesc: 'Sản xuất theo phong cách các lò võ Thái Lan lừng danh: form găng ngắn hơn, mu bàn tay bè ra hỗ trợ bắt chân đòn đá (catch kicks) và gài clinch ghì cổ đối thủ linh hoạt.',
    features: [
      '100% Da bò thật thuộc tự nhiên siêu bền và có mùi thơm da cao cấp',
      'Gia cố đệm dày dọc cạnh lòng bàn tay để đỡ đòn đá quét của đối phương',
      'Cổ găng ngắn hơn găng boxing truyền thống, dễ dàng xoay chuyển trong tư thế Clinch',
      'Đường chỉ may thủ công chuẩn xác từng mắt găng'
    ],
    specs: {
      material: '100% Da bò thật (Top Grain Leather)',
      padding: 'Triple-Density Foam Thái Lan',
      closure: 'Cổ dán bản lớn chắc chắn',
      origin: 'DAFIST Combat Pro Lab',
      suitability: 'Muay Thai chuyên sâu, Kickboxing, Sparring'
    }
  },
  {
    id: 'protection-dafist-wraps-45m',
    name: 'Băng Quấn Tay Co Giãn DAFIST Mexican Style 4.5m (Cặp)',
    slug: 'bang-quan-tay-co-gian-dafist-mexican-style-45m',
    brand: 'DAFIST',
    category: 'protection',
    sport: 'all',
    targetLevel: 'beginner',
    price: 220000,
    originalPrice: 280000,
    rating: 4.9,
    reviewCount: 512,
    isFeatured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615117972428-28bd748abf50?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['4.5 Mét (Chuẩn quốc tế)'],
    shortDesc: 'Băng quấn tay co giãn phong cách Mexico 4.5m, thấm hút mồ hôi tốt, bảo vệ toàn diện khớp cổ tay và ngón tay.',
    fullDesc: 'Bất kỳ ai tập Boxing, MMA hay Muay Thai đều bắt buộc phải có băng quấn tay trước khi xỏ găng. Băng quấn DAFIST với sợi Cotton pha Spandex tạo độ co giãn vừa đủ, ôm khít từng ngón tay mà không làm tê tắc tuần hoàn máu.',
    features: [
      'Chiều dài chuẩn 4.5m quấn đủ mọi kiểu bảo vệ khớp ngón và cổ tay',
      'Chất liệu pha sợi Spandex co giãn đàn hồi không bị giãn nhão sau khi giặt',
      'Vòng xỏ ngón cái tiện lợi và khóa dán Velcro độ bám cao',
      'Thoáng khí, thấm hút mồ hôi tối đa ngăn mồ hôi ngấm làm hỏng găng'
    ],
    specs: {
      material: 'Cotton co giãn cao cấp pha Spandex',
      padding: 'Lớp quấn bảo vệ xương khớp',
      closure: 'Khóa dán Velcro siêu dính',
      origin: 'DAFIST Essentials',
      suitability: 'Tất cả các môn võ đối kháng, bắt buộc cho mọi buổi tập'
    }
  },
  {
    id: 'protection-dafist-shin-guards',
    name: 'Bọc Ống Chân Muay Thai / MMA DAFIST Titan Shield',
    slug: 'boc-ong-chan-muay-thai-mma-dafist-titan-shield',
    brand: 'DAFIST',
    category: 'protection',
    sport: 'muaythai',
    targetLevel: 'intermediate',
    price: 1390000,
    originalPrice: 1650000,
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['M (1m55 - 1m70)', 'L (1m70 - 1m85)', 'XL (> 1m85)'],
    shortDesc: 'Bảo hộ ống đồng và mu bàn chân với đệm nén siêu nhẹ, không gây nặng chân khi tung đòn đá cao.',
    fullDesc: 'Ống đồng là vùng chịu va chạm khốc liệt nhất trong Muay Thai và Kickboxing. DAFIST Titan Shield trang bị đệm sống lưng ống chân dày dặn, đai khóa kép chống trượt và quai luồn gót chân co giãn vững chãi.',
    features: [
      'Gờ đệm sống giữa dày dặn triệt tiêu 85% lực va đập khi check đòn đá',
      'Trọng lượng siêu nhẹ không gây cản trở tốc độ ra đòn',
      'Khóa dán kép sau bắp chân giữ bọc chân không bị xoay lệch',
      'Lót vải dệt tổ ong kháng khuẩn, chống trượt mồ hôi'
    ],
    specs: {
      material: 'Da nhân tạo Microfiber + Vải lót kỹ thuật',
      padding: 'EVA Foam đa mật độ cao',
      closure: 'Đai khóa dán kép + chun gót chân',
      origin: 'DAFIST Protective Gear',
      suitability: 'Tập Sparring Muay Thai, Kickboxing, MMA Striking'
    }
  },
  {
    id: 'protection-dafist-headgear',
    name: 'Mũ Bảo Hộ Đầu Sparring DAFIST Fortress Full Protection',
    slug: 'mu-bao-ho-dau-sparring-dafist-fortress',
    brand: 'DAFIST',
    category: 'protection',
    sport: 'boxing',
    targetLevel: 'intermediate',
    price: 1590000,
    originalPrice: 1890000,
    rating: 4.9,
    reviewCount: 63,
    isFeatured: false,
    images: [
      '/images/mu-bao-ho-dau-dafist-fortress.jpg',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['M (Chu vi đầu 54-57cm)', 'L (Chu vi đầu 58-61cm)'],
    shortDesc: 'Mũ bảo hộ đầu che má và cằm, tầm nhìn góc rộng 180 độ, bảo vệ an toàn tối đa cho các buổi đấu tập Sparring.',
    fullDesc: 'An toàn não bộ và khuôn mặt là ưu tiên số một. Mũ Fortress được đúc với lớp đệm dày vùng thái dương, gò má và cằm, đồng thời tối ưu hóa khoảng hở trước mắt giúp võ sĩ dễ dàng quan sát đòn đánh của đối thủ.',
    features: [
      'Đệm má vát góc chữ V tối ưu tầm nhìn phía dưới (quan sát đòn đấm móc và đòn đá)',
      'Hệ thống dây buộc đỉnh đầu và khóa dán sau gáy tùy chỉnh độ ôm tuyệt đối',
      'Khóa cài cằm chắc chắn không bị xê dịch khi dính đòn',
      'Lớp mút tai có thanh ngang bảo vệ màng nhĩ khỏi áp suất chấn động'
    ],
    specs: {
      material: 'Da tổng hợp gia cường Matte Black',
      padding: 'Multi-layer High Impact Gel Foam',
      closure: 'Lace-up đỉnh + Velcro sau gáy + Chinstrap',
      origin: 'DAFIST Pro Series',
      suitability: 'Sparring Boxing, Muay Thai, Kickboxing mọi cấp độ'
    }
  },
  {
    id: 'protection-mouthguard-dual',
    name: 'Bọc Răng Tự Khuôn Nhiệt DAFIST Dual Guard Air-Flow',
    slug: 'boc-rang-tu-khuon-nhiet-dafist-dual-guard',
    brand: 'DAFIST',
    category: 'protection',
    sport: 'all',
    targetLevel: 'beginner',
    price: 290000,
    originalPrice: 350000,
    rating: 4.7,
    reviewCount: 310,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Free Size (Người lớn từ 16 tuổi)'],
    shortDesc: 'Bọc răng cao cấp ngâm nước sôi tự định hình theo hàm răng, có rãnh khí thở ở giữa giúp hít thở nhịp nhàng.',
    fullDesc: 'Bảo vệ răng, nướu và ngăn ngừa chấn động xương hàm. Công nghệ Boil & Bite cho phép ngâm nước nóng để bọc răng tự ôm khít theo từng dáng răng cá nhân chỉ trong 60 giây.',
    features: [
      'Chất liệu nhựa nhiệt dẻo y tế chuẩn FDA, không chứa BPA gây hại',
      'Cấu trúc 2 tầng: tầng ngoài cứng chống sốc, tầng trong mềm êm chân răng',
      'Kênh thoáng khí trung tâm cho phép thở tự nhiên ngay cả khi đang cắn chặt hàm',
      'Tặng kèm hộp đựng kháng khuẩn bảo quản vệ sinh'
    ],
    specs: {
      material: 'Medical Grade EVA không độc hại',
      padding: 'Shock-Absorbing Outer Frame',
      closure: 'Định hình nhiệt Boil & Bite',
      origin: 'DAFIST Dental Care',
      suitability: 'Mọi môn thể thao đối kháng có va chạm'
    }
  },
  {
    id: 'gear-focus-pads-mitts',
    name: 'Cặp Đích Đấm Bàn Tay Huấn Luyện Viên DAFIST Curve Mitts',
    slug: 'cap-dich-dam-ban-tay-dafist-curve-mitts',
    brand: 'DAFIST',
    category: 'training-gear',
    sport: 'boxing',
    targetLevel: 'intermediate',
    price: 1450000,
    originalPrice: 1750000,
    rating: 4.9,
    reviewCount: 82,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Cặp 2 Chiếc (Tiêu chuẩn HLV)'],
    shortDesc: 'Đích đấm cong công thái học giảm áp lực cổ tay cho người cầm đích, phát ra âm thanh nổ đanh giòn khi ra đòn.',
    fullDesc: 'Dành cho các huấn luyện viên và bạn tập cặp. Mặt đích thiết kế cong hình lòng bàn tay tự nhiên giúp người cầm đích đón lực êm ái, bảo vệ khuỷu tay và khớp vai người đỡ đòn qua hàng trăm cú đấm.',
    features: [
      'Gờ cong tự nhiên ôm trọn nắm đấm, điểm hồng tâm màu đỏ hỗ trợ ngắm đòn chính xác',
      'Lót lòng bàn tay dạng quả bóng tròn chống trượt ngón tay',
      'Âm thanh bắt đòn to, đanh kích thích cảm giác hưng phấn cho võ sinh',
      'Khóa dán đệm dày nâng đỡ cổ tay huấn luyện viên'
    ],
    specs: {
      material: 'Da PU Carbon gia cố vải bố chống rách',
      padding: 'Cao su đúc bọt xốp đàn hồi cao',
      closure: 'Đai dán vòng mu bàn tay',
      origin: 'DAFIST Trainer Series',
      suitability: 'Tập kỹ thuật đấm tổ hợp (Combos), phản xạ tốc độ'
    }
  },
  {
    id: 'gear-heavy-bag-12m',
    name: 'Bao Cát Treo Boxing Chuyên Nghiệp DAFIST Heavy Bag 1.2m',
    slug: 'bao-cat-treo-boxing-chuyen-nghiep-dafist-12m',
    brand: 'DAFIST',
    category: 'training-gear',
    sport: 'boxing',
    targetLevel: 'all',
    price: 2650000,
    originalPrice: 3100000,
    rating: 4.9,
    reviewCount: 115,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['1.2m (Đã nhồi sẵn 38kg)', '1.5m (Đã nhồi sẵn 48kg)'],
    shortDesc: 'Bao cát treo da Microfiber 3 lớp chống rách, nhồi vải vụn và mút xốp đầm chắc, bảo hành đường may 2 năm.',
    fullDesc: 'Thiết bị không thể thiếu tại phòng gym hoặc góc tập luyện tại nhà. Bao cát DAFIST chịu lực đập liên hồi mà không bị lún đáy hay biến dạng nhờ lõi ống đệm bọt biển trung tâm.',
    features: [
      'Lớp da ngoài 1.4mm dán liền lớp vải canvas chịu tải trọng tới 80kg',
      'Xích treo xoay 360 độ bằng thép mạ kẽm chống rối xoắn xích khi bao lắc',
      'Nhồi bằng máy đồng đều không có đá sỏi gây chấn thương mu chân',
      'Đáy có quai chằng cố định xuống sàn nếu muốn giảm biên độ lắc'
    ],
    specs: {
      material: 'Da nhân tạo tổng hợp 3 lớp dày 1.5mm',
      padding: 'Vải vụn ép chặt + Ống xốp cân bằng chấn',
      closure: 'Khóa kéo miệng bao chịu lực kèm dây đai',
      origin: 'DAFIST Gym Equipment',
      suitability: 'Luyện tập đấm đá tại nhà hoặc phòng tập thương mại'
    }
  },
  {
    id: 'apparel-dafist-muaythai-shorts',
    name: 'Quần Thi Đấu Muay Thai / Kickboxing DAFIST Satin Stealth',
    slug: 'quan-thi-dau-muay-thai-kickboxing-dafist-satin',
    brand: 'DAFIST',
    category: 'apparel-acc',
    sport: 'muaythai',
    targetLevel: 'all',
    price: 490000,
    originalPrice: 590000,
    rating: 4.8,
    reviewCount: 154,
    isFeatured: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S (45-55kg)', 'M (55-68kg)', 'L (68-80kg)', 'XL (80-95kg)'],
    shortDesc: 'Vải Satin bóng cao cấp, đường xẻ hông sâu hỗ trợ các đòn đá cao và gối không vướng víu.',
    fullDesc: 'Thiết kế đậm chất chiến binh với tone đen tuyền viền đỏ sắc lạnh. Cạp chun bản rộng 8 nếp co giãn thoải mái, ôm chắc bụng dưới giúp võ sĩ tự tin di chuyển bộ chân.',
    features: [
      'Vải Satin dày dặn, không bai xù, trượt mồ hôi nhanh',
      'Xẻ tà chữ V hai bên hông tạo biên độ đá tối đa',
      'Logo thêu nổi sợi chỉ dù kim tuyến tinh xảo',
      'Thích hợp cho cả nam và nữ tập luyện Muay Thai, Kickboxing, Boxing'
    ],
    specs: {
      material: '100% Premium Satin Polyamide',
      padding: 'Không',
      closure: 'Chun co giãn 8 đường chỉ gia cường',
      origin: 'DAFIST Fightwear',
      suitability: 'Tập luyện và thi đấu Muay Thai, Kickboxing'
    }
  },
  {
    id: 'gear-speed-rope-bearing',
    name: 'Dây Nhảy Thể Lực Tốc Độ Bạc Đạn Thép DAFIST Fast-Twitch',
    slug: 'day-nhay-the-luc-toc-do-bac-dan-thep-dafist',
    brand: 'DAFIST',
    category: 'apparel-acc',
    sport: 'all',
    targetLevel: 'beginner',
    price: 250000,
    originalPrice: 320000,
    rating: 4.9,
    reviewCount: 420,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Dài 3m (Tự cắt chỉnh theo chiều cao)'],
    shortDesc: 'Dây cáp thép bọc nhựa PU, cụm bạc đạn xoay 360 độ siêu mượt giúp tăng tốc độ nhảy Double-Under tối đa.',
    fullDesc: 'Dây nhảy là bài tập bổ trợ quan trọng nhất của mọi võ sĩ boxing nhằm rèn luyện nhịp tim, sự dẻo dai cổ chân và phản xạ nhịp bước chân. Tay cầm vân nhôm chống trơn mồ hôi tay tuyệt đối.',
    features: [
      'Bạc đạn xoay đa hướng không gây xoắn gập dây',
      'Lõi cáp thép 2.5mm cho tốc độ xé gió cao',
      'Chốt ốc vặn tay điều chỉnh độ dài dây trong 10 giây',
      'Tay nắm hợp kim nhôm siêu nhẹ có khắc rãnh kim cương bám tay'
    ],
    specs: {
      material: 'Dây cáp thép bọc PU + Tay cầm hợp kim nhôm',
      padding: 'Không',
      closure: 'Chốt ốc siết dây',
      origin: 'DAFIST Conditioning',
      suitability: 'Khởi động, tập cardio, nâng cao thể lực võ thuật'
    }
  }
];

export const DEMO_COUPONS = [
  {
    code: 'BOXING10',
    discountType: 'percentage' as const,
    value: 10,
    minOrderValue: 500000,
    description: 'Giảm 10% cho đơn hàng từ 500.000₫'
  },
  {
    code: 'DAFIST50K',
    discountType: 'fixed' as const,
    value: 50000,
    minOrderValue: 300000,
    description: 'Giảm 50.000₫ cho khách hàng mới'
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed' as const,
    value: 40000,
    minOrderValue: 1000000,
    description: 'Miễn phí vận chuyển toàn quốc'
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  'all': 'Tất cả sản phẩm',
  'gloves': 'Găng Boxing & Muay Thai',
  'mma-gloves': 'Găng MMA',
  'protection': 'Băng quấn & Bảo hộ',
  'training-gear': 'Dụng cụ tập luyện',
  'apparel-acc': 'Quần áo & Phụ kiện'
};

export const SPORT_LABELS: Record<string, string> = {
  'all': 'Tất cả môn võ',
  'boxing': 'Boxing (Quyền Anh)',
  'mma': 'MMA (Võ Tổng Hợp)',
  'muaythai': 'Muay Thai / Kickboxing'
};

export const LEVEL_LABELS: Record<string, string> = {
  'all': 'Mọi cấp độ',
  'beginner': 'Người mới bắt đầu',
  'intermediate': 'Bán chuyên & Nâng cao',
  'pro': 'Chuyên nghiệp / Thi đấu'
};
