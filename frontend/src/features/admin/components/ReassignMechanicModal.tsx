import React, { useState } from 'react';
import type { UserSummary } from '../types/adminTypes';
import { adminApi } from '../api/adminApi';

interface ReassignMechanicModalProps {
  isOpen: boolean;
  onClose: () => void;
  mechanic: UserSummary | null;
  managers: UserSummary[];
  onSuccess: () => void;
}

export const ReassignMechanicModal: React.FC<ReassignMechanicModalProps> = ({
  isOpen,
  onClose,
  mechanic,
  managers,
  onSuccess,
}) => {
  const [targetManagerId, setTargetManagerId] = useState<number | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !mechanic) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetManagerId || !reason) {
      setError('Please select a target Manager and enter a valid reason for transfer');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminApi.reassignMechanic({
        mechanicId: mechanic.id,
        targetManagerId,
        reason,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reassign Mechanic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Transfer Mechanic Team</h3>
            <p className="text-xs text-slate-500">Reassign Technician to Another Manager</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <span className="font-bold">Transfer Policy:</span> Mechanics with active assigned jobs cannot be reassigned until active job cards are completed or reassigned to another technician first.
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mechanic</label>
            <input
              type="text"
              value={`${mechanic.fullName} (${mechanic.email})`}
              disabled
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Workshop Manager</label>
            <select
              value={targetManagerId || ''}
              onChange={(e) => setTargetManagerId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              required
            >
              <option value="">-- Select Active Manager --</option>
              {managers
                .filter((m) => m.id !== mechanic.managerId)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Reassignment</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Workshop workload balancing"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              rows={3}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs disabled:opacity-50"
            >
              {loading ? 'Reassigning...' : 'Confirm Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
