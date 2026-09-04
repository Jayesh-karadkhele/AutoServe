import React from 'react';
import type { RoleData } from './roleData';
import { CustomerWorkspacePreview } from './CustomerWorkspacePreview';
import { ManagerWorkspacePreview } from './ManagerWorkspacePreview';
import { MechanicWorkspacePreview } from './MechanicWorkspacePreview';
import { AdminWorkspacePreview } from './AdminWorkspacePreview';
import { CheckCircle2, XCircle, Shield } from 'lucide-react';

interface RoleWorkspacePreviewProps {
  role: RoleData;
}

export const RoleWorkspacePreview: React.FC<RoleWorkspacePreviewProps> = ({ role }) => {
  return (
    <div
      id={`panel-${role.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${role.id}`}
      tabIndex={0}
      className="space-y-6 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-2xl"
    >
      {/* Permanent Illustrative Preview Badge & Role Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100/80 text-cyan-900 border border-cyan-200/60 uppercase tracking-wider">
              {role.roleBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Illustrative interface preview
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {role.message}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {role.description}
          </p>
        </div>
      </div>

      {/* Render Workspace Body Based on Role ID */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-100/60">
        {role.id === 'customer' && <CustomerWorkspacePreview />}
        {role.id === 'manager' && <ManagerWorkspacePreview />}
        {role.id === 'mechanic' && <MechanicWorkspacePreview />}
        {role.id === 'admin' && <AdminWorkspacePreview />}
      </div>

      {/* Compact Focused Access Area (RBAC Boundaries) */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-600" />
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Focused Access — Scope & Governance for {role.name}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Allowed actions */}
          <div className="space-y-2">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Permitted Actions ({role.allowedActions.length})
            </span>
            <ul className="space-y-1.5">
              {role.allowedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Restricted areas */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Restricted Boundaries ({role.restrictedAreas.length})
            </span>
            <ul className="space-y-1.5">
              {role.restrictedAreas.map((restricted, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <span>{restricted}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
