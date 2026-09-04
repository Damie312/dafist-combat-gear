import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CombatSport, ExperienceLevel } from '../../types';
import { X, Plus, Trash2, Image as ImageIcon, Save, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, SPORT_LABELS, LEVEL_LABELS } from '../../data/products';
import { createProductInFirestore, updateProductInFirestore } from '../../services/productService';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSaved: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaved,
  showToast
}) => {
  const isEdit = !!productToEdit;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('DAFIST');
  const [category, setCategory] = useState<ProductCategory>('gloves');
  const [sport, setSport] = useState<CombatSport>('boxing');
  const [targetLevel, setTargetLevel] = useState<ExperienceLevel>('all');
  const [price, setPrice] = useState<number>(1200000);
  const [originalPrice, setOriginalPrice] = useState<number>(1500000);
  const [stock, setStock] = useState<number>(30);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [sizesInput, setSizesInput] = useState('10oz, 12oz, 14oz, 16oz');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [material, setMaterial] = useState('Da nhân tạo Microfiber Premium chống rách');
  const [padding, setPadding] = useState('Đệm bọt khí 4 lớp Multi-Layer IMF');
  const [closure, setClosure] = useState('Khóa dán Velcro Quick-Wrap bản rộng 8cm');
  const [origin, setOrigin] = useState('Thiết kế & Công nghệ DAFIST');
  const [suitability, setSuitability] = useState('Sparring, đấm bao cát nặng, tập đích đấm');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setSlug(productToEdit.slug || '');
      setBrand(productToEdit.brand || 'DAFIST');
      setCategory(productToEdit.category || 'gloves');
      setSport(productToEdit.sport || 'boxing');
      setTargetLevel(productToEdit.targetLevel || 'all');
      setPrice(productToEdit.price || 0);
      setOriginalPrice(productToEdit.originalPrice || 0);
      setStock(typeof productToEdit.stock === 'number' ? productToEdit.stock : 25);
      setIsFeatured(!!productToEdit.isFeatured);
      setIsBestSeller(!!productToEdit.isBestSeller);
      setIsNew(!!productToEdit.isNew);
      setSizesInput(productToEdit.sizes ? productToEdit.sizes.join(', ') : '');
      setImageUrls(productToEdit.images && productToEdit.images.length > 0 
        ? productToEdit.images 
        : ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80']
      );
      setShortDesc(productToEdit.shortDesc || '');
      setFullDesc(productToEdit.fullDesc || '');
      setFeaturesText(productToEdit.features ? productToEdit.features.join('\n') : '');
      setMaterial(productToEdit.specs?.material || '');
      setPadding(productToEdit.specs?.padding || '');
      setClosure(productToEdit.specs?.closure || '');
      setOrigin(productToEdit.specs?.origin || '');
      setSuitability(productToEdit.specs?.suitability || '');
    } else {
      // Reset defaults for creation
      setName('');
      setSlug('');
      setBrand('DAFIST');
      setCategory('gloves');
      setSport('boxing');
      setTargetLevel('all');
      setPrice(1290000);
      setOriginalPrice(1590000);
      setStock(30);
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNew(true);
      setSizesInput('10oz, 12oz, 14oz, 16oz');
      setImageUrls([
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80'
      ]);
      setShortDesc('Trang thiết bị đối kháng chuyên nghiệp DAFIST với tiêu chuẩn thi đấu.');
      setFullDesc('Được gia công và hoàn thiện tỉ mỉ bằng vật liệu cao cấp, bảo vệ tối đa khớp cổ tay và xương bàn tay.');
      setFeaturesText('Vật liệu bền bỉ chịu lực cao\nĐệm foam đa lớp hấp thụ lực xung kích chấn động\nHệ thống thoát khí giữ thoáng mát\nThiết kế công thái học ôm sát bàn tay');
      setMaterial('Da PU cao cấp gia cường sợi carbon');
      setPadding('Bọt xốp EVA foam 3 lớp hấp thụ lực');
      setClosure('Khóa dán Velcro co giãn trợ lực cổ tay');
      setOrigin('DAFIST Gear Vietnam');
      setSuitability('Tập luyện cá nhân, sparring, huấn luyện phòng gym');
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const generateSlugFromName = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit && !slug) {
      setSlug(generateSlugFromName(val));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImageUrls([...imageUrls, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (imageUrls.length <= 1) {
      showToast('Cần giữ lại ít nhất 1 hình ảnh sản phẩm', 'info');
      return;
    }
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!brand.trim()) newErrors.brand = 'Vui lòng nhập tên thương hiệu';
    if (price <= 0) newErrors.price = 'Giá bán phải lớn hơn 0đ';
    if (stock < 0) newErrors.stock = 'Số lượng tồn kho không hợp lệ';
    if (imageUrls.length === 0) newErrors.images = 'Cần ít nhất 1 hình ảnh';

    const parsedSizes = sizesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (parsedSizes.length === 0) {
      newErrors.sizes = 'Cần ít nhất 1 kích thước/size sản phẩm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Vui lòng kiểm tra lại các trường bắt buộc!', 'error');
      return;
    }

    const calculatedSlug = slug.trim() || generateSlugFromName(name);
    const parsedFeatures = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const productData: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      slug: calculatedSlug,
      brand: brand.trim(),
      category,
      sport,
      targetLevel,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 0,
      isFeatured,
      isBestSeller,
      isNew,
      images: imageUrls,
      sizes: parsedSizes,
      shortDesc: shortDesc.trim() || name.trim(),
      fullDesc: fullDesc.trim() || shortDesc.trim(),
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Tiêu chuẩn thi đấu chuyên nghiệp'],
      specs: {
        material: material.trim() || 'Vật liệu tiêu chuẩn DAFIST',
        padding: padding.trim() || 'Đệm đa lớp hấp thụ lực',
        closure: closure.trim() || 'Khóa dán an toàn',
        origin: origin.trim() || 'Chính hãng DAFIST',
        suitability: suitability.trim() || 'Boxing, Kickboxing, MMA'
      },
      reviews: productToEdit?.reviews || []
    };

    setIsSubmitting(true);

    try {
      if (isEdit && productToEdit) {
        await updateProductInFirestore(productToEdit.id, productData);
        showToast(`Đã cập nhật sản phẩm "${productData.name}" thành công!`, 'success');
      } else {
        await createProductInFirestore(productData);
        showToast(`Đã thêm sản phẩm mới "${productData.name}" vào kho!`, 'success');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Failed to save product to Firestore:', err);
      const isPermission = err?.message?.includes('permission') || err?.message?.includes('PERMISSION_DENIED');
      if (isPermission) {
        showToast('Lỗi bảo mật (403): Thao tác bị từ chối bởi Firestore Rules. Cần quyền Quản trị viên!', 'error');
      } else {
        showToast('Có lỗi xảy ra khi lưu vào Firestore. Vui lòng thử lại!', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        id="admin-product-modal"
        className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-none shadow-2xl my-8 text-white overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                {isEdit ? 'CHỈNH SỬA SẢN PHẨM' : 'THÊM MỚI SẢN PHẨM'}
              </span>
              {isEdit && (
                <span className="text-xs text-zinc-500 font-mono">
                  ID: {productToEdit?.id}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight text-white mt-0.5">
              {isEdit ? productToEdit?.name : 'Tạo Sản Phẩm Thiết Bị Võ Thuật Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              1. Thông Tin Cơ Bản
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Găng Tay Boxing DAFIST Pro Stealth Carbon"
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Slug đường dẫn
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="gang-tay-boxing-dafist-pro"
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white placeholder-zinc-600 font-mono text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Thương hiệu *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="DAFIST"
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Danh mục sản phẩm *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="gloves">{CATEGORY_LABELS['gloves']}</option>
                  <option value="mma-gloves">{CATEGORY_LABELS['mma-gloves']}</option>
                  <option value="protection">{CATEGORY_LABELS['protection']}</option>
                  <option value="training-gear">{CATEGORY_LABELS['training-gear']}</option>
                  <option value="apparel-acc">{CATEGORY_LABELS['apparel-acc']}</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Bộ môn võ thuật *
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value as CombatSport)}
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="boxing">{SPORT_LABELS['boxing']}</option>
                  <option value="mma">{SPORT_LABELS['mma']}</option>
                  <option value="muaythai">{SPORT_LABELS['muaythai']}</option>
                  <option value="all">{SPORT_LABELS['all']}</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Trình độ mục tiêu
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value as ExperienceLevel)}
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="all">{LEVEL_LABELS['all']}</option>
                  <option value="beginner">{LEVEL_LABELS['beginner']}</option>
                  <option value="intermediate">{LEVEL_LABELS['intermediate']}</option>
                  <option value="pro">{LEVEL_LABELS['pro']}</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Tồn kho ban đầu (Số lượng) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-red-600 font-bold"
                />
                {errors.stock && <p className="text-red-500 text-[10px] mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Giá bán & Cờ trạng thái */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              2. Giá Bán & Trạng Thái
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Giá bán hiện tại (VND) *
                </label>
                <input
                  type="number"
                  step="10000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="1200000"
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-red-600"
                />
                {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                  Giá niêm yết gốc (VND)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="1500000"
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white font-mono focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-2 bg-zinc-900/40 p-3 border border-white/5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-red-600 w-4 h-4"
                />
                <span className="text-xs font-bold text-zinc-300">Sản phẩm nổi bật (Featured)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="accent-red-600 w-4 h-4"
                />
                <span className="text-xs font-bold text-zinc-300">Bán chạy nhất (Best Seller)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="accent-red-600 w-4 h-4"
                />
                <span className="text-xs font-bold text-zinc-300">Hàng mới về (New Release)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Kích thước & Hình ảnh */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              3. Kích Thước & Hình Ảnh
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
                  Các kích thước / Size khả dụng * (phân cách bằng dấu phẩy)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSizesInput('10oz, 12oz, 14oz, 16oz')}
                    className="text-[10px] text-zinc-500 hover:text-red-400 underline"
                  >
                    + Mẫu Găng
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizesInput('S, M, L, XL')}
                    className="text-[10px] text-zinc-500 hover:text-red-400 underline"
                  >
                    + Mẫu S/M/L/XL
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizesInput('Tiêu chuẩn, Free Size')}
                    className="text-[10px] text-zinc-500 hover:text-red-400 underline"
                  >
                    + Mẫu Free Size
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="10oz, 12oz, 14oz, 16oz"
                className="w-full bg-zinc-900 border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
              />
              {errors.sizes && <p className="text-red-500 text-[10px] mt-1">{errors.sizes}</p>}
            </div>

            {/* Images List */}
            <div>
              <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-2 font-bold">
                Danh sách URL hình ảnh *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group border border-white/10 bg-black aspect-square overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-red-600 text-[9px] font-bold px-1 py-0.5 uppercase">
                        Ảnh chính
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Nhập URL hình ảnh (https://...)"
                  className="flex-1 bg-zinc-900 border border-white/10 px-3 py-2 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Ảnh
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Mô tả & Tính năng */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              4. Bài Viết & Tính Năng
            </h3>

            <div>
              <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                Mô tả ngắn (Hiển thị thẻ xem nhanh)
              </label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Tóm tắt công năng nổi bật nhất..."
                className="w-full bg-zinc-900 border border-white/10 p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                Mô tả chi tiết sản phẩm
              </label>
              <textarea
                rows={4}
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Nội dung giới thiệu chuyên sâu về sản phẩm..."
                className="w-full bg-zinc-900 border border-white/10 p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                Các tính năng chính (Mỗi tính năng 1 dòng)
              </label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Foam 4 lớp chống chấn..."
                className="w-full bg-zinc-900 border border-white/10 p-3 text-white placeholder-zinc-600 font-mono text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Chất liệu</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Lớp đệm bảo hộ</label>
                <input
                  type="text"
                  value={padding}
                  onChange={(e) => setPadding(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Kiểu khóa / Quấn</label>
                <input
                  type="text"
                  value={closure}
                  onChange={(e) => setClosure(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Xuất xứ & Phù hợp</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 p-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-zinc-950 py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Đang Lưu Vào Firestore...' : (isEdit ? 'Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
