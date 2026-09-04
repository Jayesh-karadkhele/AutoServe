import React from 'react';
import { motion } from 'motion/react';
import { JourneyStepData } from './howItWorksData';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';
import { cn } from '@/lib/utils';

interface ServiceJourneyRailProps {
  activeIdx: number;
  onSelectStep: (idx: number) => void;
}

export const ServiceJourneyRail: React.FC<ServiceJourneyRailProps> = ({
  activeIdx,
  onSelectStep,
}) => {
  const isReducedMotion = useReducedMotionContext();
  const steps = JourneyStepData.steps;

  // Calculate percentage along route (0% to 100%)
  const progressPct = (activeIdx / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-12 select-none">
      {/* Desktop Horizontal SVG Service Lane */}
      <div className="hidden lg:block relative py-6 px-4 bg-white border border-[#17212B]/10 rounded-2xl shadow-xs">
        <div className="relative flex items-center justify-between z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(idx)}
                aria-label={`Step ${step.num}: ${step.title}`}
                className="flex flex-col items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] rounded-lg p-1.5 min-w-[44px] min-h-[44px]"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full font-mono-tech text-xs font-bold flex items-center justify-center transition-all border-2',
                    isActive
                      ? 'bg-[#F4512C] text-white border-[#F4512C] shadow-md scale-110'
                      : isCompleted
                      ? 'bg-[#178A68] text-white border-[#178A68]'
                      : 'bg-[#F2F7F8] text-[#66737E] border-[#17212B]/15 group-hover:border-[#00A7B5]'
                  )}
                >
                  {step.num}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-mono-tech max-w-[100px] text-center truncate transition-colors',
                    isActive
                      ? 'text-[#17212B] font-bold'
                      : isCompleted
                      ? 'text-[#178A68] font-medium'
                      : 'text-[#66737E]'
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Route Line & Vehicle Token Progress */}
        <div className="absolute top-[38%] left-8 right-8 h-1 bg-[#E5EBEE] rounded-full overflow-hidden z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F4512C] via-[#00A7B5] to-[#178A68] rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: isReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          />
        </div>
      </div>

      {/* Mobile Vertical Checkpoint Bar */}
      <div className="flex lg:hidden overflow-x-auto gap-2 py-2 no-scrollbar" role="tablist">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            role="tab"
            aria-selected={activeIdx === idx}
            onClick={() => onSelectStep(idx)}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-mono-tech whitespace-nowrap transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer border',
              activeIdx === idx
                ? 'bg-[#17212B] text-white border-[#17212B] font-semibold'
                : idx < activeIdx
                ? 'bg-[#178A68]/10 text-[#178A68] border-[#178A68]/20'
                : 'bg-[#F2F7F8] text-[#66737E] border-[#17212B]/10'
            )}
          >
            <span className="font-bold">{step.num}</span>
            <span>{step.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
