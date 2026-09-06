import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MechanicShell } from '../components/MechanicShell';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Shield, LogOut, CheckCircle2 } from 'lucide-react';

export const MechanicProfilePage: React.FC = () => {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    await logoutAll();
    navigate('/login');
  };

  return (
    <MechanicShell
      pageTitle="Mechanic Profile & Session Management"
      breadcrumbs={[{ label: 'Profile' }]}
    >
      <div className="max-w-2xl space-y-6">
        {/* Account Details Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#06B6D4] text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#111827]">{user?.name}</h2>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-xs border border-[#BAE6FD]">
                Role: MECHANIC WORKBENCH
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#6B7280] font-semibold">Registered Email</p>
              <p className="font-bold text-[#111827] mt-0.5">{user?.email}</p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#6B7280] font-semibold">User Role Boundary</p>
              <p className="font-bold text-[#111827] mt-0.5">MECHANIC (Assigned Jobs Only)</p>
            </div>
          </div>

          <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl text-xs text-[#0369A1] space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
              <span>RBAC Security Boundary Active</span>
            </div>
            <p className="text-[#475569]">
              Your account is strictly scoped to assigned job cards, vehicles, parts usage, and repair evidence uploads.
            </p>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Shield className="w-5 h-5 text-[#0284C7]" />
            <span>Session Management</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold transition-colors min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Current Session</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-sm transition-colors min-h-[44px]"
            >
              <Shield className="w-4 h-4" />
              <span>Log Out All Sessions</span>
            </button>
          </div>
        </div>
      </div>
    </MechanicShell>
  );
};
