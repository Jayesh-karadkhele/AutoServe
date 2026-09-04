import React from 'react';
import { Calendar, Car, Wrench, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const BookingPreview: React.FC = () => {
  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • APPOINTMENT BOOKING" badgeText="PREVIEW • STEP 01" badgeVariant="cyan">
      <div className="space-y-4 text-xs font-mono-tech">
        {/* Selected Vehicle Card */}
        <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#17212B]/10 flex items-center justify-center text-[#00A7B5]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#17212B]">Toyota Camry (2022)</div>
              <div className="text-[10px] text-[#66737E]">MH 12 AB 9421 • Regular Service</div>
            </div>
          </div>
          <span className="text-[10px] text-[#178A68] font-semibold bg-[#178A68]/10 px-2 py-0.5 rounded">VERIFIED</span>
        </div>

        {/* Date & Problem Description */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl">
            <div className="text-[10px] text-[#66737E] flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#00A7B5]" />
              <span>PREFERRED DATE</span>
            </div>
            <div className="font-medium text-[#17212B]">15 OCT 2026 • 10:00 AM</div>
          </div>

          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl">
            <div className="text-[10px] text-[#66737E] flex items-center gap-1.5 mb-1">
              <Wrench className="w-3.5 h-3.5 text-[#F4512C]" />
              <span>SERVICE TYPE</span>
            </div>
            <div className="font-medium text-[#17212B]">30k Full Inspection</div>
          </div>
        </div>

        {/* Photo Attachment & Review Step */}
        <div className="p-3 bg-[#EAF7FA]/50 rounded-xl border border-[#00A7B5]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#66737E]">
            <ImageIcon className="w-4 h-4 text-[#00A7B5]" />
            <span>Attachment: brake_sound.mp4 (Attached)</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#178A68]" />
        </div>

        <div className="p-2.5 bg-[#17212B] text-white rounded-xl text-center font-display font-medium text-xs">
          READY FOR MANAGER CONFIRMATION →
        </div>
      </div>
    </ProductWindow>
  );
};
