import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded shadow-2xl border text-xs font-medium backdrop-blur-md transition-all animate-in slide-in-from-right-4 ${
            toast.type === 'success'
              ? 'bg-neutral-900/95 border-emerald-600/60 text-white'
              : toast.type === 'error'
              ? 'bg-neutral-900/95 border-red-600/80 text-white'
              : 'bg-neutral-900/95 border-neutral-700 text-white'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
