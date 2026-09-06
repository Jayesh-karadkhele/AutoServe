import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminShell } from '../components/AdminShell';
import { adminApi } from '../api/adminApi';
import type { UserSummary } from '../types/adminTypes';

export const AdminUserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      adminApi
        .getUserDetails(Number(userId))
        .then(setUser)
        .catch((err) => setError(err?.response?.data?.message || 'User not found'))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  return (
    <AdminShell title={`User Account Detail #${userId}`}>
      <div className="space-y-6 max-w-3xl">
        <Link to="/admin/users" className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1">
          ← Back to User Directory
        </Link>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading user details...</div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-2xl">{error}</div>
        ) : user ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.fullName}</h2>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  user.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {user.active ? 'Active Account' : 'Inactive Account'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">User ID</span>
                <span className="font-mono text-slate-900">#{user.id}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Mobile Number</span>
                <span className="text-slate-900">{user.mobile || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Role Assignment</span>
                <span className="font-bold text-violet-800 uppercase">{user.role}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Assigned Workshop Manager</span>
                <span className="text-slate-900">{user.managerName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Registration Timestamp</span>
                <span className="font-mono text-slate-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
};
