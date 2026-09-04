import React from 'react';
import { CheckCircle2, FileText, Wrench, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const FinalCtaVisual: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  return (
    <div className="relative w-full max-w-lg mx-auto h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-white via-cyan-50/40 to-slate-50 border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 flex flex-col justify-between overflow-hidden select-none">
      {/* Background route line */}
      <svg className="absolute inset-0 w-full h-full stroke-cyan-200/60 fill-none pointer-events-none" aria-hidden="true">
        <path d="M 40,40 Q 200,120 360,200" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* Floating Card Fragments */}
      <motion.div
        initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isReducedMotion ? 0 : 0.4 }}
        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 font-mono font-bold text-xs">
            01
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Vehicle Profile Created</p>
            <p className="text-[11px] text-slate-500 font-mono">2022 Porsche Taycan 4S</p>
          </div>
        </div>
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      </motion.div>

      <motion.div
        initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isReducedMotion ? 0 : 0.5, delay: isReducedMotion ? 0 : 0.1 }}
        className="p-3.5 rounded-xl bg-slate-900 text-white shadow-md flex items-center justify-between z-10 font-mono text-xs"
      >
        <div className="flex items-center gap-2.5">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="font-semibold text-white text-xs">Job Card #AS-JC-260884</p>
            <p className="text-[10px] text-slate-300">Bay 3 • Tech #3 Assigned</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/40">
          Verified
        </span>
      </motion.div>

      <motion.div
        initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isReducedMotion ? 0 : 0.6, delay: isReducedMotion ? 0 : 0.2 }}
        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#F4512C]" />
          <div>
            <p className="text-xs font-bold text-slate-900">Itemized Statement #AS-INV-260884</p>
            <p className="text-[11px] text-slate-500 font-mono">Total Payable: ₹14,691.00</p>
          </div>
        </div>
        <ShieldCheck className="w-4 h-4 text-cyan-600" />
      </motion.div>
    </div>
  );
};
