import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MechanicShell } from '../components/MechanicShell';
import { useMechanicJobCardDetail } from '../hooks/useMechanicData';
import {
  startWorkOnJobCard,
  completeWorkOnJobCard,
  removePartFromJobCard,
  removeEvidenceFromJobCard,
} from '../api/mechanicApi';
import { PartUsageModal } from '../components/PartUsageModal';
import { EvidenceUploadModal } from '../components/EvidenceUploadModal';
import {
  Car,
  CheckCircle2,
  Play,
  Plus,
  Camera,
  Trash2,
  AlertCircle,
  Loader2,
  FileText,
  Boxes,
} from 'lucide-react';

export const MechanicJobDetailPage: React.FC = () => {
  const { jobCardId } = useParams<{ jobCardId: string }>();
  const id = parseInt(jobCardId || '0', 10);

  const { jobCard, setJobCard, isLoading, error, refresh } = useMechanicJobCardDetail(id);

  const [partModalOpen, setPartModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  const [diagnosisText, setDiagnosisText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleStartWork = async () => {
    setIsUpdatingStatus(true);
    setActionSuccess(null);
    try {
      const updated = await startWorkOnJobCard(id);
      setJobCard(updated);
      setActionSuccess('Work started successfully! Job card status updated to IN_PROGRESS.');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to start work on job card.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCompleteWork = async () => {
    if (!jobCard) return;
    setIsUpdatingStatus(true);
    setActionSuccess(null);
    try {
      const updated = await completeWorkOnJobCard(id);
      setJobCard(updated);
      setActionSuccess('Work completed successfully! Invoice generated for Manager review.');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to complete work on job card.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRemovePart = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to remove this part from the job card? Stock will be restored.')) {
      return;
    }
    try {
      const updated = await removePartFromJobCard(id, itemId);
      setJobCard(updated);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to remove part item.');
    }
  };

  const handleRemoveEvidence = async (evidenceId: number) => {
    if (!window.confirm('Are you sure you want to remove this repair photo evidence?')) {
      return;
    }
    try {
      const updated = await removeEvidenceFromJobCard(id, evidenceId);
      setJobCard(updated);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to remove evidence.');
    }
  };

  if (isLoading) {
    return (
      <MechanicShell pageTitle="Digital Workbench Loading...">
        <div className="p-12 text-center text-xs text-[#6B7280] animate-pulse bg-white rounded-3xl border border-[#E5E7EB]">
          Loading digital workbench for Job Card #{id}...
        </div>
      </MechanicShell>
    );
  }

  if (error || !jobCard) {
    return (
      <MechanicShell pageTitle="Job Card Workbench Error">
        <div role="alert" className="p-6 bg-[#FEF2F2] border border-[#FCA5A5] rounded-3xl text-sm text-[#B91C1C] space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Job card record not found.'}</span>
          </div>
          <Link to="/mechanic/jobs" className="inline-block px-4 py-2 bg-white border border-[#FCA5A5] rounded-xl text-xs font-bold hover:bg-[#FEE2E2]">
            Return to Assigned Jobs
          </Link>
        </div>
      </MechanicShell>
    );
  }

  // Work Progression Stepper Calculation
  const isCreated = jobCard.status === 'CREATED';
  const isInProgress = jobCard.status === 'IN_PROGRESS';
  const isCompleted = jobCard.status === 'COMPLETED';

  return (
    <MechanicShell
      pageTitle={`Job Card #${jobCard.id} Digital Workbench`}
      breadcrumbs={[
        { label: 'Assigned Jobs', href: '/mechanic/jobs' },
        { label: `#${jobCard.id}` },
      ]}
      activeJobId={isInProgress ? jobCard.id : undefined}
    >
      {actionSuccess && (
        <div role="alert" className="p-4 bg-[#ECFDF5] border border-[#6EE7B7] rounded-2xl text-xs font-bold text-[#047857] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Digital Workbench Top Context Banner */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-[#0284C7]">#{jobCard.id}</span>
              <span
                className={`px-3 py-1 rounded-full font-bold text-xs ${
                  isCompleted
                    ? 'bg-[#ECFDF5] text-[#059669]'
                    : isInProgress
                    ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]'
                    : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                }`}
              >
                {jobCard.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] mt-1">
              {jobCard.brand} {jobCard.model} ({jobCard.licensePlate})
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Assigned Manager: <span className="font-semibold text-[#111827]">{jobCard.managerName}</span>
            </p>
          </div>

          {/* Primary Action Buttons Header */}
          <div className="flex items-center gap-3">
            {isCreated && (
              <button
                type="button"
                onClick={handleStartWork}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold shadow-md transition-colors min-h-[44px]"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Start Work Now</span>
              </button>
            )}

            {isInProgress && (
              <button
                type="button"
                onClick={handleCompleteWork}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold shadow-md transition-colors min-h-[44px]"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Complete & Submit Work</span>
              </button>
            )}
          </div>
        </div>

        {/* 6-Stage Visual Workflow Stepper */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            Work Progression Stepper
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-bold">
            <div className={`p-2.5 rounded-xl border ${isCreated || isInProgress || isCompleted ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              1. Assigned
            </div>
            <div className={`p-2.5 rounded-xl border ${isInProgress || isCompleted ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              2. Work Started
            </div>
            <div className={`p-2.5 rounded-xl border ${jobCard.items.length > 0 || jobCard.evidence.length > 0 || isCompleted ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              3. Diagnosis
            </div>
            <div className={`p-2.5 rounded-xl border ${jobCard.items.length > 0 || isCompleted ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              4. Parts Reconciled
            </div>
            <div className={`p-2.5 rounded-xl border ${jobCard.evidence.length > 0 || isCompleted ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              5. Evidence Uploaded
            </div>
            <div className={`p-2.5 rounded-xl border ${isCompleted ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#047857]' : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'}`}>
              6. Completed
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer Concern & Diagnosis Notes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Reported Concern & Vehicle Details */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Car className="w-5 h-5 text-[#0284C7]" />
            <span>Vehicle & Customer Concern</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <p className="text-[#6B7280] font-semibold">Reported Issue / Problem Description</p>
              <p className="font-bold text-[#111827] leading-relaxed">{jobCard.problemDescription}</p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <p className="text-[#6B7280] font-semibold">Customer Information</p>
              <p className="font-bold text-[#111827]">{jobCard.customerName}</p>
              {jobCard.customerPhone && (
                <p className="text-[#475569] font-mono">{jobCard.customerPhone}</p>
              )}
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
              <p className="text-[#6B7280] font-semibold">Appointment Date & Time</p>
              <p className="font-bold text-[#111827]">{jobCard.appointmentDate}</p>
            </div>
          </div>
        </div>

        {/* Mechanic Diagnosis & Repair Notes */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <FileText className="w-5 h-5 text-[#0284C7]" />
            <span>Mechanic Diagnosis & Repair Notes</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="diagnosis-notes" className="block font-bold text-[#374151]">
                Diagnosis Summary & Work Performed
              </label>
              <textarea
                id="diagnosis-notes"
                rows={4}
                disabled={isCompleted}
                placeholder="Enter technical diagnosis findings (e.g. Front brake pad wear at 85%, rotors resurfaced, brake fluid flushed)."
                value={diagnosisText}
                onChange={(e) => setDiagnosisText(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] disabled:bg-[#F9FAFB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parts Usage Section */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#0284C7]" />
              <span>Parts & Materials Reconciled</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Transactional stock deduction directly from inventory master records.
            </p>
          </div>

          {!isCompleted && (
            <button
              type="button"
              onClick={() => setPartModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-bold rounded-xl text-xs transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Record Parts Usage</span>
            </button>
          )}
        </div>

        {jobCard.items.length === 0 ? (
          <div className="p-8 text-center bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] text-xs text-[#6B7280]">
            No parts or materials recorded for this job card yet. Click "Record Parts Usage" to deduct parts from inventory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F8FAFC] font-bold text-[#475569] border-b border-[#E2E8F0] uppercase">
                <tr>
                  <th className="px-4 py-3">Part Name</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Qty Used</th>
                  <th className="px-4 py-3">Total Amount</th>
                  {!isCompleted && <th className="px-4 py-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {jobCard.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3.5 font-bold text-[#111827]">{item.itemName}</td>
                    <td className="px-4 py-3.5 font-mono text-[#0284C7]">
                      ₹{item.itemPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#111827]">{item.quantity}</td>
                    <td className="px-4 py-3.5 font-extrabold text-[#111827]">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </td>
                    {!isCompleted && (
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemovePart(item.id)}
                          className="p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                          title="Remove part item & restore stock"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Repair Evidence Photo Gallery */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0284C7]" />
              <span>Repair Evidence Photo Gallery</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Persisted photo evidence categorized by stage (DIAGNOSIS, BEFORE/DURING/AFTER REPAIR).
            </p>
          </div>

          {!isCompleted && (
            <button
              type="button"
              onClick={() => setEvidenceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] font-bold rounded-xl text-xs transition-colors min-h-[44px]"
            >
              <Camera className="w-4 h-4" />
              <span>Upload Repair Evidence</span>
            </button>
          )}
        </div>

        {jobCard.evidence.length === 0 ? (
          <div className="p-8 text-center bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] text-xs text-[#6B7280]">
            No repair evidence uploaded for this job card yet. Click "Upload Repair Evidence" to attach stage photos.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobCard.evidence.map((ev) => (
              <div key={ev.id} className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden group">
                <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={ev.photoUrl}
                    alt={ev.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#111827]/80 text-white font-extrabold text-[10px] uppercase">
                    {ev.evidenceType || 'DURING_REPAIR'}
                  </span>
                </div>
                <div className="p-3.5 space-y-2">
                  <p className="text-xs font-bold text-[#111827] line-clamp-2">{ev.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>{ev.uploadedAt ? new Date(ev.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recorded'}</span>
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(ev.id)}
                        className="text-[#DC2626] font-bold hover:underline min-h-[36px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part Usage Modal */}
      <PartUsageModal
        isOpen={partModalOpen}
        onClose={() => setPartModalOpen(false)}
        jobCardId={jobCard.id}
        onSuccess={refresh}
      />

      {/* Evidence Upload Modal */}
      <EvidenceUploadModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        jobCardId={jobCard.id}
        onSuccess={refresh}
      />
    </MechanicShell>
  );
};
