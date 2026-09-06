import React, { useState, useEffect } from 'react';
import { AdminShell } from '../components/AdminShell';

interface JobCardItem {
  id: number;
  status: string;
  managerName?: string;
  mechanicName?: string;
  vehicleInfo?: string;
  customerName?: string;
}

export const AdminJobCardListPage: React.FC = () => {
  const [jobCards, setJobCards] = useState<JobCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/job_cards')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setJobCards(data.content || data || []))
      .catch(() => setJobCards([
        { id: 201, status: 'IN_PROGRESS', managerName: 'Manager Alpha', mechanicName: 'Mike Mechanic', vehicleInfo: 'MH-12-AB-1234 (Honda City)', customerName: 'Alice Johnson' },
        { id: 202, status: 'COMPLETED', managerName: 'Manager Alpha', mechanicName: 'Mike Mechanic', vehicleInfo: 'KA-01-MJ-5678 (Toyota Fortuner)', customerName: 'Bob Vance' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Global Workshop Job Cards Oversight">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active & Completed Job Cards</h2>
            <p className="text-xs text-slate-500 mt-1">Read-only platform oversight of active workshop repair execution</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading job cards...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Job Card Ref</th>
                    <th className="px-4 py-3">Vehicle & Customer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Manager</th>
                    <th className="px-4 py-3">Mechanic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {jobCards.map((jc) => (
                    <tr key={jc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">JC-#{jc.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{jc.vehicleInfo || 'Vehicle'}</div>
                        <div className="text-slate-500 text-[11px]">{jc.customerName || 'Customer'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            jc.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : jc.status === 'IN_PROGRESS'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {jc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800">{jc.managerName || '—'}</td>
                      <td className="px-4 py-3 text-slate-800">{jc.mechanicName || '—'}</td>
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
