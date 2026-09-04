import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const ServiceMarquee: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  const steps = [
    'BOOK APPOINTMENT',
    'DIAGNOSE ISSUES',
    'EXPERT REPAIR',
    'VERIFY QUALITY',
    'DIGITAL PAYMENT',
    'DRIVE CONFIDENTLY',
  ];

  return (
    <div
      className="w-full py-4 border-y border-[#17212B]/10 bg-white/70 backdrop-blur-xs overflow-hidden select-none"
      aria-label="Vehicle Service Process Lifecycle"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#00A7B5] font-semibold shrink-0 mr-6">
          SERVICE LIFECYCLE:
        </span>

        <div className="flex-1 overflow-hidden relative">
          <motion.div
            animate={isReducedMotion ? {} : { x: ['0%', '-50%'] }}
            transition={
              isReducedMotion
                ? {}
                : {
                    duration: 35,
                    repeat: Infinity,
                    ease: 'linear',
                  }
            }
            className="flex items-center gap-8 whitespace-nowrap w-max"
            aria-hidden="true"
          >
            {[...steps, ...steps].map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="text-xs font-mono-tech tracking-wider text-[#17212B] font-medium">
                  {step}
                </span>
                <span className="text-[#F4512C] font-bold text-xs">→</span>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Accessible Static Reader Sequence for Screen Readers */}
          <div className="sr-only">
            Vehicle Service Process Steps: {steps.join(' then ')}
          </div>
        </div>
      </div>
    </div>
  );
};
