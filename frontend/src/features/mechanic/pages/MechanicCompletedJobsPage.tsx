import React from 'react';
import { Link } from 'react-router-dom';
import { MechanicShell } from '../components/MechanicShell';
import { useMechanicJobs } from '../hooks/useMechanicData';
import { CheckCircle2, Star, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export const MechanicCompletedJobsPage: React.FC = () => {
  const { jobs, isLoading, error, refresh } = useMechanicJobs();

  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');

  return (
    <MechanicShell
      pageTitle="My Completed Work History"
      breadcrumbs={[{ label: 'Completed History' }]}
    >
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Completed Job Cards</h2>
            <p className="text-xs text-[#6B7280]">
              Historical record of work completed and submitted under your mechanic assignment.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="p-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#334155] min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#6B7280] animate-pulse">
            Loading completed job history...
          </div>
        ) : completedJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#9CA3AF] mx-auto" />
            <h3 className="text-base font-bold text-[#111827]">No Completed Jobs Recorded</h3>
            <p className="text-xs text-[#6B7280]">
              You have not completed any job cards yet. Active jobs move here once submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#0284C7]">#{job.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#ECFDF5] text-[#059669]">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-sm font-black text-[#111827]">
                    {job.brand} {job.model} ({job.licensePlate})
                  </p>
                  <p className="text-xs text-[#475569]">Customer: {job.customerName}</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Completed at: {job.completionTime ? new Date(job.completionTime).toLocaleString() : 'Recently'}
                  </p>

                  {job.customerRating && (
                    <div className="flex items-center gap-1.5 pt-1 text-xs font-bold text-[#D97706]">
                      <Star className="w-4 h-4 fill-[#D97706]" />
                      <span>{job.customerRating} / 5 Stars</span>
                      {job.customerFeedback && (
                        <span className="text-[#4B5563] font-normal italic">
                          — "{job.customerFeedback}"
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase">Total Billed</p>
                    <p className="text-base font-black text-[#111827]">
                      ₹{(job.totalAmount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-[#6B7280]">
                      {job.items.length} parts · {job.evidence.length} photos
                    </p>
                  </div>

                  <Link
                    to={`/mechanic/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-white hover:bg-[#E0F2FE] border border-[#CBD5E1] text-[#0284C7] font-bold rounded-xl text-xs transition-colors min-h-[44px]"
                  >
                    <span>View Record</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MechanicShell>
  );
};
