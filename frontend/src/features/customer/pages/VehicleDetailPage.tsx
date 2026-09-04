import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { getVehicleById, deleteVehicle } from '../api/customerApi';
import { useCustomerAppointments } from '../hooks/useCustomerAppointments';
import type { Vehicle } from '../types/customerTypes';
import {
  Calendar,
  Fuel,
  Trash2,
  AlertCircle,
  PlusCircle,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { appointments } = useCustomerAppointments();

  const numericId = vehicleId ? parseInt(vehicleId, 10) : NaN;

  useEffect(() => {
    if (isNaN(numericId)) {
      setError('Invalid vehicle ID format.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getVehicleById(numericId, controller.signal)
      .then((data) => setVehicle(data))
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError('Vehicle not found or you do not have permission to view this vehicle.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load vehicle details.');
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [numericId]);

  const relatedAppointments = (appointments || []).filter((a) => a.vehicleId === numericId);

  const handleDeleteVehicle = async () => {
    if (!vehicle) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteVehicle(vehicle.id);
      navigate('/customer/vehicles');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Cannot delete vehicle. Active service records or appointments exist for this vehicle.';
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomerShell
      pageTitle={vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle Details'}
      breadcrumbs={[
        { label: 'My Vehicles', href: '/customer/vehicles' },
        { label: vehicle ? vehicle.registrationNumber : 'Vehicle Details' },
      ]}
    >
      {isLoading && (
        <div className="space-y-6 animate-pulse" data-testid="vehicle-detail-skeleton">
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
            to="/customer/vehicles"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors min-h-[44px]"
          >
            Return to My Vehicles
          </Link>
        </div>
      )}

      {!isLoading && !error && vehicle && (
        <div className="space-y-8">
          {/* Main Specs Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] font-mono text-sm">
                  {vehicle.registrationNumber}
                </span>
                {vehicle.vehicleType && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563]">
                    {vehicle.vehicleType}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                {vehicle.make} {vehicle.model}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-[#6B7280] pt-2">
                {vehicle.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Year: {vehicle.year}
                  </span>
                )}
                {vehicle.fuelType && (
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" /> Fuel: {vehicle.fuelType}
                  </span>
                )}
                {vehicle.color && <span>Color: {vehicle.color}</span>}
                {vehicle.vin && <span className="font-mono">VIN: {vehicle.vin}</span>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/customer/appointments/new?vehicleId=${vehicle.id}`}
                className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" /> Book Service
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] font-bold rounded-xl text-sm transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" /> Delete Vehicle
              </button>
            </div>
          </div>

          {/* Related Appointments Section */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#EA580C]" /> Associated Service Appointments
            </h3>

            {relatedAppointments.length === 0 ? (
              <div className="text-sm text-[#6B7280] py-4 text-center bg-[#F9FAFB] rounded-xl border border-dashed border-[#D1D5DB]">
                No service appointments recorded for this vehicle yet.
              </div>
            ) : (
              <div className="space-y-3">
                {relatedAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#EA580C] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#111827]">{appt.serviceType}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Date: {appt.preferredDate} ({appt.timeSlot || 'Standard Slot'})
                      </p>
                    </div>

                    <Link
                      to={`/customer/appointments/${appt.id}`}
                      className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
                    >
                      View Appointment <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {isDeleteModalOpen && vehicle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-vehicle-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-[#E5E7EB]">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <div className="p-3 bg-[#FEF2F2] rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 id="delete-vehicle-modal-title" className="text-lg font-bold text-[#111827]">
                Delete Vehicle Confirmation
              </h3>
            </div>

            <p className="text-sm text-[#4B5563] leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-[#111827]">{vehicle.make} {vehicle.model} ({vehicle.registrationNumber})</span> from your registered vehicles? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] font-medium">
                {deleteError}
              </div>
            )}

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteVehicle}
                className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center gap-2 min-h-[44px]"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
};
