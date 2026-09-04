import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerVehicles } from '../hooks/useCustomerVehicles';
import { Car, Plus, ChevronRight, AlertCircle, RefreshCw, Calendar, Fuel } from 'lucide-react';

export const VehicleListPage: React.FC = () => {
  const { vehicles, isLoading, error, refetch } = useCustomerVehicles();

  return (
    <CustomerShell
      pageTitle="My Vehicles"
      breadcrumbs={[{ label: 'My Vehicles' }]}
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[#6B7280]">
          Manage registered vehicles associated with your AutoServe account.
        </p>
        <Link
          to="/customer/vehicles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl shadow-sm text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse" data-testid="vehicle-loading-skeleton">
          <div className="h-48 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-48 bg-[#E5E7EB] rounded-2xl" />
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

      {!isLoading && !error && vehicles.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FFF7ED] text-[#EA580C] rounded-full flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">No Registered Vehicles</h2>
          <p className="text-sm text-[#6B7280]">
            You have not registered any vehicles yet. Add a vehicle to book service appointments and track maintenance history.
          </p>
          <Link
            to="/customer/vehicles/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px]"
          >
            <Plus className="w-5 h-5" /> Add First Vehicle
          </Link>
        </div>
      )}

      {!isLoading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] font-mono">
                    {v.registrationNumber}
                  </span>
                  {v.vehicleType && (
                    <span className="text-xs font-semibold text-[#6B7280]">{v.vehicleType}</span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-[#111827] mt-3">
                  {v.make} {v.model}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-[#4B5563]">
                  {v.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Model Year: {v.year}</span>
                    </div>
                  )}
                  {v.fuelType && (
                    <div className="flex items-center gap-2">
                      <Fuel className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>Fuel Type: {v.fuelType}</span>
                    </div>
                  )}
                  {v.color && <div>Color: {v.color}</div>}
                  {v.vin && <div className="font-mono text-[11px] text-[#9CA3AF]">VIN: {v.vin}</div>}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <Link
                  to={`/customer/appointments/new?vehicleId=${v.id}`}
                  className="text-xs font-bold text-[#0284C7] hover:underline"
                >
                  Book Service
                </Link>
                <Link
                  to={`/customer/vehicles/${v.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerShell>
  );
};
