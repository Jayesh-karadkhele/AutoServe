import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AuthAlertProps {
  type?: 'error' | 'success';
  message: string | null;
  onClose?: () => void;
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ type = 'error', message }) => {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && alertRef.current) {
      alertRef.current.focus();
    }
  }, [message]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      ref={alertRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm font-medium shadow-sm transition-all outline-none focus:ring-2 ${
        isError
          ? 'border-rose-200 bg-rose-50/90 text-rose-900 focus:ring-rose-500/30'
          : 'border-emerald-200 bg-emerald-50/90 text-emerald-900 focus:ring-emerald-500/30'
      }`}
    >
      {isError ? (
        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <div className="flex-1 leading-relaxed">{message}</div>
    </div>
  );
};
