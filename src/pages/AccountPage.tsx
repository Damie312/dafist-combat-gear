import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useShop } from '../context/ShopContext';
import { 
  User as UserIcon, 
  MapPin, 
  LogOut, 
  Save, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { 
    customer, 
    customerProfile, 
    isLoading, 
    authError, 
    loginWithGoogle, 
    logout, 
    updateCustomerProfile,
    clearError 
  } = useCustomerAuth();
  
  const { addToast, navigateTo } = useShop();

  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');

  // Default shipping info state
  const [shippingFullName, setShippingFullName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sync state when customerProfile loads
  useEffect(() => {
    if (customerProfile) {
      setDisplayName(customerProfile.displayName || customer?.displayName || '');
      setPhone(customerProfile.phoneNumber || '');

      const def = customerProfile.defaultShippingInfo;
      if (def) {
        setShippingFullName(def.fullName || '');
        setShippingPhone(def.phone || '');
        setProvince(def.province || '');
        setDistrict(def.district || '');
        setWard(def.ward || '');
        setAddress(def.address || '');
      } else {
        setShippingFullName(customerProfile.displayName || customer?.displayName || '');
        setShippingPhone(customerProfile.phoneNumber || '');
      }
    }
  }, [customerProfile, customer]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    clearError();
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        addToast('Đăng nhập thành công!', 'success');
      }
    } catch {
      // Handled in context
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    addToast('Đã đăng xuất tài khoản.', 'info');
  };

  const handleSaveShippingInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setIsSaving(true);
    try {
      await updateCustomerProfile({
        displayName: displayName.trim() || customer.displayName || 'Khách hàng',
        phoneNumber: phone.trim(),
        defaultShippingInfo: {
          fullName: shippingFullName.trim(),
          phone: shippingPhone.trim(),
          province: province.trim(),
          district: district.trim(),
          ward: ward.trim(),
          address: address.trim()
        }
      });
      addToast('Cập nhật địa chỉ giao hàng mặc định thành công!', 'success');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      addToast(err?.message || 'Không thể lưu thông tin. Vui lòng thử lại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-400">
        <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  // If user is not logged in: Show Google Sign In screen
  if (!customer) {
    return (
      <div className="min-h-[75vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
              <UserIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Tài Khoản <span className="text-red-600">DAFIST</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Đăng nhập để quản lý hồ sơ, lưu thông tin giao hàng mặc định và trải nghiệm thanh toán thuận tiện.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              id="btn-customer-google-login"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isLoggingIn ? 'Đang kết nối...' : 'Đăng nhập bằng Google'}</span>
            </button>

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-zinc-500">
                Bạn vẫn có thể mua sắm và thanh toán như khách vãng lai mà không cần đăng nhập tài khoản.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="mt-3 text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Xem danh mục võ phục & dụng cụ</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated customer view
  const formattedCreatedAt = customerProfile?.createdAt
    ? new Date(customerProfile.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Mới gia nhập';

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-5 z-10">
          {customer.photoURL ? (
            <img 
              src={customer.photoURL} 
              alt={customer.displayName || 'Customer'} 
              className="w-16 h-16 rounded-full border-2 border-red-600 object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-600/10 border-2 border-red-600 text-red-500 flex items-center justify-center font-black text-xl">
              {(customer.displayName || customer.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {customerProfile?.displayName || customer.displayName || 'Khách Hàng DAFIST'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] bg-red-600/10 text-red-400 border border-red-600/20 px-2 py-0.5 uppercase font-bold tracking-wider">
                <ShieldCheck className="w-3 h-3 text-red-500" />
                Thành viên
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>{customer.email}</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              <span>Thành viên từ: {formattedCreatedAt}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('my-orders')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 transition-colors shadow-lg shadow-red-900/20 cursor-pointer"
          >
            Lịch Sử Đơn Hàng
          </button>
          <button
            id="btn-customer-signout"
            type="button"
            onClick={handleSignOut}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 px-4 py-2.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details & Security */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-red-500" />
              Thông Tin Tài Khoản
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Mã khách hàng (UID)</label>
                <div className="bg-black/60 border border-white/5 p-2 font-mono text-[11px] text-zinc-400 break-all select-all">
                  {customer.uid}
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full bg-black border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-red-600 text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0988123888"
                  className="w-full bg-black border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-red-600 text-xs transition-colors"
                />
              </div>

              <div className="pt-2 text-[11px] text-zinc-500">
                <p>Email liên kết với tài khoản Google không thể thay đổi.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Lịch Sử Đơn Hàng
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tính năng xem và tra cứu lịch sử mua hàng trực tuyến sẽ sẵn sàng trong Phase tiếp theo của hệ thống.
            </p>
          </div>
        </div>

        {/* Right Column: Default Shipping Information Management */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveShippingInfo} className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Địa Chỉ Nhận Hàng Mặc Định
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Thông tin này sẽ được tự động điền khi bạn tiến hành thanh toán tại DAFIST.
                </p>
              </div>

              {customerProfile?.defaultShippingInfo?.address && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã cấu hình
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingFullName}
                  onChange={(e) => setShippingFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Võ"
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ví dụ: Cầu Giấy, Quận 1..."
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Ví dụ: Dịch Vọng Hậu, Bến Nghé..."
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Địa chỉ chi tiết (Số nhà, tên đường, toà nhà) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: Số 24 ngõ 180 đường Hoàng Quốc Việt"
                  className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Hồ sơ được lưu trữ bảo mật trên Firestore dưới mã định danh cá nhân của bạn.
              </span>

              <button
                id="btn-save-customer-profile"
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu thông tin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
