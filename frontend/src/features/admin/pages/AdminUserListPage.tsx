import React, { useState } from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminUsers } from '../hooks/useAdminData';
import type { Role, UserSummary } from '../types/adminTypes';
import { adminApi } from '../api/adminApi';
import { CreateStaffModal } from '../components/CreateStaffModal';

export const AdminUserListPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [search, setSearch] = useState('');
  const { users, loading, error, refresh } = useAdminUsers(selectedRole, undefined, search);
  const { users: managers } = useAdminUsers('MANAGER');
  const [createStaffOpen, setCreateStaffOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleToggleActive = async (user: UserSummary) => {
    const reason = window.prompt(`Reason for ${user.active ? 'deactivating' : 'activating'} ${user.fullName}:`);
    if (!reason) return;

    try {
      setActionLoading(user.id);
      await adminApi.toggleUserActiveStatus(user.id, reason);
      refresh();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminShell title="User Directory & Governance">
      <div className="space-y-6">
        {/* Controls & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs w-full sm:w-64 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <select
              value={selectedRole || ''}
              onChange={(e) => setSelectedRole(e.target.value ? (e.target.value as Role) : undefined)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="MANAGER">Managers</option>
              <option value="MECHANIC">Mechanics</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          <button
            onClick={() => setCreateStaffOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <span>➕</span> Create Staff Account
          </button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading directory...</div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-xs">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No users matching search criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Full Name & Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Assigned Manager</th>
                    <th className="px-4 py-3">Account Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{user.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{user.fullName}</div>
                        <div className="text-slate-400 text-[11px]">{user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.mobile || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.role === 'ADMIN'
                              ? 'bg-violet-100 text-violet-800'
                              : user.role === 'MANAGER'
                              ? 'bg-cyan-100 text-cyan-800'
                              : user.role === 'MECHANIC'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.managerName || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={actionLoading === user.id}
                          className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                            user.active
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {actionLoading === user.id
                            ? 'Processing...'
                            : user.active
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateStaffModal
        isOpen={createStaffOpen}
        onClose={() => setCreateStaffOpen(false)}
        onSuccess={() => refresh()}
        managers={managers}
      />
    </AdminShell>
  );
};
