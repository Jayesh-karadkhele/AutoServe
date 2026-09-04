import React from 'react';
import { Users, FileCheck, AlertTriangle } from 'lucide-react';

export const ManagerWorkspacePreview: React.FC = () => {
  return (
    <div className="space-y-4 text-xs font-mono-tech select-none">
      {/* Header Operational Desk Summary */}
      <div className="p-4 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-[#00A7B5] font-bold uppercase tracking-wider">SERVICE DESK</div>
          <div className="text-sm font-display font-bold text-[#17212B]">David Miller • Service Manager</div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-white border border-[#17212B]/10 px-2.5 py-1 rounded font-semibold text-[#17212B]">
            4 Active Jobs
          </span>
          <span className="bg-[#F4512C]/10 border border-[#F4512C]/20 px-2.5 py-1 rounded font-semibold text-[#F4512C]">
            1 Unassigned
          </span>
        </div>
      </div>

      {/* Unassigned Request Action Card */}
      <div className="p-3 bg-white border border-[#F4512C]/30 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#F4512C]" />
          <div>
            <div className="font-semibold text-[#17212B]">Unassigned Slot: Toyota Camry (MH 12 AB 9421)</div>
            <div className="text-[10px] text-[#66737E]">Requested 10:00 AM • Regular Service</div>
          </div>
        </div>
        <span className="text-[10px] bg-[#F4512C] text-white px-2.5 py-1 rounded font-bold">
          ASSIGN BAY & MECHANIC
        </span>
      </div>

      {/* Mechanic Roster & Job Cards Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <Users className="w-4 h-4 text-[#00A7B5]" />
              MECHANIC ROSTER (2)
            </span>
            <span className="text-[10px] text-[#178A68] font-semibold">ALL ACTIVE</span>
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between p-1.5 rounded bg-[#F2F7F8]">
              <span>Alex Rivera • Bay #03</span>
              <span className="text-[#F4512C] font-semibold">Active JC-2026-89</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-[#F2F7F8]">
              <span>Priya Sharma • Bay #01</span>
              <span className="text-[#178A68] font-semibold">Available</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#17212B]/10 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-[#17212B]">
              <FileCheck className="w-4 h-4 text-[#178A68]" />
              EVIDENCE AWAITING VERIFICATION
            </span>
            <span className="text-[10px] text-[#00A7B5] font-bold">1 READY</span>
          </div>
          <div className="p-2 bg-[#EAF7FA] rounded border border-[#00A7B5]/20 text-[10px] text-[#00A7B5] flex items-center justify-between">
            <span>Brake Pad Photo Uploaded 11:15 AM</span>
            <span className="font-bold underline">VERIFY & LOCK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
