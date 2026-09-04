import React from 'react';

export const SurpriseCostsVisual: React.FC = () => {
  return (
    <div className="w-full h-48 bg-[#F7F5EF] rounded-xl p-4 border border-[#17212B]/10 flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#66737E]">
        <span>ESTIMATE COMPARISON</span>
        <span className="text-[#D84D4D] font-semibold">+68% UNANNOUNCED</span>
      </div>

      {/* Invoice Discrepancy Bar Graphic */}
      <div className="space-y-3 my-auto">
        <div>
          <div className="flex justify-between text-[11px] font-mono-tech mb-1">
            <span className="text-[#66737E]">Initial Verbal Quote:</span>
            <span className="text-[#17212B] font-medium">₹ 4,500</span>
          </div>
          <div className="w-full h-3 bg-[#E5EBEE] rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-[#00A7B5] rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-mono-tech mb-1">
            <span className="text-[#D84D4D] font-semibold">Final Pickup Bill:</span>
            <span className="text-[#D84D4D] font-bold">₹ 7,560</span>
          </div>
          <div className="w-full h-3 bg-[#E5EBEE] rounded-full overflow-hidden relative">
            <div className="w-full h-full bg-[#D84D4D] rounded-full" />
            <div className="absolute top-0 right-0 bottom-0 left-[40%] bg-stripes-danger opacity-40" />
          </div>
        </div>
      </div>

      <div className="p-2 rounded bg-white border border-[#17212B]/08 text-[11px] font-mono-tech text-[#66737E] flex items-center justify-between">
        <span>EXPLANATION ATTACHED:</span>
        <span className="text-[#D84D4D]">NONE PROVIDED</span>
      </div>
    </div>
  );
};
