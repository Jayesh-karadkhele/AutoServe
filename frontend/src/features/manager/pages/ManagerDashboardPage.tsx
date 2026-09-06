import React from 'react';
import { Link } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerOverview } from '../hooks/useManagerData';
import {
  CalendarCheck,
  Clock,
  UserCheck,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Users,
  Boxes,
  FileCheck,
  Receipt,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  const { data, isLoading, error, refresh } = useManagerOverview();

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ManagerShell
      pageTitle="Manager Control Tower"
      primaryAction={{
        label: 'Review Appointments',
        href: '/manager/appointments',
      }}
    >
      {/* Header Info & Refresh */}
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0284C7] text-white">
              OPERATIONAL REAL-TIME
            </span>
            <span className="text-xs text-[#0369A1] font-medium">{currentDateStr}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0C4A6E] mt-1">
            Workshop Operations Center
          </h2>
          <p className="text-xs text-[#0284C7] mt-0.5">
            Real persisted backend data for assigned appointments, mechanic workload, job cards, and invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-white hover:bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC] font-bold rounded-xl text-xs transition-colors min-h-[44px] flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Real Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Today's Appointments",
            value: data?.assignedAppointmentsToday ?? 0,
            icon: CalendarCheck,
            color: 'text-[#0284C7]',
            bg: 'bg-[#F0F9FF]',
            link: '/manager/appointments',
          },
          {
            title: 'Awaiting Decision',
            value: data?.awaitingDecisionCount ?? 0,
            icon: Clock,
            color: 'text-[#D97706]',
            bg: 'bg-[#FEF3C7]',
            link: '/manager/appointments?status=PENDING',
          },
          {
            title: 'Unassigned Approved',
            value: data?.approvedAwaitingMechanicCount ?? 0,
            icon: UserCheck,
            color: 'text-[#EA580C]',
            bg: 'bg-[#FFF7ED]',
            link: '/manager/appointments?status=APPROVED',
          },
          {
            title: 'Jobs In Progress',
            value: data?.jobsInProgressCount ?? 0,
            icon: Wrench,
            color: 'text-[#0284C7]',
            bg: 'bg-[#F0F9FF]',
            link: '/manager/job-cards?status=IN_PROGRESS',
          },
          {
            title: 'Jobs Awaiting Attention',
            value: data?.jobsAwaitingAttentionCount ?? 0,
            icon: AlertCircle,
            color: 'text-[#DC2626]',
            bg: 'bg-[#FEF2F2]',
            link: '/manager/job-cards',
          },
          {
            title: 'Jobs Completed Today',
            value: data?.jobsCompletedTodayCount ?? 0,
            icon: CheckCircle2,
            color: 'text-[#059669]',
            bg: 'bg-[#ECFDF5]',
            link: '/manager/job-cards?status=COMPLETED',
          },
          {
            title: 'Active Mechanics',
            value: data?.activeMechanicsCount ?? 0,
            icon: Users,
            color: 'text-[#0284C7]',
            bg: 'bg-[#F0F9FF]',
            link: '/manager/team',
          },
          {
            title: 'Low-Stock Parts',
            value: data?.lowStockItemsCount ?? 0,
            icon: Boxes,
            color: 'text-[#D97706]',
            bg: 'bg-[#FEF3C7]',
            link: '/manager/inventory?lowStock=true',
          },
          {
            title: 'Invoice Ready Jobs',
            value: data?.invoiceReadyJobsCount ?? 0,
            icon: FileCheck,
            color: 'text-[#059669]',
            bg: 'bg-[#ECFDF5]',
            link: '/manager/job-cards?status=COMPLETED',
          },
          {
            title: 'Outstanding Invoices',
            value: data?.outstandingInvoiceCount ?? 0,
            icon: Receipt,
            color: 'text-[#DC2626]',
            bg: 'bg-[#FEF2F2]',
            link: '/manager/invoices?status=PENDING',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.link}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 hover:border-[#0284C7] hover:shadow-md transition-all flex flex-col justify-between group min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B7280] line-clamp-1">{item.title}</span>
                <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-[#111827] font-mono">
                  {isLoading ? '...' : item.value}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#0284C7] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointment Queue Preview */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#0284C7]" /> Today's Appointment Queue
            </h3>
            <Link
              to="/manager/appointments"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 min-h-[44px]"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#6B7280] animate-pulse">Loading appointments...</div>
          ) : !data?.recentAppointments || data.recentAppointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl">
              No appointments assigned today.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#BAE6FD] bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0284C7]">#{appt.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          appt.status === 'PENDING'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : appt.status === 'APPROVED'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {appt.status}
                      </span>
                      {appt.fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-[10px]">
                          Pickup Requested
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-[#111827]">{appt.serviceType}</p>
                    <p className="text-[#6B7280]">
                      Vehicle #{appt.vehicleId} • Date: {appt.preferredDate}
                    </p>
                  </div>

                  <Link
                    to={`/manager/appointments/${appt.id}`}
                    className="px-3 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-lg text-xs transition-colors shrink-0 min-h-[44px] flex items-center"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Job-Card Board Preview */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#0284C7]" /> Active Job Card Board
            </h3>
            <Link
              to="/manager/job-cards"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 min-h-[44px]"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#6B7280] animate-pulse">Loading job cards...</div>
          ) : !data?.activeJobCards || data.activeJobCards.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl">
              No active job cards currently in progress.
            </div>
          ) : (
            <div className="space-y-3">
              {data.activeJobCards.map((jc) => (
                <div
                  key={jc.id}
                  className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#BAE6FD] bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0284C7]">JC#{jc.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          jc.status === 'IN_PROGRESS'
                            ? 'bg-[#F0F9FF] text-[#0284C7]'
                            : jc.status === 'COMPLETED'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {jc.status}
                      </span>
                    </div>
                    <p className="font-bold text-[#111827]">{jc.vehicleMakeModel || `Job Card #${jc.id}`}</p>
                    <p className="text-[#6B7280]">
                      Mechanic: {jc.mechanicName || 'Unassigned'} • Customer: {jc.customerName || 'N/A'}
                    </p>
                  </div>

                  <Link
                    to={`/manager/job-cards/${jc.id}`}
                    className="px-3 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-lg text-xs transition-colors shrink-0 min-h-[44px] flex items-center"
                  >
                    View Job
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ManagerShell>
  );
};
