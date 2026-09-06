import React from 'react';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerTeam } from '../hooks/useManagerData';
import { Users, Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react';

export const ManagerTeamPage: React.FC = () => {
  const { team, isLoading, error, refresh } = useManagerTeam();

  return (
    <ManagerShell
      pageTitle="Manager Team Workspace"
      breadcrumbs={[{ label: 'Team Workspace' }]}
    >
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0C4A6E]">Assigned Workshop Technicians</h2>
          <p className="text-xs text-[#0284C7] mt-0.5">
            View active workloads and assignments for mechanics reporting to your manager scope.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC] font-bold rounded-xl text-xs transition-colors min-h-[44px] flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Roster</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading team roster...
        </div>
      ) : team.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Users className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Mechanics Assigned</h3>
          <p className="text-xs text-[#6B7280]">
            No active technicians are currently reporting to your manager profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div
              key={m.mechanicId}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs hover:border-[#0284C7] transition-all"
            >
              <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-3">
                <div>
                  <h3 className="font-extrabold text-[#111827] text-base">{m.mechanicName}</h3>
                  <span className="text-xs font-mono font-bold text-[#0284C7]">ID #{m.mechanicId}</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    m.isActive ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
                  }`}
                >
                  {m.isActive ? 'Active Staff' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9CA3AF]" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  <span>{m.mobile}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">ACTIVE JOBS</span>
                  <span className="font-mono font-bold text-[#0284C7] text-base">{m.activeJobCount}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">COMPLETED</span>
                  <span className="font-mono font-bold text-[#059669] text-base">{m.completedJobCount}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">STATUS</span>
                  <span className="font-bold text-[#111827] text-[11px]">{m.availabilityStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ManagerShell>
  );
};
