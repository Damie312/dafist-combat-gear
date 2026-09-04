import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useShop } from '../../context/ShopContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  LogOut,
  Sparkles
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    isLoading, 
    authError, 
    loginWithGoogle, 
    logout, 
    authorizedAdminEmail 
  } = useAdminAuth();
  
  const { navigateTo } = useShop();

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between py-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background subtle accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar navigation back to storefront */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between z-10">
        <button
          id="btn-login-back-to-store"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" />
          <span>Về Cửa Hàng (Storefront)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Firebase Auth Protected</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo and Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              DAFIST <span className="text-red-500">ADMIN</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Cổng Quản Trị Viên Kho Hàng & Đơn Hàng
            </p>
          </div>

          {/* If user is logged in but NOT authorized as admin */}
          {user && !isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-amber-400" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sm text-amber-200">Truy Cập Bị Từ Chối (403)</p>
                  <p>
                    Bạn đã đăng nhập bằng: <span className="font-mono text-white bg-neutral-800 px-1.5 py-0.5 rounded">{user.email}</span>
                  </p>
                  <p className="text-neutral-300">
                    Tài khoản này không có quyền quản trị viên. Hệ thống được bảo vệ bởi Firestore Security Rules cấp độ phân quyền (RBAC).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
                <span className="text-neutral-300 font-semibold">Tài khoản Quản trị viên hệ thống:</span>
                <p className="font-mono text-red-400 mt-1">{authorizedAdminEmail}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="btn-logout-switch-account"
                  onClick={logout}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm flex items-center justify-center gap-2 border border-neutral-700 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-neutral-400" />
                  <span>Đăng Xuất & Đổi Tài Khoản Google</span>
                </button>

                <button
                  id="btn-unauthorized-return-home"
                  onClick={() => navigateTo('home')}
                  className="w-full py-2.5 px-4 rounded-xl text-neutral-400 hover:text-white text-xs text-center hover:bg-neutral-800/40 transition cursor-pointer"
                >
                  Quay lại Cửa hàng
                </button>
              </div>
            </div>
          ) : (
            /* Standard Login Form / Action */
            <div className="space-y-5">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                  <p className="leading-relaxed">{authError}</p>
                </div>
              )}

              <div className="bg-neutral-950/60 rounded-xl p-4 border border-neutral-800/80 text-xs space-y-2 text-neutral-400">
                <div className="flex items-center gap-2 text-neutral-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Yêu cầu Xác thực & Phân quyền</span>
                </div>
                <p className="leading-relaxed">
                  Để đảm bảo an toàn cho dữ liệu kho hàng, chỉ nhân sự có tài khoản Google được cấu hình quyền Quản trị viên (<span className="text-white font-mono">{authorizedAdminEmail}</span>) mới có thể vào bảng điều khiển.
                </p>
              </div>

              <button
                id="btn-admin-google-login"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl hover:shadow-white/10 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị Viên với Google'}</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-neutral-500">
                  Được xác thực an toàn thông qua Firebase Auth SDK
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Highlights */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
            <CheckCircle2 className="w-4 h-4 text-red-500 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-neutral-300">Firebase Auth</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Xác thực OAuth tiêu chuẩn</p>
          </div>
          <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
            <ShieldCheck className="w-4 h-4 text-red-500 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-neutral-300">Cloud Rules</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Chặn ghi trái phép từ server</p>
          </div>
          <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/60">
            <Sparkles className="w-4 h-4 text-red-500 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-neutral-300">Không Lộ Secret</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Bảo mật mã nguồn an toàn</p>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-neutral-600 z-10">
        DAFIST Combat Gear Store Admin Panel &copy; 2026. Mọi hành vi xâm nhập trái phép đều bị ghi nhận.
      </div>
    </div>
  );
};
