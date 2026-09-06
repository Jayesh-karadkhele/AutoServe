import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerVehicles } from '../hooks/useCustomerVehicles';
import { createAppointment } from '../api/customerApi';
import type { Appointment } from '../types/customerTypes';
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react';

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialVehicleId = searchParams.get('vehicleId');

  const { vehicles, isLoading: loadingVehicles } = useCustomerVehicles();

  const [step, setStep] = useState<number>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    initialVehicleId ? parseInt(initialVehicleId, 10) : null
  );

  const [serviceType, setServiceType] = useState<string>('Periodic Maintenance');
  const [customConcern, setCustomConcern] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-09-15');
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 11:00 AM');
  const [notes, setNotes] = useState<string>('');
  const [fulfilmentMode, setFulfilmentMode] = useState<'WORKSHOP_DROP_OFF' | 'PICKUP_AND_RETURN_REQUESTED'>('WORKSHOP_DROP_OFF');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [logisticsInstructions, setLogisticsInstructions] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const effectiveVehicleId = selectedVehicle?.id || null;

  const handleNextStep = () => {
    setValidationError(null);

    if (step === 1) {
      if (!effectiveVehicleId) {
        setValidationError('Please select a vehicle to proceed.');
        return;
      }
    } else if (step === 2) {
      if (!serviceType) {
        setValidationError('Please select a service type.');
        return;
      }
    } else if (step === 3) {
      if (!preferredDate) {
        setValidationError('Please select a preferred date for the appointment.');
        return;
      }
      if (fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && !pickupAddress.trim()) {
        setValidationError('Pickup address is required when requesting vehicle pickup and return.');
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmitBooking = async () => {
    if (!effectiveVehicleId) return;

    setIsSubmitting(true);
    setValidationError(null);

    try {
      const finalServiceDescription =
        serviceType === 'Custom Concern / Issue' && customConcern.trim()
          ? `Custom Issue: ${customConcern.trim()}`
          : serviceType;

      const appt = await createAppointment(
        {
          vehicleId: effectiveVehicleId,
          serviceType: finalServiceDescription,
          preferredDate,
          timeSlot,
          notes: notes.trim() || undefined,
          fulfilmentMode,
          pickupAddress: fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' ? pickupAddress.trim() : undefined,
          logisticsInstructions: logisticsInstructions.trim() || undefined,
        },
        undefined
      );

      setCreatedAppointment(appt);
      setStep(5); // Confirmation step
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit appointment booking.';
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerShell
      pageTitle="Book Service Appointment"
      breadcrumbs={[
        { label: 'Appointments', href: '/customer/appointments' },
        { label: 'Book Appointment' },
      ]}
    >
      {/* Confirmation Step */}
      {step === 5 && createdAppointment && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111827]">Appointment Requested Successfully!</h2>
            <p className="text-sm text-[#4B5563]">
              Your service request has been transmitted to our workshop operations team.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 text-left space-y-2 text-sm">
            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-[#6B7280]">Appointment Reference ID:</span>
              <span className="font-mono font-bold text-[#111827]">#{createdAppointment.id}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-[#6B7280]">Initial Status:</span>
              <span className="font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs">
                {createdAppointment.status}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-[#6B7280]">Service Requested:</span>
              <span className="font-semibold text-[#111827]">{createdAppointment.serviceType}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-[#6B7280]">Scheduled Date:</span>
              <span className="font-medium text-[#111827]">
                {createdAppointment.preferredDate} ({createdAppointment.timeSlot || 'Standard Slot'})
              </span>
            </div>
            {selectedVehicle && (
              <div className="flex justify-between pt-1">
                <span className="text-[#6B7280]">Vehicle:</span>
                <span className="font-medium text-[#111827]">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.registrationNumber})
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/customer/appointments/${createdAppointment.id}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
            >
              View Appointment Details
            </Link>
            <Link
              to="/customer/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold rounded-xl text-sm transition-colors min-h-[44px] flex items-center justify-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Multi-Step Wizard Flow */}
      {step < 5 && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] mb-3">
              <span className={step >= 1 ? 'text-[#EA580C]' : ''}>1. Select Vehicle</span>
              <span className={step >= 2 ? 'text-[#EA580C]' : ''}>2. Service Type</span>
              <span className={step >= 3 ? 'text-[#EA580C]' : ''}>3. Schedule</span>
              <span className={step >= 4 ? 'text-[#EA580C]' : ''}>4. Review</span>
            </div>
            <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EA580C] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Select Vehicle */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Step 1: Select Your Vehicle</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Choose which registered vehicle requires service.
                </p>
              </div>

              {loadingVehicles && (
                <div className="p-8 text-center text-sm text-[#6B7280] animate-pulse">
                  Loading registered vehicles...
                </div>
              )}

              {!loadingVehicles && vehicles.length === 0 && (
                <div className="p-8 text-center bg-[#FFF7ED] rounded-xl border border-[#FDE68A] space-y-3">
                  <p className="text-sm font-semibold text-[#B45309]">
                    You have no registered vehicles. Please register a vehicle before booking service.
                  </p>
                  <Link
                    to="/customer/vehicles/new"
                    className="inline-block px-5 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl text-sm min-h-[44px]"
                  >
                    Register Vehicle First
                  </Link>
                </div>
              )}

              {!loadingVehicles && vehicles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((v) => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-4 rounded-2xl border text-left transition-all min-h-[44px] flex items-center justify-between ${
                          isSelected
                            ? 'border-[#EA580C] bg-[#FFF7ED] ring-2 ring-[#EA580C]/20 shadow-xs'
                            : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-[#0284C7]">
                            {v.registrationNumber}
                          </span>
                          <p className="font-extrabold text-[#111827] text-base">
                            {v.make} {v.model}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {v.year ? `${v.year} • ` : ''}
                            {v.fuelType || 'Petrol'}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#EA580C] border-[#EA580C] text-white'
                              : 'border-[#D1D5DB]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Service Type & Concern */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Step 2: Choose Service Type</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Select the required workshop service or describe custom vehicle symptoms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Periodic Maintenance', desc: 'Engine oil, filter replacement, fluids & multi-point check.' },
                  { title: 'Brake Inspection & Repair', desc: 'Brake pad inspection, rotor resurfacing, fluid flush.' },
                  { title: 'General Diagnostic Service', desc: 'Engine check light, electrical scan & diagnostic inspection.' },
                  { title: 'AC & Suspension Service', desc: 'Climate control recharge, shock absorber & suspension repair.' },
                  { title: 'Custom Concern / Issue', desc: 'Specify custom mechanical or electrical concerns below.' },
                ].map((item) => {
                  const isSelected = serviceType === item.title;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setServiceType(item.title)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#EA580C] bg-[#FFF7ED] ring-2 ring-[#EA580C]/20 shadow-xs'
                          : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <h4 className="font-bold text-[#111827] text-sm">{item.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              {serviceType === 'Custom Concern / Issue' && (
                <div>
                  <label htmlFor="customConcern" className="block text-sm font-bold text-[#111827] mb-1">
                    Describe your vehicle concern in detail
                  </label>
                  <textarea
                    id="customConcern"
                    rows={3}
                    placeholder="e.g. Unusual squeaking sound when braking at low speed."
                    value={customConcern}
                    onChange={(e) => setCustomConcern(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-bold text-[#111827] mb-1">
                  Additional Notes or Instructions for Workshop (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="Any specific requests or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Schedule Date & Time Slot */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Step 3: Schedule & Fulfilment</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Select your appointment date, time window, and service fulfilment preference.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-bold text-[#111827] mb-1">
                    Preferred Date <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
                  />
                </div>

                <div>
                  <label htmlFor="timeSlot" className="block text-sm font-bold text-[#111827] mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    id="timeSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Midday)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Fulfilment Mode Options */}
              <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
                <label className="block text-sm font-bold text-[#111827]">
                  Service Fulfilment Preference <span className="text-[#DC2626]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFulfilmentMode('WORKSHOP_DROP_OFF')}
                    className={`p-4 rounded-2xl border text-left transition-all min-h-[44px] flex items-center justify-between ${
                      fulfilmentMode === 'WORKSHOP_DROP_OFF'
                        ? 'border-[#EA580C] bg-[#FFF7ED] ring-2 ring-[#EA580C]/20'
                        : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-[#111827] text-sm">Self Drop-Off at Workshop</h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">Bring vehicle directly to workshop</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${fulfilmentMode === 'WORKSHOP_DROP_OFF' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-[#D1D5DB]'}`}>
                      {fulfilmentMode === 'WORKSHOP_DROP_OFF' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfilmentMode('PICKUP_AND_RETURN_REQUESTED')}
                    className={`p-4 rounded-2xl border text-left transition-all min-h-[44px] flex items-center justify-between ${
                      fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED'
                        ? 'border-[#EA580C] bg-[#FFF7ED] ring-2 ring-[#EA580C]/20'
                        : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-[#111827] text-sm">Request Vehicle Pickup & Return</h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">Subject to manager confirmation</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-[#D1D5DB]'}`}>
                      {fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                </div>

                {fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && (
                  <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-4">
                    <div>
                      <label htmlFor="pickupAddress" className="block text-xs font-bold text-[#0369A1] mb-1">
                        Pickup & Delivery Address <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        id="pickupAddress"
                        type="text"
                        required
                        placeholder="Complete residential or office address for vehicle pickup..."
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#7DD3FC] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="logisticsInstructions" className="block text-xs font-bold text-[#0369A1] mb-1">
                        Logistics Instructions / Gate Access (Optional)
                      </label>
                      <input
                        id="logisticsInstructions"
                        type="text"
                        placeholder="e.g. Call upon arrival at security gate 2..."
                        value={logisticsInstructions}
                        onChange={(e) => setLogisticsInstructions(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#7DD3FC] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white min-h-[44px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Step 4: Review Appointment Details</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Please verify your vehicle and schedule before confirming submission.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
                  <span className="text-[#6B7280] font-medium">Selected Vehicle:</span>
                  <span className="font-bold text-[#111827]">
                    {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.registrationNumber})
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
                  <span className="text-[#6B7280] font-medium">Service Requested:</span>
                  <span className="font-bold text-[#EA580C]">
                    {serviceType === 'Custom Concern / Issue' && customConcern.trim()
                      ? `Custom Issue: ${customConcern.trim()}`
                      : serviceType}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
                  <span className="text-[#6B7280] font-medium">Scheduled Date & Slot:</span>
                  <span className="font-semibold text-[#111827]">
                    {preferredDate} ({timeSlot})
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
                  <span className="text-[#6B7280] font-medium">Fulfilment Mode:</span>
                  <span className="font-semibold text-[#0369A1]">
                    {fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' ? 'Pickup & Return Requested' : 'Self Drop-Off at Workshop'}
                  </span>
                </div>

                {fulfilmentMode === 'PICKUP_AND_RETURN_REQUESTED' && pickupAddress && (
                  <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="text-[#6B7280] font-medium">Pickup Address:</span>
                    <span className="font-normal text-[#111827] max-w-xs text-right">{pickupAddress}</span>
                  </div>
                )}

                {notes && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-medium">Additional Notes:</span>
                    <span className="font-normal text-[#374151] max-w-xs text-right">{notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl transition-colors min-h-[44px] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px] flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="px-8 py-3 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-lg min-h-[44px] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  'Confirm & Submit Booking'
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </CustomerShell>
  );
};
