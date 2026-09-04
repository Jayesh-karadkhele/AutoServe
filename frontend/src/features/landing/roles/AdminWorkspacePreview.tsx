import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Package,
  UserPlus,
  AlertCircle,
  Activity,
} from 'lucide-react';

export const AdminWorkspacePreview: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'inventory' | 'operational'>('users');

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white">System & Governance Control Center</h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Illustrative System State
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Platform governance, user provisioning, global inventory tracking and role boundary security.
          </p>
        </div>

        <button className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm">
          <UserPlus className="w-3.5 h-3.5" />
          Provision Staff Account
        </button>
      </div>

      {/* Operational Health Metrics Cards (No fake metrics, operational count only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Active Accounts</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">48</div>
          <p className="text-[11px] text-slate-400">12 Managers • 28 Techs • 8 Admins</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Workshops Connected</span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">3 Locations</div>
          <p className="text-[11px] text-slate-400">Metro Hub • West • South Bay</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-medium">Low Stock Items</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-900">4 Items</div>
          <p className="text-[11px] text-amber-700">Reorder trigger reached</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">System Uptime</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">99.98%</div>
          <p className="text-[11px] text-slate-400">Security services nominal</p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeSubTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Staff & User Management
        </button>
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeSubTab === 'inventory'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Workshop Inventory Overview
        </button>
        <button
          onClick={() => setActiveSubTab('operational')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeSubTab === 'operational'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Operational Health & Audits
        </button>
      </div>

      {/* Sub-tab Panels */}
      {activeSubTab === 'users' && (
        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-slate-900 text-sm">System Users & Role Security Matrix</h5>
            <span className="text-xs text-slate-400">Strict RBAC Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">User</th>
                  <th className="py-2.5 px-3 font-semibold">Role</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Sarah Jenkins</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      MANAGER
                    </span>
                  </td>
                  <td className="py-2.5 px-3">Metro Hub Bay 1-4</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium text-[11px]">Edit Perms</button>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Marcus Vance</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                      MECHANIC
                    </span>
                  </td>
                  <td className="py-2.5 px-3">Metro Hub Bay 3</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium text-[11px]">Edit Perms</button>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900">David Ross</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      CUSTOMER
                    </span>
                  </td>
                  <td className="py-2.5 px-3">Self-managed Account</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium text-[11px]">View Profile</button>
                  </td>
                </tr>

                <tr className="bg-amber-50/20">
                  <td className="py-2.5 px-3 font-medium text-slate-900">Elena Rostova</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                      MECHANIC
                    </span>
                  </td>
                  <td className="py-2.5 px-3">West Location</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                      <AlertCircle className="w-3 h-3" /> Inactive 30+ Days
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-amber-700 hover:text-amber-900 font-medium text-[11px]">Review Account</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'inventory' && (
        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-slate-900 text-sm">Global Parts & Inventory Stock Levels</h5>
            <button className="text-xs text-cyan-600 hover:underline font-medium">Import Catalog XML</button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Ceramic Brake Pad Kit (Porsche Taycan)</p>
                <p className="text-[11px] text-slate-400">SKU: OEM-BP-8842 • Category: Braking</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-slate-700">14 sets in stock</span>
                <p className="text-[10px] text-emerald-600 font-medium">Optimal level</p>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">DOT 4 High-Temp Fluid (1L)</p>
                <p className="text-[11px] text-slate-400">SKU: OEM-FL-9021 • Category: Fluids</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-amber-700 font-semibold">3 bottles remaining</span>
                <p className="text-[10px] text-amber-600 font-medium">Low stock alert</p>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Synthetic 0W-40 Engine Oil (5L)</p>
                <p className="text-[11px] text-slate-400">SKU: OEM-OL-4011 • Category: Maintenance</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-slate-700">42 units in stock</span>
                <p className="text-[10px] text-emerald-600 font-medium">Optimal level</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'operational' && (
        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-slate-900 text-sm">System Audit Log & Health Status</h5>
            <span className="text-xs font-mono text-slate-400">Immutable Audit Trail</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-800">User Role Escalation Request Approved</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">Today 16:42:10 • Admin #1</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="font-medium text-slate-800">Inventory Threshold Updated for Brake Pads</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">Today 14:15:02 • Admin #1</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="font-medium text-slate-800">Automated Database Snapshot Verification Passed</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">Today 04:00:00 • Cron Service</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
