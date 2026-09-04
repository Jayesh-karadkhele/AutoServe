import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleDestination } from './roleUtils';

export const ForbiddenPage: React.FC = () => {
  const { user } = useAuth();
  const safeDashboardPath = user ? getRoleDestination(user.role) : '/login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between items-center p-4">
      <main className="my-auto max-w-md w-full rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xl space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-rose-800">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Access Denied</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your account does not have permission to access the requested resource or role workspace.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={safeDashboardPath}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Authorized Dashboard
          </Link>
        </div>
      </main>

      <footer className="py-4 text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} AutoServe Platform Security Enforcer.
      </footer>
    </div>
  );
};
