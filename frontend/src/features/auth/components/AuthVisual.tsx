import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Car, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const AuthVisual: React.FC = () => {
  return (
    <div
      aria-label="Service Passport vehicle lifecycle overview"
      className="relative hidden h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 p-8 shadow-xl lg:flex"
    >
      {/* Soft technical background grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

      {/* Header section */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/60 px-3.5 py-1 text-xs font-semibold tracking-wide text-sky-800 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          AutoServe Service Passport
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          One Connected Account for Your Vehicle’s Complete Lifecycle
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Seamlessly track appointments, inspect high-res repair evidence, verify transparent pricing, and enjoy roadside peace of mind.
        </p>
      </div>

      {/* Interactive visual card timeline */}
      <div className="relative z-10 my-6 space-y-4">
        {/* Connected vertical line */}
        <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-gradient-to-b from-amber-400 via-sky-400 to-emerald-400" />

        {/* Step 1: Vehicle Identity Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative ml-10 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="absolute -left-10 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-sm">
            <Car className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vehicle Identity</p>
              <h3 className="text-sm font-bold text-slate-800">BMW M3 Competition (2024)</h3>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
              AS-JC-260884
            </span>
          </div>
        </motion.div>

        {/* Step 2: Service Checkpoint */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative ml-10 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="absolute -left-10 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-sm">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Appointment Status</p>
              <p className="text-sm font-semibold text-slate-800">Scheduled Inspection & Fluid Replacement</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              Active
            </span>
          </div>
        </motion.div>

        {/* Step 3: Transparent Invoice & Record */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative ml-10 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="absolute -left-10 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verified Invoice</p>
              <p className="text-sm font-semibold text-slate-800">AS-INV-260884</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Itemized
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer tagline */}
      <div className="relative z-10 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm">
        <p className="text-xs font-medium text-slate-600">
          <strong className="font-semibold text-slate-900">End-to-End Security:</strong> Short-lived tokens, HttpOnly rotating refresh sessions, and object-level authorization protect your service history.
        </p>
      </div>
    </div>
  );
};
