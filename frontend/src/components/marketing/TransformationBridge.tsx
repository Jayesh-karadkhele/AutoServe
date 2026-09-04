import React from 'react';
import { motion } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { ArrowDown } from 'lucide-react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const TransformationBridge: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  return (
    <div className="py-20 bg-gradient-to-b from-[#F7F5EF] via-[#EAF7FA]/40 to-[#FFFFFF] border-y border-[#17212B]/08 overflow-hidden relative select-none">
      <Container size="lg" className="text-center relative z-10">
        {/* Animated Connecting Route Graphic */}
        <div className="w-full max-w-lg mx-auto mb-8 relative h-16 flex items-center justify-center">
          <svg viewBox="0 0 400 40" className="w-full h-full text-[#00A7B5]" fill="none">
            {/* Background dashed route */}
            <path
              d="M 20 20 Q 100 5, 200 20 T 380 20"
              stroke="#17212B"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.15"
            />
            {/* Animated converging signal path */}
            <motion.path
              d="M 20 20 Q 100 5, 200 20 T 380 20"
              stroke="url(#route-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={isReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: isReducedMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] as const }}
            />
            <defs>
              <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F4512C" />
                <stop offset="50%" stopColor="#00A7B5" />
                <stop offset="100%" stopColor="#178A68" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing Transformation Signal Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A7B5] opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00A7B5] border-2 border-white" />
            </span>
          </div>
        </div>

        <span className="text-xs font-mono-tech uppercase tracking-widest text-[#00A7B5] font-semibold block mb-3">
          TRANSFORMATION LANE
        </span>

        <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#17212B] tracking-tight mb-4">
          There is a better service lane.
        </h3>

        <p className="text-editorial-body text-[#66737E] max-w-xl mx-auto mb-8">
          One connected system can turn every handoff, update and decision into something visible.
        </p>

        <a
          href="#experience"
          aria-label="Scroll down to AutoServe solution experience"
          className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#17212B] hover:text-[#F4512C] transition-colors group"
        >
          <span>ENTER THE AUTOSERVE EXPERIENCE</span>
          <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
        </a>
      </Container>
    </div>
  );
};
