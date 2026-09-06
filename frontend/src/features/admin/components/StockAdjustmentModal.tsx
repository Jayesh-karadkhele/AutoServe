import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';
import type { StockAdjustmentPayload, StockMovement } from '../types/adminTypes';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryId: number | null;
  itemName: string;
  currentStock: number;
  onSuccess: (movement: StockMovement) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  inventoryId,
  itemName,
  currentStock,
  onSuccess,
}) => {
  const [movementType, setMovementType] = useState<'MANUAL_INCREASE' | 'MANUAL_DECREASE' | 'CORRECTION'>('MANUAL_INCREASE');
  const [quantityDelta, setQuantityDelta] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !inventoryId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Mandatory audit reason is required for stock adjustments');
      return;
    }

    const signedDelta = movementType === 'MANUAL_DECREASE' ? -Math.abs(quantityDelta) : Math.abs(quantityDelta);
    if (currentStock + signedDelta < 0) {
      setError(`Stock adjustment would result in negative inventory (${currentStock + signedDelta}). Rejected.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload: StockAdjustmentPayload = {
        inventoryId,
        quantityDelta: signedDelta,
        movementType,
        reason,
      };

      const result = await adminApi.adjustStock(payload);
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to execute stock adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Controlled Stock Adjustment</h3>
            <p className="text-xs text-slate-500">Transactional Master Stock Audit & Ledger Entry</p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              disabled
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-600 font-medium">Current Stock</span>
            <span className="text-sm font-bold text-slate-900">{currentStock} units</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Type</label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="MANUAL_INCREASE">+ Stock Receive (Increase)</option>
                <option value="MANUAL_DECREASE">- Stock Audit (Decrease)</option>
                <option value="CORRECTION">Manual Inventory Correction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Delta</label>
              <input
                type="number"
                min="1"
                value={quantityDelta}
                onChange={(e) => setQuantityDelta(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Audit Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Received shipment invoice #INV-9021 or Damage audit"
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
              {loading ? 'Recording...' : 'Apply Stock Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
