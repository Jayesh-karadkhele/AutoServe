import React from 'react';

export const TimelineFragmentVisual: React.FC = () => {
  return (
    <div className="w-full h-48 bg-[#F7F5EF] rounded-xl p-4 border border-[#17212B]/10 flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#66737E]">
        <span>SERVICE EVENT #4092</span>
        <span className="text-[#F4512C] font-semibold">SIGNAL LOST</span>
      </div>

      {/* Disconnected Fragmented Timeline */}
      <div className="relative py-4 my-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 border-b border-dashed border-[#17212B]/20 -translate-y-1/2" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#17212B] text-white text-[10px] font-mono-tech flex items-center justify-center font-bold">
              01
            </div>
            <span className="text-[10px] font-mono-tech text-[#17212B]">DROP-OFF</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 opacity-40">
            <div className="w-6 h-6 rounded-full bg-white border border-dashed border-[#17212B] text-[10px] font-mono-tech flex items-center justify-center">
              ?
            </div>
            <span className="text-[10px] font-mono-tech text-[#66737E]">INSPECTION</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <div className="w-6 h-6 rounded-full bg-white border border-dashed border-[#17212B] text-[10px] font-mono-tech flex items-center justify-center">
              ?
            </div>
            <span className="text-[10px] font-mono-tech text-[#66737E]">REPAIR</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#F4512C]/20 border border-[#F4512C] text-[#F4512C] text-[10px] font-mono-tech flex items-center justify-center font-bold">
              !
            </div>
            <span className="text-[10px] font-mono-tech text-[#F4512C] font-semibold">UNKNOWN</span>
          </div>
        </div>
      </div>

      <div className="p-2 rounded bg-white border border-[#17212B]/08 text-[11px] font-mono-tech text-[#66737E] flex items-center justify-between">
        <span>STATUS UPDATES:</span>
        <span className="text-[#F4512C]">0 SENT IN 5 HOURS</span>
      </div>
    </div>
  );
};
