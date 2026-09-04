import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface StatusCardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  time?: string;
  badgeText: string;
  badgeVariant?: 'cyan' | 'orange' | 'success';
}

interface FloatingStatusCardProps {
  item: StatusCardItem;
  className?: string;
  delay?: number;
  isReducedMotion?: boolean;
}

export const FloatingStatusCard: React.FC<FloatingStatusCardProps> = ({
  item,
  className,
  delay = 0,
  isReducedMotion = false,
}) => {
  const initialAnimation = isReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 20, scale: 0.95 };

  const animateTarget = { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      initial={initialAnimation}
      animate={animateTarget}
      transition={{
        duration: isReducedMotion ? 0 : 0.6,
        delay: isReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={cn(
        'bg-white/95 backdrop-blur-sm border border-[#17212B]/10 rounded-xl p-3.5 shadow-md shadow-[#17212B]/06 hover:border-[#00A7B5]/40 transition-colors select-none',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EAF7FA] text-[#00A7B5] flex items-center justify-center shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-[#17212B] truncate">{item.title}</h4>
            {item.time && (
              <span className="text-[10px] font-mono-tech text-[#66737E] shrink-0">
                {item.time}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#66737E] truncate mt-0.5">{item.subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};
