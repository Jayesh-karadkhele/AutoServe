import React, { useState } from 'react';
import { X, AlertOctagon, Loader2 } from 'lucide-react';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  appointmentId: number;
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentId,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A meaningful rejection reason is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reject appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rejection-modal-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h2 id="rejection-modal-title" className="text-xl font-bold text-[#111827]">
                Reject Appointment #{appointmentId}
              </h2>
              <p className="text-xs text-[#6B7280]">Provide reason to inform customer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#111827] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-bold text-[#111827] mb-1">
              Rejection Reason <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              id="rejectionReason"
              required
              rows={4}
              placeholder="e.g. Workshop schedule fully booked for requested slot; recommended alternative date provided."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold rounded-xl text-sm transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px] flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
