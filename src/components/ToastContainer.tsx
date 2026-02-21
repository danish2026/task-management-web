import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white max-w-sm animate-slide-in ${
            toast.type === 'success'
              ? 'bg-green-500'
              : toast.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={20} className="flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={20} className="flex-shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="flex-shrink-0" />}
          
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Close toast"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
