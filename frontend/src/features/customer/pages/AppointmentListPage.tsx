import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerAppointments } from '../hooks/useCustomerAppointments';
import {
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Wrench,
} from 'lucide-react';

export const AppointmentListPage: React.FC = () => {
  const { appointments, isLoading, error, refetch } = useCustomerAppointments();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'UPCOMING') return a.status === 'PENDING' || a.status === 'APPROVED';
    if (filterStatus === 'ACTIVE') return a.status === 'IN_PROGRESS';
    if (filterStatus === 'COMPLETED') return a.status === 'COMPLETED';
    if (filterStatus === 'CANCELLED') return a.status === 'CANCELLED' || a.status === 'REJECTED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'PENDING':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'IN_PROGRESS':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
      case 'COMPLETED':
        return 'bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    }
  };

  return (
    <CustomerShell
      pageTitle="Appointments"
      breadcrumbs={[{ label: 'Appointments' }]}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Upcoming', value: 'UPCOMING' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                filterStatus === tab.value
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          to="/customer/appointments/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-sm text-sm transition-colors min-h-[44px]"
        >
          <Plus className="w-5 h-5" /> Book New Appointment
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse" data-testid="appointment-loading-skeleton">
          <div className="h-24 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-24 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-24 bg-[#E5E7EB] rounded-2xl" />
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B91C1C]">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 bg-[#DC2626] text-white rounded-xl font-semibold text-sm hover:bg-[#B91C1C] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#E0F2FE] text-[#0284C7] rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">No Appointments Found</h2>
          <p className="text-sm text-[#6B7280]">
            There are no appointments matching the selected filter.
          </p>
          <Link
            to="/customer/appointments/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl text-sm min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Book Appointment Now
          </Link>
        </div>
      )}

      {!isLoading && !error && filteredAppointments.length > 0 && (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#6B7280]">#{appt.id}</span>
                  <span
                    className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${getStatusBadge(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                  {appt.vehicleRegistration && (
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F1F5F9] text-[#334155] rounded-md">
                      {appt.vehicleRegistration}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#111827]">{appt.serviceType}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0284C7]" /> Date: {appt.preferredDate} ({appt.timeSlot || 'Standard Slot'})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
                {appt.jobCardId && (
                  <Link
                    to={`/customer/service/${appt.jobCardId}`}
                    className="px-3.5 py-2 bg-[#ECFDF5] text-[#059669] font-bold text-xs rounded-xl hover:bg-[#D1FAE5] transition-colors flex items-center gap-1.5 min-h-[38px]"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Service Record
                  </Link>
                )}

                <Link
                  to={`/customer/appointments/${appt.id}`}
                  className="px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold text-xs rounded-xl transition-colors flex items-center gap-1 min-h-[38px]"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerShell>
  );
};
