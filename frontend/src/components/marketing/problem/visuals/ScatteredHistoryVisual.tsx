import React from 'react';
import { FileQuestion, Layers, FileWarning } from 'lucide-react';

export const ScatteredHistoryVisual: React.FC = () => {
  return (
    <div className="w-full h-48 bg-[#F7F5EF] rounded-xl p-4 border border-[#17212B]/10 flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#66737E]">
        <span>VEHICLE SERVICE RECORDS</span>
        <span className="text-[#F4512C] font-semibold">FRAGMENTED</span>
      </div>

      {/* Dispersed Document Cards */}
      <div className="relative my-auto h-20">
        <div className="absolute top-0 left-2 w-36 p-2 rounded bg-white border border-[#17212B]/15 shadow-xs -rotate-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#17212B]">
            <FileQuestion className="w-3 h-3 text-[#F4512C]" />
            <span>2024 Invoice (Paper)</span>
          </div>
        </div>

        <div className="absolute top-4 right-2 w-36 p-2 rounded bg-[#F2F7F8] border border-[#17212B]/15 shadow-xs rotate-6">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#66737E]">
            <Layers className="w-3 h-3 text-[#00A7B5]" />
            <span>WhatsApp Notes</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-12 w-40 p-2 rounded bg-white border border-[#17212B]/20 shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#D84D4D]">
            <FileWarning className="w-3 h-3" />
            <span>Missing Brake Check Record</span>
          </div>
        </div>
      </div>

      <div className="p-2 rounded bg-white border border-[#17212B]/08 text-[11px] font-mono-tech text-[#66737E] flex items-center justify-between">
        <span>CENTRALIZED VAULT:</span>
        <span className="text-[#F4512C]">DISCONNECTED</span>
      </div>
    </div>
  );
};
