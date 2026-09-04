import React from 'react';
import { Shield } from 'lucide-react';

export const SessionBootstrapLoader: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Restoring secure authentication session"
      className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900"
    >
      <div className="flex flex-col items-center space-y-4 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl max-w-sm w-full text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md">
          <Shield className="h-7 w-7 stroke-[2.5]" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white"></span>
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Restoring AutoServe Session</h2>
          <p className="text-xs text-slate-500">Verifying secure credentials & identity...</p>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-sky-500 to-amber-500 h-1.5 rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
};
