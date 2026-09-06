import React from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminUsers } from '../hooks/useAdminData';

export const AdminManagerListPage: React.FC = () => {
  const { users: managers, loading, error } = useAdminUsers('MANAGER');

  return (
    <AdminShell title="Workshop Managers Administration">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Workshop Managers</h2>
            <p className="text-xs text-slate-500 mt-1">Operational capacity, assigned technician count & shop management</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading manager directory...</div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-xs">{error}</div>
          ) : managers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No workshop managers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Manager ID</th>
                    <th className="px-4 py-3">Full Name & Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Account Status</th>
                    <th className="px-4 py-3">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {managers.map((mgr) => (
                    <tr key={mgr.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{mgr.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{mgr.fullName}</div>
                        <div className="text-slate-400 text-[11px]">{mgr.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{mgr.mobile || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            mgr.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${mgr.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {mgr.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {mgr.createdAt ? new Date(mgr.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
};
