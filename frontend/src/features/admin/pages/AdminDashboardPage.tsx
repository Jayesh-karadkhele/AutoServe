import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminShell } from '../components/AdminShell';
import { useAdminOverview, useAdminUsers } from '../hooks/useAdminData';
import { CreateStaffModal } from '../components/CreateStaffModal';

export const AdminDashboardPage: React.FC = () => {
  const { overview, loading, error, refresh } = useAdminOverview();
  const { users: managers } = useAdminUsers('MANAGER');
  const [createStaffOpen, setCreateStaffOpen] = useState(false);

  return (
    <AdminShell title="Platform Governance Overview">
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading governance metrics...</div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error}
          <button onClick={refresh} className="ml-4 underline font-semibold">
            Retry
          </button>
        </div>
      ) : overview ? (
        <div className="space-y-6">
          {/* Executive Quick Actions Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Command Center</h2>
              <p className="text-xs text-slate-500 mt-1">Real-time organizational telemetry, staff capacity & invoice oversight</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCreateStaffOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>➕</span> Create Staff Account
              </button>
              <Link
                to="/admin/teams"
                className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>🏢</span> Manage Teams
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link to="/admin/users?role=CUSTOMER" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Customers</span>
              <span className="text-2xl font-black text-slate-900">{overview.totalCustomers}</span>
            </Link>

            <Link to="/admin/managers" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Managers</span>
              <span className="text-2xl font-black text-slate-900">{overview.totalManagers}</span>
            </Link>

            <Link to="/admin/mechanics" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Mechanics</span>
              <span className="text-2xl font-black text-slate-900">{overview.totalMechanics}</span>
            </Link>

            <Link to="/admin/appointments" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-amber-600 block mb-1">Unassigned Appts</span>
              <span className="text-2xl font-black text-amber-600">{overview.unassignedAppointmentsCount}</span>
            </Link>

            <Link to="/admin/job-cards" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-cyan-600 block mb-1">Active Job Cards</span>
              <span className="text-2xl font-black text-cyan-600">{overview.activeJobCardsCount}</span>
            </Link>

            <Link to="/admin/inventory" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-300 transition-all">
              <span className="text-xs font-semibold text-rose-600 block mb-1">Low Stock Items</span>
              <span className="text-2xl font-black text-rose-600">{overview.lowStockCount}</span>
            </Link>
          </div>

          {/* Financial Billed Overview (Calculated Strictly from Verified Invoices) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Financial Ledger Summary</span>
              <span className="text-xs font-normal text-slate-500">Verified Database Invoices Only</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">Verified Paid Value</span>
                <span className="text-xl font-bold text-emerald-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(overview.paidInvoiceTotal || 0)}
                </span>
                <span className="text-xs text-emerald-700 block mt-1">{overview.verifiedPaidInvoicesCount} paid invoices</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">Outstanding Invoice Value</span>
                <span className="text-xl font-bold text-amber-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(overview.outstandingInvoiceTotal || 0)}
                </span>
                <span className="text-xs text-amber-700 block mt-1">{overview.outstandingInvoicesCount} pending invoices</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">Total Billed Value</span>
                <span className="text-xl font-bold text-slate-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(overview.totalBilledAmount || 0)}
                </span>
                <span className="text-xs text-slate-500 block mt-1">Invoice-ready jobs: {overview.invoiceReadyJobsCount}</span>
              </div>
            </div>
          </div>

          {/* Audit Trail Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Audit Log Activity</h3>
              <Link to="/admin/audit" className="text-xs font-semibold text-violet-600 hover:text-violet-800">
                View Full Audit Log →
              </Link>
            </div>
            {overview.recentAuditEvents && overview.recentAuditEvents.length > 0 ? (
              <div className="space-y-3">
                {overview.recentAuditEvents.map((evt) => (
                  <div key={evt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{evt.actorName}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="font-semibold text-violet-700">{evt.actionType}</span>
                      <p className="text-slate-600 mt-0.5">{evt.details}</p>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{new Date(evt.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No recent audit events recorded.</div>
            )}
          </div>
        </div>
      ) : null}

      <CreateStaffModal
        isOpen={createStaffOpen}
        onClose={() => setCreateStaffOpen(false)}
        onSuccess={() => {
          refresh();
        }}
        managers={managers}
      />
    </AdminShell>
  );
};
