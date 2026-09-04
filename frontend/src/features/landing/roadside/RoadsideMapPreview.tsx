import type { RsaStageData } from './roadsideData';
import { Truck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

interface RoadsideMapPreviewProps {
  stage?: RsaStageData;
}

export const RoadsideMapPreview: React.FC<RoadsideMapPreviewProps> = () => {
  const isReducedMotion = useReducedMotionContext();

  return (
    <div className="relative w-full h-72 sm:h-80 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden select-none shadow-inner p-4 flex flex-col justify-between">
      {/* Top Map Header Overlay */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Planned capability preview
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
            Abstract City Geometry
          </span>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
          Illustrative estimate: 14 mins
        </span>
      </div>

      {/* Code-Native SVG Map Canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full stroke-slate-800 fill-none"
          aria-label="Planned Roadside Assistance SVG Route Map"
        >
          {/* Abstract City Grid Geometry Lines */}
          <line x1="0" y1="60" x2="400" y2="60" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="400" y2="120" strokeWidth="1.5" className="stroke-slate-700/60" />
          <line x1="0" y1="180" x2="400" y2="180" strokeWidth="1" strokeDasharray="4 4" />

          <line x1="80" y1="0" x2="80" y2="240" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2="240" strokeWidth="1.5" className="stroke-slate-700/60" />
          <line x1="320" y1="0" x2="320" y2="240" strokeWidth="1" strokeDasharray="4 4" />

          {/* Planned Route Curved Line */}
          <path
            d="M 80,180 Q 140,120 200,120 T 320,60"
            stroke="#00A7B5"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-90"
          />

          {/* Customer Vehicle Marker (Start Point) */}
          <g transform="translate(80, 180)">
            <circle r="12" fill="#F4512C" fillOpacity="0.2" stroke="#F4512C" strokeWidth="1.5" />
            <circle r="5" fill="#F4512C" />
            <text x="18" y="4" fill="#F7F5EF" fontSize="10" className="font-mono font-bold">
              Vehicle Location (Porsche Taycan 4S)
            </text>
          </g>

          {/* AutoServe Assistance Point Marker (End Point) */}
          <g transform="translate(320, 60)">
            <circle r="12" fill="#178A68" fillOpacity="0.2" stroke="#178A68" strokeWidth="1.5" />
            <circle r="5" fill="#178A68" />
            <text x="-140" y="-10" fill="#38bdf8" fontSize="10" className="font-mono font-bold">
              AutoServe assistance point (Metro Hub)
            </text>
          </g>
        </svg>
      </div>

      {/* Dynamic Dispatch Token Along Route */}
      <motion.div
        initial={isReducedMotion ? { left: '50%', top: '50%' } : { left: '20%', top: '70%' }}
        animate={isReducedMotion ? { left: '50%', top: '50%' } : { left: '50%', top: '50%' }}
        transition={{ duration: isReducedMotion ? 0 : 3, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 z-10 pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Truck className="w-4 h-4 stroke-[2.5]" />
      </motion.div>

      {/* Map Footer Key / Legend */}
      <div className="flex items-center justify-between z-10 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4512C]" />
            Vehicle location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#178A68]" />
            AutoServe assistance point
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#00A7B5]" />
            Route preview
          </span>
        </div>
        <span className="text-slate-500 hidden sm:inline">Planned dispatch simulation</span>
      </div>
    </div>
  );
};
