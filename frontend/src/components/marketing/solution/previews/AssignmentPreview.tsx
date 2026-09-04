import React from 'react';
import { UserCheck, Shield, Wrench, CheckCircle } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const AssignmentPreview: React.FC = () => {
  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • ROLE ASSIGNMENT" badgeText="PREVIEW • STEP 02" badgeVariant="success">
      <div className="space-y-3 text-xs font-mono-tech">
        {/* Customer & Vehicle Header */}
        <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
          <span className="text-[#66737E]">APPOINTMENT #AS-9421</span>
          <span className="text-[#178A68] font-bold">STATUS: ASSIGNED</span>
        </div>

        {/* Assigned Team Grid */}
        <div className="space-y-2">
          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#EAF7FA] text-[#00A7B5] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-[#17212B]">David Miller</div>
                <div className="text-[10px] text-[#66737E]">Assigned Service Manager</div>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-[#178A68]" />
          </div>

          <div className="p-3 bg-white border border-[#17212B]/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#F4512C]/10 text-[#F4512C] flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-[#17212B]">Alex Rivera</div>
                <div className="text-[10px] text-[#66737E]">Lead Mechanic • Workshop Bay 3</div>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-[#178A68]" />
          </div>
        </div>

        <div className="p-2.5 bg-[#EAF7FA] border border-[#00A7B5]/20 rounded-xl text-[#00A7B5] text-[11px] flex items-center gap-2">
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>RESPONSIBILITY LOGGED • ALL TEAMS NOTIFIED</span>
        </div>
      </div>
    </ProductWindow>
  );
};
