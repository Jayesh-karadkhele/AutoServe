import React from 'react';
import { Link } from 'react-router-dom';
import { MechanicShell } from '../components/MechanicShell';
import { useMechanicOverview } from '../hooks/useMechanicData';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Car,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

export const MechanicDashboardPage: React.FC = () => {
  const { overview, isLoading, error, refresh } = useMechanicOverview();

  const activeJob = overview?.activeJobCard;
  const awaitingJobs = overview?.recentAssignedJobs.filter((j) => j.status === 'CREATED') || [];

  return (
    <MechanicShell pageTitle="Digital Workbench Today" activeJobId={activeJob?.id}>
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Active Job</p>
            <p className="text-xl font-black text-[#111827]">
              {activeJob ? `#${activeJob.id}` : 'None'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Awaiting Start</p>
            <p className="text-xl font-black text-[#111827]">
              {overview?.jobsAwaitingStartCount || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Total Assigned</p>
            <p className="text-xl font-black text-[#111827]">
              {overview?.assignedJobsCount || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Completed Today</p>
            <p className="text-xl font-black text-[#111827]">
              {overview?.jobsCompletedTodayCount || 0}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-1.5 bg-white border border-[#FCA5A5] rounded-lg text-xs font-bold hover:bg-[#FEE2E2]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Focus Card: Current Active Job Card */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] bg-white rounded-3xl border border-[#E5E7EB] animate-pulse">
          Loading mechanic workbench status...
        </div>
      ) : activeJob ? (
        <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-xs font-mono font-black text-xs rounded-full">
                  IN PROGRESS WORKBENCH
                </span>
                <span className="text-xs font-semibold text-white/80">Ref #{activeJob.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-2">
                {activeJob.brand} {activeJob.model} ({activeJob.licensePlate})
              </h2>
            </div>
            <Link
              to={`/mechanic/jobs/${activeJob.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0284C7] font-extrabold text-sm rounded-2xl shadow-lg hover:bg-[#F0F9FF] transition-transform active:scale-95 min-h-[44px]"
            >
              <span>Continue Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
              <p className="text-white/70 font-semibold">Customer Concern</p>
              <p className="font-bold text-white mt-1 line-clamp-2">{activeJob.problemDescription}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
              <p className="text-white/70 font-semibold">Vehicle Owner</p>
              <p className="font-bold text-white mt-1">{activeJob.customerName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
              <p className="text-white/70 font-semibold">Parts & Evidence</p>
              <p className="font-bold text-white mt-1">
                {activeJob.items.length} parts added · {activeJob.evidence.length} photos uploaded
              </p>
            </div>
          </div>
        </div>
      ) : awaitingJobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-[#BAE6FD] bg-[#F0F9FF] p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-[#FEF3C7] text-[#92400E] text-xs font-extrabold rounded-full">
                READY TO START
              </span>
              <h2 className="text-lg font-black text-[#111827] mt-2">
                Job #{awaitingJobs[0].id} — {awaitingJobs[0].brand} {awaitingJobs[0].model}
              </h2>
              <p className="text-xs text-[#475569] mt-1">{awaitingJobs[0].problemDescription}</p>
            </div>
            <Link
              to={`/mechanic/jobs/${awaitingJobs[0].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-sm rounded-2xl shadow-md transition-colors min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Next Job</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center space-y-3">
          <Wrench className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Active Job In Progress</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            You currently have no active or pending assigned jobs. Check back when your manager assigns a new work order.
          </p>
        </div>
      )}

      {/* Quick Queue Lists: Assigned & Completed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Jobs Queue */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#0284C7]" />
              <span>Assigned Jobs Queue</span>
            </h3>
            <Link to="/mechanic/jobs" className="text-xs font-bold text-[#0284C7] hover:underline">
              View All
            </Link>
          </div>

          {overview?.recentAssignedJobs.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-4 text-center">No assigned jobs in queue.</p>
          ) : (
            <div className="space-y-3">
              {overview?.recentAssignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#BAE6FD] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0284C7]">#{job.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          job.status === 'IN_PROGRESS'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#111827] mt-1">
                      {job.brand} {job.model} ({job.licensePlate})
                    </p>
                    <p className="text-[11px] text-[#6B7280] line-clamp-1">{job.problemDescription}</p>
                  </div>
                  <Link
                    to={`/mechanic/jobs/${job.id}`}
                    className="p-2.5 text-[#0284C7] hover:bg-[#E0F2FE] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Open Workbench"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Completed Jobs */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              <span>Recently Completed</span>
            </h3>
            <Link to="/mechanic/completed" className="text-xs font-bold text-[#0284C7] hover:underline">
              View History
            </Link>
          </div>

          {overview?.recentCompletedJobs.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-4 text-center">No completed jobs yet today.</p>
          ) : (
            <div className="space-y-3">
              {overview?.recentCompletedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#475569]">#{job.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#ECFDF5] text-[#059669]">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#111827] mt-1">
                      {job.brand} {job.model} ({job.licensePlate})
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      Completed {job.completionTime ? new Date(job.completionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                    </p>
                  </div>
                  <Link
                    to={`/mechanic/jobs/${job.id}`}
                    className="p-2.5 text-[#4B5563] hover:bg-[#E5E7EB] rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="View Job Record"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MechanicShell>
  );
};
