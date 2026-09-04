import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthAlert } from '../components/AuthAlert';

interface RoleEntryPageProps {
  roleTitle: string;
}

export const RoleEntryPage: React.FC<RoleEntryPageProps> = ({ roleTitle }) => {
  const { user, logout, logoutAll } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setErrorMsg(null);
    try {
      await logout();
    } catch (err: unknown) {
      setIsLoggingOut(false);
      const msg = (err as Error)?.message || 'Failed to complete server logout';
      setErrorMsg(msg);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    setErrorMsg(null);
    try {
      await logoutAll();
    } catch (err: unknown) {
      setIsLoggingOut(false);
      const msg = (err as Error)?.message || 'Failed to revoke all sessions';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Auto<span className="text-amber-600">Serve</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Session Active
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl space-y-8">
          <AuthAlert message={errorMsg} />

          {/* User Profile Summary Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-amber-800">
                {user?.role || roleTitle.toUpperCase()}
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome, {user?.name || 'Authorized User'}
              </h1>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1">
              <p className="font-semibold text-slate-700">Authenticated Details:</p>
              <p className="text-slate-600">User ID: <code className="font-mono">{user?.id}</code></p>
              <p className="text-slate-600">Phone: <code className="font-mono">{user?.phone || 'N/A'}</code></p>
            </div>
          </div>

          {/* Development Handoff Notice */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <AlertCircle className="h-4 w-4 text-sky-600" />
              Part 8 Development Handoff Notice
            </div>
            <p className="text-xs text-sky-800 leading-relaxed">
              You have successfully authenticated and passed role-based security verification for <strong>{roleTitle}</strong> workspace.
              Full interactive vehicle management, appointment booking, job card tracking, and invoice payments will be implemented in <strong>Part 8</strong>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              Logout Current Session
            </button>
            <button
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
            >
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Revoke All Sessions
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs font-medium text-slate-500">
        © {new Date().getFullYear()} AutoServe Platform. {roleTitle} Workspace.
      </footer>
    </div>
  );
};
