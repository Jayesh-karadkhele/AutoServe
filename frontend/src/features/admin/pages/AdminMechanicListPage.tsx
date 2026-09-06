import React from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminUsers } from '../hooks/useAdminData';

export const AdminMechanicListPage: React.FC = () => {
  const { users: mechanics, loading, error } = useAdminUsers('MECHANIC');

  return (
    <AdminShell title="Mechanic Technicians Directory">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Registered Field Technicians</h2>
            <p className="text-xs text-slate-500 mt-1">Assigned manager relationship, active job card status & account control</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading mechanic directory...</div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-xs">{error}</div>
          ) : mechanics.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No mechanic technicians found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Mechanic ID</th>
                    <th className="px-4 py-3">Full Name & Email</th>
                    <th className="px-4 py-3">Assigned Manager</th>
                    <th className="px-4 py-3">Active / Completed Jobs</th>
                    <th className="px-4 py-3">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mechanics.map((tech) => (
                    <tr key={tech.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{tech.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{tech.fullName}</div>
                        <div className="text-slate-400 text-[11px]">{tech.email}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{tech.managerName || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="text-slate-800 font-bold">{tech.assignedJobCount || 0} active</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-500">{tech.completedJobCount || 0} done</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            tech.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${tech.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {tech.active ? 'Active' : 'Inactive'}
                        </span>
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
