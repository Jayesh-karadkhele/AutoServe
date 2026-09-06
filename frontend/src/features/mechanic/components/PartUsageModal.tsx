import React, { useState, useEffect } from 'react';
import { getAvailableInventory, addPartToJobCard } from '../api/mechanicApi';
import type { InventoryItem } from '../../manager/types/managerTypes';
import { X, Search, Boxes, Plus, AlertCircle, Loader2 } from 'lucide-react';

interface PartUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobCardId: number;
  onSuccess: () => void;
}

export const PartUsageModal: React.FC<PartUsageModalProps> = ({
  isOpen,
  onClose,
  jobCardId,
  onSuccess,
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchInventory = async () => {
      setIsLoadingInventory(true);
      setError(null);
      try {
        const data = await getAvailableInventory();
        setInventory(data);
      } catch (err: any) {
        setError('Failed to fetch available inventory items.');
      } finally {
        setIsLoadingInventory(false);
      }
    };

    fetchInventory();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredInventory = inventory.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      item.skuCode.toLowerCase().includes(q)
    );
  });

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Please select an inventory item.');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > selectedItem.stockQuantity) {
      setError(`Quantity requested (${quantity}) exceeds available stock (${selectedItem.stockQuantity}).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addPartToJobCard(jobCardId, {
        inventoryItemId: selectedItem.id,
        quantity,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add part to job card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="part-usage-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 id="part-usage-modal-title" className="text-base font-bold text-[#111827]">
                Record Parts Usage
              </h2>
              <p className="text-xs text-[#6B7280]">Select part & quantity for Job Card #{jobCardId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close parts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleAddPart} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div role="alert" className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search parts by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            />
          </div>

          {/* Inventory Selection List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#374151]">Select Part Item</label>
            {isLoadingInventory ? (
              <div className="p-6 text-center text-xs text-[#6B7280] animate-pulse">
                Loading available inventory...
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                No inventory parts match your search.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB]">
                {filteredInventory.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const isOutOfStock = item.stockQuantity <= 0;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left p-3 flex items-center justify-between text-xs transition-colors min-h-[44px] ${
                        isSelected
                          ? 'bg-[#E0F2FE] border-l-4 border-[#0284C7]'
                          : isOutOfStock
                          ? 'opacity-50 bg-[#F9FAFB] cursor-not-allowed'
                          : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-[#111827]">{item.itemName}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono">{item.skuCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[#0284C7]">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </p>
                        <p
                          className={`text-[10px] font-bold ${
                            isOutOfStock ? 'text-[#DC2626]' : 'text-[#059669]'
                          }`}
                        >
                          {isOutOfStock ? 'Out of Stock' : `In Stock: ${item.stockQuantity}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {selectedItem && (
            <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0369A1]">Selected: {selectedItem.itemName}</span>
                <span className="text-xs font-mono font-bold text-[#0284C7]">
                  Unit Price: ₹{selectedItem.unitPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="part-quantity" className="text-xs font-bold text-[#374151]">
                  Quantity to Use:
                </label>
                <input
                  id="part-quantity"
                  type="number"
                  min={1}
                  max={selectedItem.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value || '1', 10))}
                  className="w-24 px-3 py-2 text-xs font-bold rounded-xl border border-[#D1D5DB] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
                />
              </div>

              <div className="pt-2 border-t border-[#BAE6FD] flex items-center justify-between text-xs font-extrabold text-[#111827]">
                <span>Total Parts Cost:</span>
                <span className="text-sm font-black text-[#0284C7]">
                  ₹{(selectedItem.unitPrice * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-bold text-[#4B5563] hover:bg-[#F3F4F6] min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedItem}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-colors min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Part to Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
