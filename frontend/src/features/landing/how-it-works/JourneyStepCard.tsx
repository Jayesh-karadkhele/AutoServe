import React from 'react';
import { Surface } from '@/components/ui/Surface';
import { JourneyStepPreview } from './JourneyStepPreview';
import type { JourneyStep } from './howItWorksData';
import { cn } from '@/lib/utils';

interface JourneyStepCardProps {
  step: JourneyStep;
  isActive: boolean;
  onSelect: () => void;
}

export const JourneyStepCard: React.FC<JourneyStepCardProps> = ({
  step,
  isActive,
  onSelect,
}) => {
  return (
    <Surface
      variant="surface"
      elevation={isActive ? 'sm' : 'none'}
      onClick={onSelect}
      className={cn(
        'p-6 sm:p-8 transition-all cursor-pointer select-none',
        isActive
          ? 'border-[#00A7B5] bg-white ring-2 ring-[#00A7B5]/20 shadow-md'
          : 'border-[#17212B]/10 bg-white/70 hover:border-[#17212B]/25 hover:bg-white'
      )}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#17212B] text-white text-xs font-mono-tech font-bold flex items-center justify-center">
            {step.num}
          </span>
          <h3 className="text-xl font-display font-semibold text-[#17212B]">
            {step.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {step.roles.map((r) => (
            <span
              key={r}
              className="text-[10px] font-mono-tech font-medium uppercase px-2 py-0.5 rounded bg-[#F2F7F8] border border-[#17212B]/08 text-[#66737E]"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs font-mono-tech">
        <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#17212B]/06 space-y-1">
          <span className="text-[#66737E] font-semibold block">CUSTOMER ACTION:</span>
          <p className="text-[#17212B] leading-relaxed">{step.customerAction}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#EAF7FA]/50 border border-[#00A7B5]/20 space-y-1">
          <span className="text-[#00A7B5] font-semibold block">AUTOSERVE SYSTEM:</span>
          <p className="text-[#17212B] leading-relaxed">{step.autoServeCoordination}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#178A68]/05 border border-[#178A68]/20 space-y-1">
          <span className="text-[#178A68] font-semibold block">FINAL OUTCOME:</span>
          <p className="text-[#17212B] leading-relaxed">{step.outcome}</p>
        </div>
      </div>

      {/* Embedded Step Preview */}
      <JourneyStepPreview step={step} />
    </Surface>
  );
};
