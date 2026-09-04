import React from 'react';
import { Car, Calendar, Camera, Receipt, Clock, CheckCircle2, Plus, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CustomerWorkspacePreview: React.FC = () => {
  return (
    <div className="space-y-4 text-xs font-mono-tech select-none">
      {/* Greeting & Active Vehicle Summary */}
      <div className="p-4 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-[#00A7B5] font-bold uppercase tracking-wider">WELCOME BACK</div>
          <div className="text-sm font-display font-bold text-[#17212B]">Sarah Jenkins • Vehicle Owner</div>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/register" variant="primary" size="sm" className="text-[11px] px-3 py-1.5">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Book Service
          </Button>
          <Button href="/register" variant="outline" size="sm" className="text-[11px] px-3 py-1.5 text-[#F4512C]">
            <PhoneCall className="w-3.5 h-3.5 mr-1" />
            RSA Request
          </Button>
        </div>
      </div>

      {/* Vehicle & Active Appointment Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <Car className="w-4 h-4 text-[#00A7B5]" />
              MY VEHICLES (1)
            </span>
            <span className="text-[10px] text-[#178A68] bg-[#178A68]/10 px-2 py-0.5 rounded font-bold">PRIMARY</span>
          </div>
          <div className="font-semibold text-[#17212B]">Toyota Camry (2022)</div>
          <div className="text-[10px] text-[#66737E]">MH 12 AB 9421 • 32,450 KM • Petrol</div>
        </div>

        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <Calendar className="w-4 h-4 text-[#F4512C]" />
              UPCOMING SERVICE
            </span>
            <span className="text-[10px] text-[#F4512C] font-bold">CONFIRMED</span>
          </div>
          <div className="font-semibold text-[#17212B]">15 OCT 2026 • 10:00 AM</div>
          <div className="text-[10px] text-[#66737E]">30k Inspection & Oil Change</div>
        </div>
      </div>

      {/* Live Timeline & Evidence Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <Clock className="w-4 h-4 text-[#00A7B5]" />
              LIVE SERVICE TIMELINE
            </span>
            <span className="text-[10px] text-[#F4512C] font-bold animate-pulse">● LIVE</span>
          </div>
          <div className="p-2 bg-[#EAF7FA] rounded-lg border border-[#00A7B5]/20 text-[11px] text-[#00A7B5] font-semibold flex items-center justify-between">
            <span>ACTIVE: Repair Execution</span>
            <span>ETA: 01:00 PM</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <Camera className="w-4 h-4 text-[#178A68]" />
              REPAIR EVIDENCE (2)
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#178A68]" />
          </div>
          <div className="text-[10px] text-[#66737E]">
            OEM Front Brake Pad Stamped 11:15 AM (Verified by Manager)
          </div>
        </div>
      </div>

      {/* Pending Invoice Summary */}
      <div className="p-3 bg-[#EAF7FA]/50 rounded-xl border border-[#00A7B5]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#00A7B5]" />
          <span className="font-semibold text-[#17212B]">Latest Invoice #INV-2026-89</span>
        </div>
        <span className="font-bold text-[#F4512C]">₹ 4,366.00 (Ready)</span>
      </div>
    </div>
  );
};
