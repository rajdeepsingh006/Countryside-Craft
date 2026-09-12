import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-start space-x-3 transition-all ${
            toast.type === 'success' ? 'bg-[#F0F8F1] border-emerald-300 text-emerald-950'
            : toast.type === 'error' ? 'bg-[#FDF2F2] border-rose-300 text-rose-950'
            : toast.type === 'warning' ? 'bg-[#FFFBEB] border-amber-300 text-amber-950'
            : 'bg-[#F4EFE6] border-[#DED2C0] text-[#2C261F]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            : toast.type === 'error' ? <XCircle className="w-4 h-4 text-rose-600" />
            : toast.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-600" />
            : <Info className="w-4 h-4 text-[#8C5E3C]" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
          <button onClick={() => removeToast(toast.id)} className="p-0.5 rounded text-neutral-400 hover:text-neutral-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
