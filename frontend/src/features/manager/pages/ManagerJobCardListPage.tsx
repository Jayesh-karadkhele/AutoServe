import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerJobCards } from '../hooks/useManagerData';
import { Search, Filter, Wrench, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

export const ManagerJobCardListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const { jobCards, isLoading, error, refresh } = useManagerJobCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const filteredJobCards = jobCards.filter((jc) => {
    if (statusFilter !== 'ALL' && jc.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(jc.id).includes(q);
      const matchVehicle = jc.vehicleMakeModel?.toLowerCase().includes(q) || jc.vehicleRegistration?.toLowerCase().includes(q) || false;
      const matchCustomer = jc.customerName?.toLowerCase().includes(q) || false;
      const matchMechanic = jc.mechanicName?.toLowerCase().includes(q) || false;
      return matchId || matchVehicle || matchCustomer || matchMechanic;
    }

    return true;
  });

  return (
    <ManagerShell
      pageTitle="Manager Job-Card Workspace"
      breadcrumbs={[{ label: 'Job Cards' }]}
    >
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search JC#, vehicle, customer, mechanic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSearchParams(e.target.value !== 'ALL' ? { status: e.target.value } : {});
              }}
              className="px-3 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-bold text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            >
              <option value="ALL">All Job Statuses</option>
              <option value="CREATED">Created</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="p-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#334155] min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Refresh job cards"
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

      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading manager job cards...
        </div>
      ) : filteredJobCards.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Wrench className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Job Cards Found</h3>
          <p className="text-xs text-[#6B7280]">No job cards match your filter or manager assignment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F8FAFC] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">JC Ref</th>
                  <th className="px-4 py-3.5">Appt Ref</th>
                  <th className="px-4 py-3.5">Vehicle</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Assigned Mechanic</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredJobCards.map((jc) => (
                  <tr key={jc.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#0284C7]">JC#{jc.id}</td>
                    <td className="px-4 py-4 font-mono font-medium text-[#4B5563]">#{jc.appointmentId}</td>
                    <td className="px-4 py-4 font-semibold text-[#111827]">
                      {jc.vehicleMakeModel || jc.vehicleRegistration || 'Vehicle'}
                    </td>
                    <td className="px-4 py-4 text-[#111827]">{jc.customerName || 'N/A'}</td>
                    <td className="px-4 py-4 font-medium text-[#0284C7]">{jc.mechanicName || 'Unassigned'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          jc.status === 'IN_PROGRESS'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : jc.status === 'COMPLETED'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : jc.status === 'CANCELLED'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {jc.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        to={`/manager/job-cards/${jc.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-xl text-xs transition-colors min-h-[44px]"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ManagerShell>
  );
};
