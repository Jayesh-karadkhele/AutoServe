import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerTeam } from '../hooks/useManagerData';
import { MechanicAssignmentDrawer } from '../components/MechanicAssignmentDrawer';
import { getJobCardById, assignMechanicToJobCard, generateInvoiceForJobCard } from '../api/managerApi';
import type { ManagerJobCard } from '../types/managerTypes';
import {
  Wrench,
  User,
  Car,
  UserPlus,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
} from 'lucide-react';

export const ManagerJobCardDetailPage: React.FC = () => {
  const { jobCardId } = useParams<{ jobCardId: string }>();
  const id = parseInt(jobCardId || '0', 10);

  const { team } = useManagerTeam();
  const [jobCard, setJobCard] = useState<ManagerJobCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJobCardById(id);
      setJobCard(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load job card details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleAssignMechanicConfirm = async (mechanicId: number) => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const updated = await assignMechanicToJobCard(id, mechanicId);
      setJobCard(updated);
      setActionSuccess('Mechanic assigned to job card successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign mechanic.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setIsProcessing(true);
    setError(null);
    setActionSuccess(null);
    try {
      const inv = await generateInvoiceForJobCard(id);
      setActionSuccess(`Invoice #${inv.invoiceNumber} generated successfully!`);
      fetchDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to generate invoice.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ManagerShell
      pageTitle={`Job Card JC#${id}`}
      breadcrumbs={[
        { label: 'Job Cards', href: '/manager/job-cards' },
        { label: `JC#${id}` },
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
          Loading job card details...
        </div>
      ) : !jobCard ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <h3 className="text-base font-bold text-[#111827]">Job Card Not Found</h3>
          <p className="text-xs text-[#6B7280]">The requested job card does not exist or is outside your manager scope.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Bar & Actions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-[#111827]">Job Card Reference JC#{jobCard.id}</h2>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    jobCard.status === 'IN_PROGRESS'
                      ? 'bg-[#E0F2FE] text-[#0284C7]'
                      : jobCard.status === 'COMPLETED'
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {jobCard.status}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Related Appointment: <strong className="text-[#111827]">#{jobCard.appointmentId}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setIsAssignDrawerOpen(true)}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                {jobCard.mechanicId ? 'Reassign Mechanic' : 'Assign Mechanic'}
              </button>

              {jobCard.status === 'COMPLETED' && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleGenerateInvoice}
                  className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-xs transition-colors shadow-sm min-h-[44px] flex items-center gap-1.5"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                  Generate Invoice
                </button>
              )}
            </div>
          </div>

          {/* Details Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <User className="w-4 h-4 text-[#0284C7]" /> Customer & Mechanic
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Customer:</span>
                  <span className="font-bold text-[#111827]">{jobCard.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-t border-[#F3F4F6] pt-2">
                  <span className="text-[#6B7280]">Assigned Mechanic:</span>
                  <span className="font-bold text-[#0284C7]">{jobCard.mechanicName || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <Car className="w-4 h-4 text-[#0284C7]" /> Vehicle & Diagnosis
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Vehicle:</span>
                  <span className="font-bold text-[#111827]">{jobCard.vehicleMakeModel || 'Vehicle'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Registration:</span>
                  <span className="font-mono font-bold text-[#0284C7]">{jobCard.vehicleRegistration || 'N/A'}</span>
                </div>
                {jobCard.diagnosis && (
                  <div className="border-t border-[#F3F4F6] pt-2">
                    <span className="text-[#6B7280] block mb-1">Mechanic Diagnosis:</span>
                    <p className="p-2 bg-[#F8FAFC] rounded-lg text-[#374151]">{jobCard.diagnosis}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <DollarSign className="w-4 h-4 text-[#059669]" /> Cost Summary
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Labor Cost:</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(jobCard.laborCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Parts Cost:</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(jobCard.partsCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                  <span className="font-bold text-[#111827]">Estimated Total:</span>
                  <span className="font-mono font-extrabold text-[#059669] text-sm">
                    {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(jobCard.estimatedCost || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parts Used Section */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Wrench className="w-5 h-5 text-[#0284C7]" /> Parts & Inventory Consumption
            </h3>
            {!jobCard.items || jobCard.items.length === 0 ? (
              <p className="text-xs text-[#6B7280] italic">No replacement parts attached to this job card yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#374151]">
                  <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-2.5">Part Name</th>
                      <th className="px-4 py-2.5">SKU / Code</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5">Unit Price</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {jobCard.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-semibold text-[#111827]">{item.partName}</td>
                        <td className="px-4 py-3 font-mono text-[#6B7280]">{item.partNumber || '—'}</td>
                        <td className="px-4 py-3 font-bold text-[#111827]">{item.quantity}</td>
                        <td className="px-4 py-3 font-mono">
                          {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.unitPrice)}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#111827] text-right">
                          {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Repair Evidence Gallery */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <ImageIcon className="w-5 h-5 text-[#0284C7]" /> Repair Evidence Gallery
            </h3>
            {!jobCard.evidenceList || jobCard.evidenceList.length === 0 ? (
              <p className="text-xs text-[#6B7280] italic">No visual repair evidence uploaded for this job card yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {jobCard.evidenceList.map((ev) => (
                  <div key={ev.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8FAFC]">
                    <img src={ev.imageUrl} alt={ev.caption || 'Repair Evidence'} className="w-full h-36 object-cover" />
                    <div className="p-2.5 text-xs space-y-1">
                      <span className="font-bold text-[#111827] block truncate">{ev.caption || 'Evidence Photo'}</span>
                      <span className="text-[10px] text-[#6B7280] block font-mono">{ev.stage || 'STAGE_PHOTO'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <MechanicAssignmentDrawer
        isOpen={isAssignDrawerOpen}
        onClose={() => setIsAssignDrawerOpen(false)}
        mechanics={team}
        onAssign={handleAssignMechanicConfirm}
        currentMechanicId={jobCard?.mechanicId}
      />
    </ManagerShell>
  );
};
