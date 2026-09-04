import React from 'react';
import type { FaqItem } from './faqData';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';
import { cn } from '@/lib/utils';

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const isReducedMotion = useReducedMotionContext();

  return (
    <div className="border-b border-slate-200/80 last:border-0">
      {/* Native Button with aria-expanded & aria-controls. NO duplicate Enter/Space listeners! */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-button-${item.id}`}
        className="w-full text-left py-5 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/80 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] cursor-pointer min-h-[44px]"
      >
        <span className="font-display font-semibold text-sm sm:text-base text-[#17212B] leading-snug">
          {item.question}
        </span>
        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200 text-slate-600',
              isOpen && 'rotate-180 text-[#00A7B5]'
            )}
          />
        </div>
      </button>

      {/* Answer Panel */}
      {isOpen && (
        <motion.div
          id={`faq-answer-${item.id}`}
          role="region"
          aria-labelledby={`faq-button-${item.id}`}
          initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="px-4 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#66737E] leading-relaxed font-body"
        >
          <p className="bg-[#EAF7FA]/50 p-4 rounded-xl border border-[#00A7B5]/20">
            {item.answer}
          </p>
        </motion.div>
      )}
    </div>
  );
};
