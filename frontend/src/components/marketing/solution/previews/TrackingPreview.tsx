import React from 'react';
import { Clock, CheckCircle2, Loader2, User } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const TrackingPreview: React.FC = () => {
  const steps = [
    { label: 'BOOKED', status: 'done', time: '10:00 AM' },
    { label: 'INSPECTED', status: 'done', time: '10:30 AM' },
    { label: 'REPAIR IN PROGRESS', status: 'active', time: 'LIVE' },
    { label: 'QUALITY CHECK', status: 'pending', time: 'EST 12:30 PM' },
    { label: 'READY', status: 'pending', time: 'EST 01:00 PM' },
  ];

  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • LIVE TRACKING" badgeText="PREVIEW • STEP 03" badgeVariant="orange">
      <div className="space-y-4 text-xs font-mono-tech">
        <div className="flex items-center justify-between p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F4512C]" />
            <span className="font-semibold text-[#17212B]">ESTIMATED FINISH: 01:00 PM</span>
          </div>
          <span className="text-[10px] text-[#F4512C] font-bold animate-pulse">● LIVE UPDATE</span>
        </div>

        {/* Timeline Progress Bar */}
        <div className="space-y-2 py-1">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#17212B]/06">
              <div className="flex items-center gap-2.5">
                {step.status === 'done' && <CheckCircle2 className="w-4 h-4 text-[#178A68]" />}
                {step.status === 'active' && <Loader2 className="w-4 h-4 text-[#F4512C] animate-spin" />}
                {step.status === 'pending' && <div className="w-4 h-4 rounded-full border border-dashed border-[#66737E]" />}
                <span className={step.status === 'active' ? 'font-bold text-[#F4512C]' : 'text-[#17212B]'}>
                  {step.label}
                </span>
              </div>
              <span className="text-[10px] text-[#66737E]">{step.time}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-white border border-[#17212B]/10 rounded-xl flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-[#66737E]">
            <User className="w-3.5 h-3.5 text-[#00A7B5]" />
            <span>Lead Mechanic: Alex Rivera</span>
          </div>
          <span className="text-[#00A7B5] font-semibold">BAY #03</span>
        </div>
      </div>
    </ProductWindow>
  );
};
