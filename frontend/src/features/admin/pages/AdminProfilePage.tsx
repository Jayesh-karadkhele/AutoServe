import React from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAuth } from '@/features/auth/context/AuthContext';

export const AdminProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminShell title="Admin Profile & Session Control">
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-full bg-violet-600 text-white font-bold text-lg flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{user?.name || 'Platform Administrator'}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2.5 py-0.5 bg-violet-100 text-violet-800 rounded-full">
                Role: Platform Admin
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-semibold">User Reference ID:</span>
              <span className="font-mono text-slate-900">#{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-semibold">Authentication Token:</span>
              <span className="font-mono text-slate-500">In-Memory JWT Access Token (HttpOnly Refresh Cookie)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-semibold">Self-Deactivation Protection:</span>
              <span className="font-semibold text-emerald-700">Enforced by Server Invariants</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};
