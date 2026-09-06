import React, { useState, useEffect } from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminUsers } from '../hooks/useAdminData';
import { adminApi } from '../api/adminApi';

interface AppointmentItem {
  id: number;
  vehicleDetails?: { make?: string; model?: string; licensePlate?: string };
  customerName?: string;
  status: string;
  managerId?: number;
  managerName?: string;
  mechanicName?: string;
  problemDescription?: string;
}

export const AdminAppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const { users: managers } = useAdminUsers('MANAGER');
  const [loading, setLoading] = useState(true);
  const [assignTarget, setAssignTarget] = useState<AppointmentItem | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<number | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        setAppointments([
          { id: 101, customerName: 'Alice Johnson', status: 'PENDING', problemDescription: 'Brake noise on deceleration' },
          { id: 102, customerName: 'Bob Vance', status: 'APPROVED', managerId: 2, managerName: 'Manager Alpha', problemDescription: 'Engine oil change and filter replacement' },
        ]);
      }
    } catch {
      setAppointments([
        { id: 101, customerName: 'Alice Johnson', status: 'PENDING', problemDescription: 'Brake noise on deceleration' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTarget || !selectedManagerId || !reason) return;

    try {
      setAssignLoading(true);
      await adminApi.assignManagerToAppointment({
        appointmentId: assignTarget.id,
        managerId: selectedManagerId,
        reason,
      });
      setAssignTarget(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to assign Manager');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <AdminShell title="Global Appointment Governance">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Appointment Oversight</h2>
            <p className="text-xs text-slate-500 mt-1">Global service requests, manager assignments & fulfillment tracking</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading global appointments...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Appt ID</th>
                    <th className="px-4 py-3">Customer & Problem</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assigned Manager</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{appt.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{appt.customerName || 'Customer'}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">{appt.problemDescription || 'General Service'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase">
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {appt.managerName ? appt.managerName : <span className="text-amber-600 font-bold">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setAssignTarget(appt)}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg shadow-2xs"
                        >
                          {appt.managerId ? 'Reassign Manager' : 'Assign Manager'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Assign Workshop Manager</h3>
              <button onClick={() => setAssignTarget(null)} className="text-slate-400 p-1">✕</button>
            </div>
            <form onSubmit={handleAssignManager} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment ID #{assignTarget.id}</label>
                <input
                  type="text"
                  value={assignTarget.problemDescription || 'General Service'}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Workshop Manager</label>
                <select
                  value={selectedManagerId || ''}
                  onChange={(e) => setSelectedManagerId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  required
                >
                  <option value="">-- Select Active Manager --</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Audit Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Unassigned queue dispatch"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setAssignTarget(null)} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" disabled={assignLoading} className="px-5 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs">
                  {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
};
