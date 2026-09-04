import React from 'react';
import { Car, Calendar, Shield, Wrench, Camera, Receipt, CheckCircle, Star } from 'lucide-react';
import type { JourneyStep } from './howItWorksData';

interface JourneyStepPreviewProps {
  step: JourneyStep;
}

export const JourneyStepPreview: React.FC<JourneyStepPreviewProps> = ({ step }) => {
  return (
    <div className="bg-white border border-[#17212B]/12 rounded-2xl p-5 shadow-xs select-none">
      <div className="flex items-center justify-between border-b border-[#17212B]/08 pb-3 mb-4 text-xs font-mono-tech">
        <span className="font-semibold text-[#17212B]">{step.previewTitle}</span>
        <span className="text-[#00A7B5] bg-[#EAF7FA] px-2 py-0.5 rounded font-bold">
          STEP {step.num}
        </span>
      </div>

      {step.num === '01' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-[#00A7B5]" />
              <div>
                <div className="font-semibold text-[#17212B]">Toyota Camry (2022)</div>
                <div className="text-[10px] text-[#66737E]">MH 12 AB 9421 • 32,450 KM</div>
              </div>
            </div>
            <span className="text-[10px] text-[#178A68] bg-[#178A68]/10 px-2 py-0.5 rounded font-bold">PROFILE ACTIVE</span>
          </div>
          <div className="p-2 bg-white border border-[#17212B]/08 rounded-lg text-[10px] text-[#66737E] flex justify-between">
            <span>VIN: 4T1B11HK5NW****</span>
            <span>FUEL: PETROL</span>
          </div>
        </div>
      )}

      {step.num === '02' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#66737E]">SERVICE SLOT:</span>
              <span className="text-[#17212B] font-semibold">15 OCT 2026 • 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#66737E]">SERVICE TYPE:</span>
              <span className="text-[#F4512C] font-semibold">Full 30k Inspection & Oil</span>
            </div>
          </div>
          <div className="p-2 bg-[#EAF7FA] rounded-lg border border-[#00A7B5]/20 text-[10px] text-[#00A7B5] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>SLOT REQUESTED • AWAITING MANAGER APPROVAL</span>
          </div>
        </div>
      )}

      {step.num === '03' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-[#17212B]">
                <Shield className="w-3.5 h-3.5 text-[#00A7B5]" />
                Manager: David Miller
              </span>
              <span className="text-[#178A68] font-bold">BAY #03</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-[#17212B]">
                <Wrench className="w-3.5 h-3.5 text-[#F4512C]" />
                Mechanic: Alex Rivera
              </span>
              <span className="text-[#178A68] font-bold">ASSIGNED</span>
            </div>
          </div>
        </div>
      )}

      {step.num === '04' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#17212B]">JOB CARD #JC-2026-89</span>
              <span className="text-[#F4512C] font-bold">IN PROGRESS</span>
            </div>
            <div className="text-[11px] text-[#66737E]">
              Diagnostic: Front brake pad wear detected (3mm left). Replaced OEM pads & bled brake fluid.
            </div>
          </div>
        </div>
      )}

      {step.num === '05' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-[#EAF7FA]/60 border border-[#00A7B5]/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#00A7B5]" />
              <span className="font-semibold text-[#17212B]">2 Photos Verified</span>
            </div>
            <span className="text-[10px] text-[#178A68] font-bold">MANAGER APPROVED</span>
          </div>
        </div>
      )}

      {step.num === '06' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#178A68]" />
              <span className="font-semibold text-[#17212B]">Invoice #INV-2026-89</span>
            </div>
            <span className="font-bold text-[#F4512C]">₹ 4,366.00</span>
          </div>
        </div>
      )}

      {step.num === '07' && (
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="p-3 bg-[#17212B] text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#178A68]" />
              <span className="font-semibold">SERVICE COMPLETED</span>
            </div>
            <div className="flex items-center text-[#E89B24]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
