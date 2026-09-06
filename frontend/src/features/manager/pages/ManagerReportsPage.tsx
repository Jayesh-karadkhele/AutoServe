import React from 'react';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerReports } from '../hooks/useManagerData';
import { BarChart3, AlertCircle, RefreshCw } from 'lucide-react';

export const ManagerReportsPage: React.FC = () => {
  const { report, isLoading, error, refresh } = useManagerReports();

  return (
    <ManagerShell
      pageTitle="Manager Operational Reports"
      breadcrumbs={[{ label: 'Operational Reports' }]}
    >
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0C4A6E]">Team Operational Metrics</h2>
          <p className="text-xs text-[#0284C7] mt-0.5">
            Manager-scoped performance figures derived strictly from persisted database records.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC] font-bold rounded-xl text-xs transition-colors min-h-[44px] flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
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
          Calculating team report aggregates...
        </div>
      ) : !report ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <BarChart3 className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">Report Data Unavailable</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Financial Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#6B7280]">Total Billed Value</span>
              <p className="text-2xl font-black text-[#111827] font-mono">
                {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(report.totalBilledValue || 0)}
              </p>
              <span className="text-[11px] text-[#6B7280]">Total across {report.totalInvoicesCount} invoices</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#059669]">Paid Invoice Value</span>
              <p className="text-2xl font-black text-[#059669] font-mono">
                {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(report.paidInvoiceValue || 0)}
              </p>
              <span className="text-[11px] text-[#059669] font-bold">{report.paidInvoicesCount} verified paid</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#DC2626]">Outstanding Invoice Value</span>
              <p className="text-2xl font-black text-[#DC2626] font-mono">
                {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(report.outstandingInvoiceValue || 0)}
              </p>
              <span className="text-[11px] text-[#DC2626] font-bold">{report.pendingInvoicesCount} pending customer payment</span>
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-base border-b border-[#E5E7EB] pb-3">
                Appointments Status Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(report.appointmentsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl text-xs">
                    <span className="font-bold text-[#111827]">{status}</span>
                    <span className="font-mono font-black text-[#0284C7] text-sm">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-base border-b border-[#E5E7EB] pb-3">
                Job Cards Status Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(report.jobsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl text-xs">
                    <span className="font-bold text-[#111827]">{status}</span>
                    <span className="font-mono font-black text-[#059669] text-sm">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ManagerShell>
  );
};
