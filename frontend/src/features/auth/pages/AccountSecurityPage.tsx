import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountSecurityApi } from '../api/accountSecurityApi';
import { useAuth } from '../context/AuthContext';

export const AccountSecurityPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await accountSecurityApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess(res.message);
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change password. Please verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">AutoServe Security</span>
          <h2 className="mt-2 text-xl font-extrabold text-slate-800">Account Password Control</h2>
          <p className="mt-1 text-xs text-slate-500">Signed in as <span className="font-semibold">{user?.email}</span> ({user?.role})</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Update Password & Re-authenticate'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
