import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { useAuth } from '@/features/auth/context/AuthContext';
import { apiClient } from '@/lib/api/apiClient';
import { Shield, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ManagerProfilePage: React.FC = () => {
  const { user, refreshUser, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(user?.name || '');
  const [mobile, setMobile] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await apiClient.put('/api/users/me', {
        userName: userName.trim(),
        mobile: mobile.trim() || undefined,
      });
      await refreshUser();
      setSuccessMsg('Profile information updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async (allSessions: boolean = false) => {
    setIsLoggingOut(true);
    try {
      if (allSessions) {
        await logoutAll();
      } else {
        await logout();
      }
      navigate('/login');
    } catch {
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ManagerShell
      pageTitle="Manager Profile & Session Controls"
      breadcrumbs={[{ label: 'Profile' }]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {successMsg && (
          <div role="alert" className="p-4 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl text-sm text-[#047857] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="w-16 h-16 rounded-full bg-[#0284C7] text-white font-black flex items-center justify-center text-2xl shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#111827]">{user?.name}</h2>
              <p className="text-xs text-[#6B7280]">{user?.email}</p>
              <span className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                Role: {user?.role || 'MANAGER'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="userName" className="block text-xs font-bold text-[#111827] mb-1">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs font-bold text-[#111827] mb-1">
                  Contact Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating || !userName.trim()}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px] flex items-center gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Session Security Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Shield className="w-5 h-5 text-[#0284C7]" /> Active Session Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => handleLogout(false)}
              className="p-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] font-bold text-sm transition-colors text-left flex items-center justify-between min-h-[44px]"
            >
              <span>Sign Out Current Device</span>
              <LogOut className="w-5 h-5" />
            </button>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => handleLogout(true)}
              className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] font-bold text-sm transition-colors text-left flex items-center justify-between min-h-[44px]"
            >
              <span>Sign Out All Active Sessions</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </ManagerShell>
  );
};
