import React from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminOverview } from '../hooks/useAdminData';

export const AdminReportsPage: React.FC = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <AdminShell title="Organization-Wide Operational Reports">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Real-Data Telemetry & Financial Breakdown</h2>
          <p className="text-xs text-slate-500 mt-1">Aggregated platform statistics derived strictly from persisted database entities.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading operational report...</div>
        ) : overview ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">User & Role Telemetry</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Registered Customer Accounts:</span>
                  <span className="font-bold text-slate-900">{overview.totalCustomers}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Active Workshop Managers:</span>
                  <span className="font-bold text-slate-900">{overview.totalManagers}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Active Field Mechanics:</span>
                  <span className="font-bold text-slate-900">{overview.totalMechanics}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Deactivated / Inactive Accounts:</span>
                  <span className="font-bold text-rose-600">{overview.inactiveUsersCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Job Card & Fulfillment Telemetry</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Unassigned Appointments:</span>
                  <span className="font-bold text-amber-600">{overview.unassignedAppointmentsCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Active Repair Job Cards:</span>
                  <span className="font-bold text-cyan-700">{overview.activeJobCardsCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Completed Repair Jobs Today:</span>
                  <span className="font-bold text-emerald-700">{overview.completedJobsToday}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Inventory Low-Stock Alerts:</span>
                  <span className="font-bold text-rose-600">{overview.lowStockCount} items</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
};
