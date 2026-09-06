import React, { useState } from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminAuditEvents } from '../hooks/useAdminData';

export const AdminAuditPage: React.FC = () => {
  const [actionType, setActionType] = useState<string | undefined>(undefined);
  const [resourceType, setResourceType] = useState<string | undefined>(undefined);
  const { events, loading, error, refresh } = useAdminAuditEvents(undefined, actionType, resourceType);

  return (
    <AdminShell title="Platform Audit Trail & Security Events">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Immutable Administrative Audit Log</h2>
            <p className="text-xs text-slate-500 mt-1">
              Append-only security & administrative events trail. Read-only for platform compliance.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center">
          <select
            value={actionType || ''}
            onChange={(e) => setActionType(e.target.value || undefined)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <option value="">All Action Types</option>
            <option value="STAFF_CREATE">STAFF_CREATE</option>
            <option value="USER_ACTIVATED">USER_ACTIVATED</option>
            <option value="USER_DEACTIVATED">USER_DEACTIVATED</option>
            <option value="TEAM_REASSIGNMENT">TEAM_REASSIGNMENT</option>
            <option value="APPOINTMENT_MANAGER_ASSIGNMENT">APPOINTMENT_MANAGER_ASSIGNMENT</option>
            <option value="STOCK_ADJUSTMENT">STOCK_ADJUSTMENT</option>
          </select>

          <select
            value={resourceType || ''}
            onChange={(e) => setResourceType(e.target.value || undefined)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <option value="">All Resource Types</option>
            <option value="USER">USER</option>
            <option value="APPOINTMENT">APPOINTMENT</option>
            <option value="JOB_CARD">JOB_CARD</option>
            <option value="INVENTORY">INVENTORY</option>
            <option value="INVOICE">INVOICE</option>
          </select>

          <button onClick={refresh} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">
            Refresh Filter
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading audit trail...</div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-xs">{error}</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No audit events match selected filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Actor (Admin)</th>
                    <th className="px-4 py-3">Action Type</th>
                    <th className="px-4 py-3">Target Resource</th>
                    <th className="px-4 py-3">Outcome</th>
                    <th className="px-4 py-3">Sanitized Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {new Date(evt.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{evt.actorName}</div>
                        <div className="text-slate-400 text-[10px]">{evt.actorEmail}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-violet-800">{evt.actionType}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-slate-600">
                          {evt.resourceType} #{evt.resourceId || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            evt.outcome === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {evt.outcome}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{evt.details || '—'}</td>
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
