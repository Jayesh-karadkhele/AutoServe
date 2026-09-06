import React, { useState } from 'react';
import type { MechanicWorkloadItem } from '../types/managerTypes';
import { X, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';

interface MechanicAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mechanics: MechanicWorkloadItem[];
  onAssign: (mechanicId: number) => Promise<void>;
  title?: string;
  currentMechanicId?: number | null;
}

export const MechanicAssignmentDrawer: React.FC<MechanicAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  mechanics,
  onAssign,
  title = 'Assign Mechanic',
  currentMechanicId,
}) => {
  const [selectedMechanicId, setSelectedMechanicId] = useState<number | null>(currentMechanicId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedMechanicId) {
      setError('Please select an active mechanic.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onAssign(selectedMechanicId);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign mechanic.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-drawer-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
            <div>
              <h2 id="assignment-drawer-title" className="text-xl font-bold text-[#111827]">
                {title}
              </h2>
              <p className="text-xs text-[#6B7280]">Assign an active technician from your workshop team</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-[#111827] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div role="alert" className="p-3 mb-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mechanics.length === 0 ? (
            <div className="p-8 text-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl space-y-2">
              <p className="text-sm font-semibold text-[#374151]">No Mechanics Registered Under Your Team</p>
              <p className="text-xs text-[#6B7280]">Contact Admin to assign staff mechanics to your manager scope.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mechanics.map((m) => {
                const isSelected = selectedMechanicId === m.mechanicId;
                const isInactive = !m.isActive;

                return (
                  <button
                    key={m.mechanicId}
                    type="button"
                    disabled={isInactive}
                    onClick={() => setSelectedMechanicId(m.mechanicId)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all min-h-[44px] flex items-center justify-between ${
                      isInactive
                        ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#0284C7] bg-[#F0F9FF] ring-2 ring-[#0284C7]/20 shadow-xs'
                        : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827] text-sm">{m.mechanicName}</span>
                        {currentMechanicId === m.mechanicId && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                            Currently Assigned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">{m.email} • {m.mobile}</p>
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-[#4B5563]">
                          Active Jobs: <strong className="text-[#111827]">{m.activeJobCount}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-[#4B5563]">
                          Completed: <strong className="text-[#111827]">{m.completedJobCount}</strong>
                        </span>
                      </div>
                      <span className={`inline-block text-[11px] font-semibold ${isInactive ? 'text-[#DC2626]' : m.activeJobCount > 0 ? 'text-[#D97706]' : 'text-[#059669]'}`}>
                        {m.availabilityStatus}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'border-[#CBD5E1]'
                      }`}
                    >
                      {isSelected && <UserCheck className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[#E5E7EB] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold rounded-xl text-sm transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || !selectedMechanicId}
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#EA580C] hover:bg-[#D97706] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px] flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
