import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { createVehicle } from '../api/customerApi';
import { Car, AlertCircle, Loader2 } from 'lucide-react';

export const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: '',
    fuelType: 'PETROL',
    vehicleType: 'SEDAN',
    color: '',
    vin: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    const cleanReg = formData.registrationNumber.trim();
    if (!cleanReg) {
      errs.registrationNumber = 'Registration number is required.';
    } else if (cleanReg.length < 3) {
      errs.registrationNumber = 'Registration number must be at least 3 characters.';
    }

    if (!formData.make.trim()) {
      errs.make = 'Vehicle make is required (e.g. Toyota, Honda, Hyundai).';
    }

    if (!formData.model.trim()) {
      errs.model = 'Vehicle model is required (e.g. Camry, Civic, i20).';
    }

    if (formData.year) {
      const yearNum = parseInt(formData.year, 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
        errs.year = `Manufacturing year must be a valid year between 1900 and ${new Date().getFullYear() + 1}.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const normalizedRegistration = formData.registrationNumber.trim().toUpperCase();
      await createVehicle({
        registrationNumber: normalizedRegistration,
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: formData.year ? parseInt(formData.year, 10) : undefined,
        fuelType: formData.fuelType,
        vehicleType: formData.vehicleType,
        color: formData.color.trim() || undefined,
        vin: formData.vin.trim() || undefined,
      });

      navigate('/customer/vehicles');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to register vehicle. Registration number may already exist.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerShell
      pageTitle="Register New Vehicle"
      breadcrumbs={[
        { label: 'My Vehicles', href: '/customer/vehicles' },
        { label: 'Add Vehicle' },
      ]}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB] mb-6">
          <div className="p-3 bg-[#FFF7ED] text-[#EA580C] rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Vehicle Information</h2>
            <p className="text-xs text-[#6B7280]">
              Enter exact vehicle registration details to link with your AutoServe account.
            </p>
          </div>
        </div>

        {serverError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Registration Error</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Registration Number */}
          <div>
            <label
              htmlFor="registrationNumber"
              className="block text-sm font-bold text-[#111827] mb-1"
            >
              Registration / Licence Plate Number <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="registrationNumber"
              type="text"
              required
              placeholder="e.g. MH02AB1234"
              value={formData.registrationNumber}
              onChange={(e) => {
                setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() });
                if (errors.registrationNumber) setErrors({ ...errors, registrationNumber: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border font-mono font-bold text-[#111827] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px] ${
                errors.registrationNumber ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#D1D5DB]'
              }`}
              aria-invalid={!!errors.registrationNumber}
              aria-describedby={errors.registrationNumber ? 'reg-error' : undefined}
            />
            {errors.registrationNumber && (
              <p id="reg-error" className="mt-1 text-xs text-[#DC2626] font-medium">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          {/* Make & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-bold text-[#111827] mb-1">
                Vehicle Make / Manufacturer <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="make"
                type="text"
                required
                placeholder="e.g. Toyota"
                value={formData.make}
                onChange={(e) => {
                  setFormData({ ...formData, make: e.target.value });
                  if (errors.make) setErrors({ ...errors, make: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px] ${
                  errors.make ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#D1D5DB]'
                }`}
                aria-invalid={!!errors.make}
              />
              {errors.make && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.make}</p>
              )}
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-bold text-[#111827] mb-1">
                Vehicle Model <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="model"
                type="text"
                required
                placeholder="e.g. Camry"
                value={formData.model}
                onChange={(e) => {
                  setFormData({ ...formData, model: e.target.value });
                  if (errors.model) setErrors({ ...errors, model: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px] ${
                  errors.model ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#D1D5DB]'
                }`}
                aria-invalid={!!errors.model}
              />
              {errors.model && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.model}</p>
              )}
            </div>
          </div>

          {/* Year, Fuel Type, Vehicle Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-bold text-[#111827] mb-1">
                Mfg Year
              </label>
              <input
                id="year"
                type="number"
                placeholder="e.g. 2022"
                value={formData.year}
                onChange={(e) => {
                  setFormData({ ...formData, year: e.target.value });
                  if (errors.year) setErrors({ ...errors, year: '' });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
              />
              {errors.year && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors.year}</p>
              )}
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-sm font-bold text-[#111827] mb-1">
                Fuel Type
              </label>
              <select
                id="fuelType"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label htmlFor="vehicleType" className="block text-sm font-bold text-[#111827] mb-1">
                Body Type
              </label>
              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
              >
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="COUPE">Coupe</option>
                <option value="CONVERTIBLE">Convertible</option>
                <option value="TRUCK">Truck / Van</option>
              </select>
            </div>
          </div>

          {/* Color & VIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="color" className="block text-sm font-bold text-[#111827] mb-1">
                Color
              </label>
              <input
                id="color"
                type="text"
                placeholder="e.g. Pearl White"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="vin" className="block text-sm font-bold text-[#111827] mb-1">
                VIN / Chassis Number (Optional)
              </label>
              <input
                id="vin"
                type="text"
                placeholder="17-character VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] font-mono text-[#111827] uppercase focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate('/customer/vehicles')}
              className="px-5 py-2.5 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                </>
              ) : (
                'Register Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </CustomerShell>
  );
};
