import React from 'react';
import { NavigationOff, AlertTriangle } from 'lucide-react';

export const RoadsideUncertaintyVisual: React.FC = () => {
  return (
    <div className="w-full h-48 bg-[#F7F5EF] rounded-xl p-4 border border-[#17212B]/10 flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#66737E]">
        <span>ROADSIDE DISPATCH #RSA-091</span>
        <span className="text-[#D84D4D] font-semibold">NO DISPATCHER ID</span>
      </div>

      {/* Incomplete Route Map Graphic */}
      <div className="relative my-auto h-20 bg-white rounded-lg border border-[#17212B]/12 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D84D4D]/10 text-[#D84D4D] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono-tech font-semibold text-[#17212B]">Stranded Driver</div>
            <div className="text-[10px] text-[#66737E]">Location: Highway KM 42</div>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1 text-[10px] font-mono-tech text-[#D84D4D]">
            <NavigationOff className="w-3.5 h-3.5" />
            <span>NO LIVE TRACK</span>
          </div>
          <span className="text-[10px] text-[#66737E]">ETA: UNKNOWN</span>
        </div>
      </div>

      <div className="p-2 rounded bg-white border border-[#17212B]/08 text-[11px] font-mono-tech text-[#66737E] flex items-center justify-between">
        <span>ASSIGNED MECHANIC:</span>
        <span className="text-[#D84D4D]">PENDING MANUAL CALL</span>
      </div>
    </div>
  );
};
