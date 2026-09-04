import React, { useState } from 'react';
import type { EvidenceStageData } from './evidenceData';
import { Sliders, Eye, ArrowRightLeft } from 'lucide-react';

interface EvidenceComparisonProps {
  stage: EvidenceStageData;
}

export const EvidenceComparison: React.FC<EvidenceComparisonProps> = ({ stage }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="space-y-4">
      {/* Visual Canvas Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden select-none shadow-inner">
        {/* BEFORE Layer (Underneath / Left side) */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-semibold uppercase tracking-wider">
              BEFORE — {stage.beforeLabel}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ref: {stage.id}-pre</span>
          </div>

          {/* SVG Code-Native Before Schematic (Worn Rotor / Wear Pattern) */}
          <div className="my-auto mx-auto w-full max-w-xs flex flex-col items-center justify-center opacity-85">
            <svg viewBox="0 0 200 120" className="w-48 h-28 stroke-amber-400/80 fill-none" aria-hidden="true">
              <circle cx="100" cy="60" r="50" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="100" cy="60" r="35" strokeWidth="1.5" className="stroke-amber-500/60" />
              <circle cx="100" cy="60" r="15" fill="#1e293b" strokeWidth="2" />
              {/* Wear grooves micro details */}
              <path d="M 60,60 Q 100,20 140,60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 3" />
              <path d="M 65,70 Q 100,30 135,70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 2" />
              <text x="100" y="64" textAnchor="middle" fill="#fcd34d" fontSize="9" className="font-mono">
                WEAR: 22.8mm
              </text>
            </svg>
            <span className="text-[11px] font-mono text-amber-300/90 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20 mt-1">
              Surface Wear & Friction Glaze Detected
            </span>
          </div>
        </div>

        {/* AFTER Layer (Clipped over top based on sliderPos %) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-950/90 via-slate-900 to-emerald-950/80 flex flex-col justify-between p-4 border-r border-cyan-400/50"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-semibold uppercase tracking-wider">
              AFTER — {stage.afterLabel}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ref: {stage.id}-post</span>
          </div>

          {/* SVG Code-Native After Schematic (Precision Machined & Fitted Pad) */}
          <div className="my-auto mx-auto w-full max-w-xs flex flex-col items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-48 h-28 stroke-cyan-400 fill-none" aria-hidden="true">
              <circle cx="100" cy="60" r="50" strokeWidth="2.5" className="stroke-cyan-400" />
              <circle cx="100" cy="60" r="35" strokeWidth="2" className="stroke-emerald-400" />
              <circle cx="100" cy="60" r="15" fill="#0f172a" strokeWidth="2.5" />
              {/* Smooth friction pattern */}
              <circle cx="100" cy="60" r="42" stroke="#00A7B5" strokeWidth="1" opacity="0.6" />
              <text x="100" y="64" textAnchor="middle" fill="#38bdf8" fontSize="9" className="font-mono font-bold">
                SPEC: 24.5mm PASSED
              </text>
            </svg>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mt-1">
              New Ceramic Pad Set Fitted & Torqued
            </span>
          </div>
        </div>

        {/* Vertical Divider Indicator Bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none shadow-[0_0_10px_#00A7B5]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-md flex items-center justify-center text-slate-950">
            <Sliders className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Native Range Slider Input (Leverages browser native keyboard arrows seamlessly without double-stepping) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Before (0%)</span>
          <span className="font-semibold text-slate-800">Visual Slider ({sliderPos}%)</span>
          <span>After (100%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Before and after repair evidence slider"
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        />
      </div>

      {/* Explicit Accessible Button Controls (Required per accessibility fallback specification) */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          onClick={() => setSliderPos(0)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            sliderPos === 0
              ? 'bg-amber-500 text-white border-amber-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          View before
        </button>

        <button
          onClick={() => setSliderPos(50)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            sliderPos === 50
              ? 'bg-cyan-600 text-white border-cyan-700 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Compare (50/50)
        </button>

        <button
          onClick={() => setSliderPos(100)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            sliderPos === 100
              ? 'bg-emerald-600 text-white border-emerald-700 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          View after
        </button>
      </div>

      {/* Text Explanation Below Comparison */}
      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
        <span className="font-semibold text-slate-900">Stage Evidence Context: </span>
        {stage.customerExplanation}
      </p>
    </div>
  );
};
