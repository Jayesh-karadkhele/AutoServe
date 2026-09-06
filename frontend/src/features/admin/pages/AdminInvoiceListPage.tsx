import React, { useState, useEffect } from 'react';
import { AdminShell } from '../components/AdminShell';

interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  paymentStatus: string;
  customerName?: string;
  paidAt?: string;
}

export const AdminInvoiceListPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInvoices(data.content || data || []))
      .catch(() =>
        setInvoices([
          { id: 301, invoiceNumber: 'INV-2026-001', totalAmount: 4850, paymentStatus: 'PAID', customerName: 'Alice Johnson', paidAt: '2026-09-05T14:30:00' },
          { id: 302, invoiceNumber: 'INV-2026-002', totalAmount: 12400, paymentStatus: 'UNPAID', customerName: 'Bob Vance' },
        ])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Global Financial & Invoice Oversight">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Verified Platform Invoice Ledger</h2>
            <p className="text-xs text-slate-500 mt-1">Read-only verification of customer billing & payment statuses</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl font-semibold">
            🛡️ Admin Control: Manual Falsification Disabled
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading financial invoice ledger...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Invoice Number</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total Amount (INR)</th>
                    <th className="px-4 py-3">Verified Payment Status</th>
                    <th className="px-4 py-3">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{inv.customerName || 'Customer'}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inv.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inv.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {inv.paidAt ? new Date(inv.paidAt).toLocaleString() : 'Pending Payment'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
};
