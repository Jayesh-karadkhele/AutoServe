import React from 'react';
import { Navigation, PhoneCall, ShieldCheck } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const RsaPreview: React.FC = () => {
  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • ROADSIDE ASSISTANCE" badgeText="PREVIEW • STEP 06" badgeVariant="cyan">
      <div className="space-y-3 text-xs font-mono-tech">
        <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#F4512C]" />
            <span className="font-semibold text-[#17212B]">RSA REQUEST #RSA-9402</span>
          </div>
          <span className="text-[10px] text-[#F4512C] font-bold animate-pulse">DISPATCHED</span>
        </div>

        {/* Location & Driver Details */}
        <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#66737E]">GPS LOCATION:</span>
            <span className="text-[#17212B] font-semibold">18.5204° N, 73.8567° E</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#66737E]">VEHICLE:</span>
            <span className="text-[#17212B]">Toyota Camry • MH 12 AB 9421</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#66737E]">ASSIGNED MECHANIC:</span>
            <span className="text-[#00A7B5] font-semibold">Alex Rivera (Flatbed Tow)</span>
          </div>
        </div>

        {/* Stylized Code-Native Route Preview */}
        <div className="p-3 bg-[#EAF7FA] border border-[#00A7B5]/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00A7B5]">
            <Navigation className="w-4 h-4" />
            <span className="font-semibold">ESTIMATED ARRIVAL: 14 MINS</span>
          </div>
          <PhoneCall className="w-4 h-4 text-[#178A68]" />
        </div>

        <div className="p-2 bg-white border border-[#17212B]/08 rounded-lg text-[10px] text-[#66737E] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#178A68]" />
            Location synced with active manager
          </span>
          <span className="text-[#178A68] font-semibold">RESOLVING</span>
        </div>
      </div>
    </ProductWindow>
  );
};
