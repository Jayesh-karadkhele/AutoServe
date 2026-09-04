import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const ScrollIndicator: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  return (
    <a
      href="#why-autoserve"
      aria-label="Scroll down to problem teaser section"
      className="inline-flex flex-col items-center gap-1.5 text-[#66737E] hover:text-[#17212B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] rounded-lg p-2 group"
    >
      <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#66737E]">
        EXPLORE EXPERIENCE
      </span>
      <motion.div
        animate={isReducedMotion ? {} : { y: [0, 4, 0] }}
        transition={
          isReducedMotion
            ? {}
            : {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="w-6 h-6 rounded-full border border-[#17212B]/15 flex items-center justify-center bg-white group-hover:border-[#F4512C] transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5 text-[#17212B] group-hover:text-[#F4512C] transition-colors" />
      </motion.div>
    </a>
  );
};
