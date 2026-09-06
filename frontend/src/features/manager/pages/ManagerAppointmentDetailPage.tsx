import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerTeam } from '../hooks/useManagerData';
import { MechanicAssignmentDrawer } from '../components/MechanicAssignmentDrawer';
import { RejectionReasonModal } from '../components/RejectionReasonModal';
import {
  approveAppointment,
  rejectAppointment,
  assignMechanicToAppointment,
  createJobCard,
} from '../api/managerApi';
import { apiClient } from '@/lib/api/apiClient';
import type { Appointment } from '../../customer/types/customerTypes';
import {
  User,
  Car,
  MapPin,
  CheckCircle2,
  XCircle,
  UserPlus,
  Wrench,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const ManagerAppointmentDetailPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const id = parseInt(appointmentId || '0', 10);

  const { team } = useManagerTeam();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Appointment>(`/api/appointments/${id}`);
      setAppointment(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load appointment details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const updated = await approveAppointment(id);
      setAppointment(updated);
      setActionSuccess('Appointment approved successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to approve appointment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const updated = await rejectAppointment(id, reason);
      setAppointment(updated);
      setActionSuccess('Appointment rejected with specified reason.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reject appointment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignMechanicConfirm = async (mechanicId: number) => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const updated = await assignMechanicToAppointment(id, mechanicId);
      setAppointment(updated);
      setActionSuccess('Mechanic assigned to appointment successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign mechanic.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateJobCard = async () => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const jc = await createJobCard(id, appointment?.mechanicId || undefined);
      setActionSuccess(`Job card JC#${jc.id} created successfully.`);
      fetchDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create job card.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ManagerShell
      pageTitle={`Appointment #${id}`}
      breadcrumbs={[
        { label: 'Appointments', href: '/manager/appointments' },
        { label: `Appointment #${id}` },
      ]}
    >
      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div role="alert" className="p-4 bg-[#ECFDF5] border border-[#6EE7B7] rounded-xl text-sm text-[#047857] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading appointment details...
        </div>
      ) : !appointment ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <h3 className="text-base font-bold text-[#111827]">Appointment Not Found</h3>
          <p className="text-xs text-[#6B7280]">The requested appointment does not exist or you lack authorization.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status & Decision Action Header */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-[#111827]">Appointment Reference #{appointment.id}</h2>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    appointment.status === 'PENDING'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : appointment.status === 'APPROVED'
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : appointment.status === 'REJECTED'
                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                      : 'bg-[#E0F2FE] text-[#0284C7]'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Requested Date: <strong className="text-[#111827]">{appointment.preferredDate}</strong> ({appointment.timeSlot || 'Standard Slot'})
              </p>
            </div>

            {/* Manager Operational Decision Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {appointment.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApprove}
                    className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve Appointment
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Appointment
                  </button>
                </>
              )}

              {appointment.status === 'APPROVED' && (
                <>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setIsAssignDrawerOpen(true)}
                    className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    {appointment.mechanicId ? 'Reassign Mechanic' : 'Assign Mechanic'}
                  </button>

                  {!appointment.jobCardId && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCreateJobCard}
                      className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" /> Create Job Card
                    </button>
                  )}
                </>
              )}

              {appointment.jobCardId && (
                <Link
                  to={`/manager/job-cards/${appointment.jobCardId}`}
                  className="px-5 py-2.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-xl text-xs transition-colors border border-[#7DD3FC] min-h-[44px] flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" /> View Job Card JC#{appointment.jobCardId}
                </Link>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer & Vehicle Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <User className="w-4 h-4 text-[#0284C7]" /> Customer & Contact Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Customer Name:</span>
                  <span className="font-bold text-[#111827]">{appointment.customerName || `ID #${appointment.customerId}`}</span>
                </div>
                {appointment.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Phone Number:</span>
                    <span className="font-medium text-[#111827]">{appointment.customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#F3F4F6] pt-2">
                  <span className="text-[#6B7280]">Assigned Mechanic:</span>
                  <span className="font-bold text-[#0284C7]">
                    {appointment.mechanicId ? `Mechanic #${appointment.mechanicId}` : 'Not Yet Assigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle & Concern Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <Car className="w-4 h-4 text-[#0284C7]" /> Vehicle & Requested Service
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Registration Number:</span>
                  <span className="font-mono font-bold text-[#0284C7]">{appointment.vehicleRegistration || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Make & Model:</span>
                  <span className="font-bold text-[#111827]">{appointment.vehicleMakeModel || `Vehicle #${appointment.vehicleId}`}</span>
                </div>
                <div className="flex justify-between border-t border-[#F3F4F6] pt-2">
                  <span className="text-[#6B7280]">Service Type:</span>
                  <span className="font-extrabold text-[#EA580C]">{appointment.serviceType}</span>
                </div>
                {appointment.notes && (
                  <div className="pt-2 border-t border-[#F3F4F6]">
                    <span className="text-[#6B7280] block mb-1">Customer Notes:</span>
                    <p className="p-2 bg-[#F8FAFC] rounded-lg text-[#374151] italic">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Fulfilment & Logistics */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <MapPin className="w-4 h-4 text-[#0284C7]" /> Service Fulfilment Logistics
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#6B7280] block mb-1">Fulfilment Mode:</span>
                  {appointment.fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' ? (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-xs">
                      Vehicle Pickup & Return Requested
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-medium text-xs">
                      Self Drop-Off at Workshop
                    </span>
                  )}
                </div>

                {appointment.fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && (
                  <>
                    <div className="p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-1">
                      <span className="font-bold text-[#0369A1] block">Pickup Address:</span>
                      <p className="text-[#111827]">{appointment.pickupAddress || 'Address not provided'}</p>
                    </div>

                    {appointment.logisticsInstructions && (
                      <div>
                        <span className="text-[#6B7280] block mb-1">Logistics Instructions:</span>
                        <p className="p-2 bg-[#F8FAFC] rounded-lg text-[#374151]">{appointment.logisticsInstructions}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer & Modal Dialogs */}
      <MechanicAssignmentDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        mechanics={team}
        onAssign={handleAssignMechanicConfirm}
        currentMechanicId={appointment?.mechanicId}
      />

      <RejectionReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        appointmentId={id}
      />
    </ManagerShell>
  );
};
