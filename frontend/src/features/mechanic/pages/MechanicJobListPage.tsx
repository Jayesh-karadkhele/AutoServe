import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MechanicShell } from '../components/MechanicShell';
import { useMechanicJobs } from '../hooks/useMechanicData';
import { Search, Filter, ClipboardList, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

export const MechanicJobListPage: React.FC = () => {
  const { jobs, isLoading, error, refresh } = useMechanicJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter !== 'ALL' && job.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(job.id).includes(q);
      const matchVehicle = `${job.brand} ${job.model} ${job.licensePlate}`.toLowerCase().includes(q);
      const matchCustomer = job.customerName?.toLowerCase().includes(q) || false;
      const matchProblem = job.problemDescription.toLowerCase().includes(q);
      return matchId || matchVehicle || matchCustomer || matchProblem;
    }

    return true;
  });

  return (
    <MechanicShell
      pageTitle="My Assigned Jobs Queue"
      breadcrumbs={[{ label: 'Assigned Jobs' }]}
    >
      {/* Control Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by ID, vehicle, customer, problem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-bold text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">Awaiting Start (CREATED)</option>
              <option value="IN_PROGRESS">In Progress (IN_PROGRESS)</option>
              <option value="COMPLETED">Completed (COMPLETED)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="p-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#334155] min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jobs List Table / Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading assigned mechanic jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <ClipboardList className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Jobs Found</h3>
          <p className="text-xs text-[#6B7280]">
            No job cards match your search criteria or assigned mechanic scope.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F8FAFC] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">Ref ID</th>
                  <th className="px-4 py-3.5">Vehicle Details</th>
                  <th className="px-4 py-3.5">Reported Concern</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Parts & Evidence</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#0284C7]">#{job.id}</td>
                    <td className="px-4 py-4 font-bold text-[#111827]">
                      {job.brand} {job.model} ({job.licensePlate})
                    </td>
                    <td className="px-4 py-4 font-medium text-[#4B5563] max-w-xs truncate">
                      {job.problemDescription}
                    </td>
                    <td className="px-4 py-4 text-[#111827] font-semibold">{job.customerName}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          job.status === 'IN_PROGRESS'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : job.status === 'CREATED'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#ECFDF5] text-[#059669]'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#6B7280]">
                      {job.items?.length || 0} parts · {job.evidence?.length || 0} photos
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        to={`/mechanic/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-xl text-xs transition-colors min-h-[44px]"
                      >
                        Open Workbench <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MechanicShell>
  );
};
