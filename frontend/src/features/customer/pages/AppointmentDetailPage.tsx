import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { getAppointmentById, cancelAppointment } from '../api/customerApi';
import type { Appointment } from '../types/customerTypes';
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  ShieldAlert,
  Loader2,
  XCircle,
} from 'lucide-react';

export const AppointmentDetailPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const numericId = appointmentId ? parseInt(appointmentId, 10) : NaN;

  useEffect(() => {
    if (isNaN(numericId)) {
      setError('Invalid appointment ID format.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getAppointmentById(numericId, controller.signal)
      .then((data) => setAppointment(data))
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError('Appointment not found or you do not have permission to view it.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load appointment details.');
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [numericId]);

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelAppointment(appointment.id);
      setAppointment({ ...appointment, status: 'CANCELLED' });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel appointment.';
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <CustomerShell
      pageTitle={appointment ? `Appointment #${appointment.id}` : 'Appointment Details'}
      breadcrumbs={[
        { label: 'Appointments', href: '/customer/appointments' },
        { label: appointment ? `#${appointment.id}` : 'Details' },
      ]}
    >
      {isLoading && (
        <div className="space-y-6 animate-pulse" data-testid="appointment-detail-skeleton">
          <div className="h-40 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-60 bg-[#E5E7EB] rounded-2xl" />
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-8 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-[#DC2626] mx-auto" />
          <h2 className="text-xl font-bold text-[#111827]">Access Restricted</h2>
          <p className="text-sm text-[#4B5563]">{error}</p>
          <Link
            to="/customer/appointments"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm min-h-[44px]"
          >
            Return to Appointments
          </Link>
        </div>
      )}

      {!isLoading && !error && appointment && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xs font-mono font-bold text-[#6B7280]">
                  Appointment Reference: #{appointment.id}
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827] mt-1">
                  {appointment.serviceType}
                </h2>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                Status: {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E0F2FE] text-[#0284C7] rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] block">Scheduled Date</span>
                    <span className="font-bold text-[#111827]">{appointment.preferredDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F3E8FF] text-[#9333EA] rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] block">Time Slot</span>
                    <span className="font-semibold text-[#111827]">
                      {appointment.timeSlot || 'Standard Slot'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFF7ED] text-[#EA580C] rounded-lg">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] block">Target Vehicle</span>
                    <span className="font-mono font-bold text-[#0284C7]">
                      {appointment.vehicleRegistration || `Vehicle ID #${appointment.vehicleId}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="pt-4 border-t border-[#E5E7EB]">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#6B7280] mb-1">
                  Customer Notes
                </h4>
                <p className="text-sm text-[#374151] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  {appointment.notes}
                </p>
              </div>
            )}

            {cancelError && (
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] font-medium">
                {cancelError}
              </div>
            )}

            <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
              {appointment.jobCardId ? (
                <Link
                  to={`/customer/service/${appointment.jobCardId}`}
                  className="px-5 py-2.5 bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] font-bold text-xs rounded-xl transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  <Wrench className="w-4 h-4" /> Track Active Job Card
                </Link>
              ) : (
                <span className="text-xs text-[#6B7280]">
                  Job card pending manager review & assignment.
                </span>
              )}

              {appointment.status === 'PENDING' && (
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={handleCancelAppointment}
                  className="px-4 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px]"
                >
                  {isCancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Cancel Appointment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
};
