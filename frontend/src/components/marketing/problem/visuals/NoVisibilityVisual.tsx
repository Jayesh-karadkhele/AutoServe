import React from 'react';
import { EyeOff, Lock } from 'lucide-react';

export const NoVisibilityVisual: React.FC = () => {
  return (
    <div className="w-full h-48 bg-[#F7F5EF] rounded-xl p-4 border border-[#17212B]/10 flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#66737E]">
        <span>WORKSHOP BAY #03</span>
        <span className="text-[#E89B24] font-semibold">VIEW RESTRICTED</span>
      </div>

      {/* Obscured Layer Graphic */}
      <div className="relative my-auto h-20 rounded-lg bg-[#E5EBEE] border border-[#17212B]/12 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[#17212B]/05 backdrop-blur-[2px] flex items-center justify-center flex-col gap-1.5 text-center p-2">
          <div className="flex items-center gap-2 text-[#66737E]">
            <Lock className="w-4 h-4 text-[#E89B24]" />
            <EyeOff className="w-4 h-4 text-[#66737E]" />
          </div>
          <span className="text-[11px] font-mono-tech text-[#17212B] font-medium">
            NO PHOTO EVIDENCE ATTACHED
          </span>
        </div>
      </div>

      <div className="p-2 rounded bg-white border border-[#17212B]/08 text-[11px] font-mono-tech text-[#66737E] flex items-center justify-between">
        <span>REPLACED PARTS PROOF:</span>
        <span className="text-[#E89B24]">UNVERIFIED</span>
      </div>
    </div>
  );
};
