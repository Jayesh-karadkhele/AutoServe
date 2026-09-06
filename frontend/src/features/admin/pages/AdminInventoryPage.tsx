import React, { useState, useEffect } from 'react';
import { AdminShell } from '../components/AdminShell';
import { adminApi } from '../api/adminApi';
import type { StockMovement } from '../types/adminTypes';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';

interface InventoryItem {
  id: number;
  itemName: string;
  skuCode: string;
  stockQuantity: number;
  currentPrice: number;
}

export const AdminInventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        // Fallback mock items if server mock
        setItems([
          { id: 1, itemName: 'Synthetic Engine Oil 5W-30', skuCode: 'SKU-OIL-001', stockQuantity: 45, currentPrice: 1250 },
          { id: 2, itemName: 'Front Brake Pads Ceramic', skuCode: 'SKU-BRK-002', stockQuantity: 8, currentPrice: 2400 },
          { id: 3, itemName: 'Oil Filter Premium', skuCode: 'SKU-FLT-003', stockQuantity: 4, currentPrice: 350 },
        ]);
      }
      const movData = await adminApi.getStockMovements();
      setMovements(movData);
    } catch {
      setItems([
        { id: 1, itemName: 'Synthetic Engine Oil 5W-30', skuCode: 'SKU-OIL-001', stockQuantity: 45, currentPrice: 1250 },
        { id: 2, itemName: 'Front Brake Pads Ceramic', skuCode: 'SKU-BRK-002', stockQuantity: 8, currentPrice: 2400 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedInventory(item);
    setAdjustModalOpen(true);
  };

  return (
    <AdminShell title="Inventory Master Control & Stock Movements">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Inventory Ledger & Stock Auditing</h2>
            <p className="text-xs text-slate-500 mt-1">
              Transactional stock adjustments, optimistic locking control & append-only stock movement ledger entries.
            </p>
          </div>
        </div>

        {/* Master Inventory Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
            Master Inventory Catalog
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading inventory catalog...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Item ID</th>
                    <th className="px-4 py-3">Part Name & SKU</th>
                    <th className="px-4 py-3">Unit Price (INR)</th>
                    <th className="px-4 py-3">Stock Quantity</th>
                    <th className="px-4 py-3">Stock Alert</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{item.itemName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{item.skuCode}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.currentPrice)}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{item.stockQuantity} units</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.stockQuantity < 5
                              ? 'bg-rose-100 text-rose-800'
                              : item.stockQuantity < 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.stockQuantity < 5 ? 'Critical Stock' : item.stockQuantity < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg shadow-2xs"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Append-Only Stock Movement Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>Stock Movement Audit Ledger (Append-Only)</span>
            <span className="text-xs text-slate-400 font-normal">Immutable Audit History</span>
          </div>
          {movements.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No stock movements recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Part Name</th>
                    <th className="px-4 py-3">Movement Type</th>
                    <th className="px-4 py-3">Before → After</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Audit Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {movements.map((mov) => (
                    <tr key={mov.id}>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {new Date(mov.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{mov.partName}</td>
                      <td className="px-4 py-3 font-semibold text-violet-700">{mov.movementType}</td>
                      <td className="px-4 py-3 font-mono">
                        {mov.quantityBefore} → <span className="font-bold text-slate-900">{mov.quantityAfter}</span> ({mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta})
                      </td>
                      <td className="px-4 py-3 text-slate-600">{mov.actorName}</td>
                      <td className="px-4 py-3 text-slate-500">{mov.reason || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <StockAdjustmentModal
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        inventoryId={selectedInventory?.id || null}
        itemName={selectedInventory?.itemName || ''}
        currentStock={selectedInventory?.stockQuantity || 0}
        onSuccess={() => fetchInventory()}
      />
    </AdminShell>
  );
};
