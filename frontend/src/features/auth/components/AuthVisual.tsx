import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Wrench, Building2, UserCog } from 'lucide-react';

export const AuthVisual: React.FC = () => {
  return (
    <div
      aria-label="AutoServe Unified Platform Workspaces overview"
      className="relative hidden h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 p-8 shadow-xl lg:flex"
    >
      {/* Soft technical background grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

      {/* Header section */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/60 px-3.5 py-1 text-xs font-semibold tracking-wide text-sky-800 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          AutoServe Unified Platform Security
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          One Access Gateway, Four Dedicated Role Workspaces
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Role-based authentication securely routes Customers, Workshop Managers, Mechanics, and System Administrators to their tailored operational environments.
        </p>
      </div>

      {/* Interactive visual card grid for all 4 Workspaces */}
      <div className="relative z-10 my-6 space-y-3.5">
        {/* Workspace 1: Customer Workspace */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs shrink-0">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Portal</h3>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Self-Service</span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">Vehicle history, appointment booking & digital payments</p>
            </div>
          </div>
        </motion.div>

        {/* Workspace 2: Manager Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Manager Operations</h3>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">Management</span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">Staff dispatching, job cards, inventory & financial reports</p>
            </div>
          </div>
        </motion.div>

        {/* Workspace 3: Mechanic Workbench */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mechanic Workbench</h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Execution</span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">Digital task board, parts tracking & repair evidence logging</p>
            </div>
          </div>
        </motion.div>

        {/* Workspace 4: Admin Governance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs shrink-0">
              <UserCog className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Admin Governance</h3>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">Oversight</span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">Platform governance, user provisioning & global security audit</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer tagline */}
      <div className="relative z-10 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm">
        <p className="text-xs font-medium text-slate-600">
          <strong className="font-semibold text-slate-900">Zero Trust RBAC:</strong> User roles are assigned exclusively on the server side and returned via encrypted session tokens.
        </p>
      </div>
    </div>
  );
};
