import React from 'react';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerActivity } from '../hooks/useManagerData';
import { Activity, CalendarCheck, Wrench, Receipt, RefreshCw, AlertCircle } from 'lucide-react';

export const ManagerActivityPage: React.FC = () => {
  const { activities, isLoading, error, refresh } = useManagerActivity();

  return (
    <ManagerShell
      pageTitle="Manager Activity Log"
      breadcrumbs={[{ label: 'Workshop Activity' }]}
    >
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0C4A6E]">Recent Workshop Operational Events</h2>
          <p className="text-xs text-[#0284C7] mt-0.5">
            Audit log of operations performed across your assigned appointments, job cards, and generated invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC] font-bold rounded-xl text-xs transition-colors min-h-[44px] flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Activity</span>
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
          Loading activity event timeline...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Activity className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Recent Activity Recorded</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <div className="space-y-4">
            {activities.map((item) => {
              const Icon =
                item.category === 'APPOINTMENT'
                  ? CalendarCheck
                  : item.category === 'JOB_CARD'
                  ? Wrench
                  : Receipt;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#BAE6FD] transition-colors flex items-start gap-4 text-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[#111827] text-sm">{item.title}</h4>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        {new Date(item.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[#4B5563]">{item.description}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] font-bold text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ManagerShell>
  );
};
