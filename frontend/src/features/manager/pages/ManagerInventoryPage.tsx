import React, { useState } from 'react';
import { ManagerShell } from '../components/ManagerShell';
import { useManagerInventory } from '../hooks/useManagerData';
import { Search, Boxes, RefreshCw, AlertCircle } from 'lucide-react';

export const ManagerInventoryPage: React.FC = () => {
  const { inventory, isLoading, error, refresh } = useManagerInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    if (lowStockOnly && item.stockQuantity >= item.reorderLevel) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.itemName.toLowerCase().includes(q);
      const matchSku = item.skuCode.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q) || false;
      return matchName || matchSku || matchCat;
    }

    return true;
  });

  return (
    <ManagerShell
      pageTitle="Workshop Inventory Workspace"
      breadcrumbs={[{ label: 'Inventory' }]}
    >
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search parts by name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-xs font-bold text-[#374151] cursor-pointer bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-2.5 rounded-xl min-h-[44px]">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-[#EA580C] rounded-md focus:ring-[#EA580C]"
            />
            <span>Low Stock Items Only</span>
          </label>

          <button
            type="button"
            onClick={refresh}
            className="p-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#334155] min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Refresh inventory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading inventory master list...
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Boxes className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">No Parts Found</h3>
          <p className="text-xs text-[#6B7280]">No inventory items match your search filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F8FAFC] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">SKU Code</th>
                  <th className="px-4 py-3.5">Part / Item Name</th>
                  <th className="px-4 py-3.5">Unit Price</th>
                  <th className="px-4 py-3.5">Current Stock</th>
                  <th className="px-4 py-3.5">Reorder Level</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredInventory.map((item) => {
                  const isLow = item.stockQuantity < item.reorderLevel;
                  const isOut = item.stockQuantity === 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-[#0284C7]">{item.skuCode}</td>
                      <td className="px-4 py-4 font-semibold text-[#111827]">{item.itemName}</td>
                      <td className="px-4 py-4 font-mono font-bold text-[#111827]">
                        {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.unitPrice)}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-[#111827]">{item.stockQuantity}</td>
                      <td className="px-4 py-4 font-mono text-[#6B7280]">{item.reorderLevel}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            isOut
                              ? 'bg-[#FEF2F2] text-[#DC2626]'
                              : isLow
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#ECFDF5] text-[#059669]'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ManagerShell>
  );
};
