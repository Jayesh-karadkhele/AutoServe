import React from 'react';
import { Camera, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const EvidencePreview: React.FC = () => {
  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • REPAIR EVIDENCE" badgeText="PREVIEW • STEP 04" badgeVariant="cyan">
      <div className="space-y-3 text-xs font-mono-tech">
        <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#00A7B5]" />
            <span className="font-semibold text-[#17212B]">3 PHOTOS & 1 DIAGNOSTIC CLIP</span>
          </div>
          <span className="text-[10px] text-[#178A68] font-bold">STAMPED</span>
        </div>

        {/* Photographic Placeholders Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl space-y-1.5">
            <div className="h-16 bg-[#E5EBEE] rounded-lg border border-dashed border-[#17212B]/20 flex items-center justify-center text-[#66737E]">
              <Camera className="w-5 h-5 text-[#00A7B5]" />
            </div>
            <div className="font-semibold text-[#17212B]">Front Brake Pad Wear</div>
            <div className="text-[10px] text-[#66737E]">10:42 AM • 3mm remaining</div>
          </div>

          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl space-y-1.5">
            <div className="h-16 bg-[#EAF7FA] rounded-lg border border-[#00A7B5]/30 flex items-center justify-center text-[#00A7B5]">
              <CheckCircle className="w-5 h-5 text-[#178A68]" />
            </div>
            <div className="font-semibold text-[#17212B]">New OEM Rotor Replacement</div>
            <div className="text-[10px] text-[#178A68]">11:15 AM • Replaced</div>
          </div>
        </div>

        <div className="p-2.5 bg-[#EAF7FA] border border-[#00A7B5]/20 rounded-xl flex items-center justify-between text-[11px] text-[#00A7B5]">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Inspection Notes: Verified by Manager</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-[#178A68]" />
        </div>
      </div>
    </ProductWindow>
  );
};
