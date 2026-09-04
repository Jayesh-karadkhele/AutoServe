import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { BookingPreview } from './previews/BookingPreview';
import { AssignmentPreview } from './previews/AssignmentPreview';
import { TrackingPreview } from './previews/TrackingPreview';
import { EvidencePreview } from './previews/EvidencePreview';
import { InvoicePreview } from './previews/InvoicePreview';
import { RsaPreview } from './previews/RsaPreview';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const SolutionStorySection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const chapters = [
    {
      num: '01',
      title: 'Book in minutes',
      headline: 'Start with the vehicle, date and problem.',
      details:
        'Customers select their vehicle, explain the issue, choose a preferred date and attach useful photographs in one guided flow.',
      preview: <BookingPreview />,
    },
    {
      num: '02',
      title: 'Connect the right team',
      headline: 'Every appointment reaches the right people.',
      details:
        'Administrators assign a manager, managers coordinate their mechanics, and every responsibility remains visible.',
      preview: <AssignmentPreview />,
    },
    {
      num: '03',
      title: 'Track every stage',
      headline: 'Know exactly where the service stands.',
      details:
        'Customers follow the journey from approval and inspection through active repair, completion and invoicing.',
      preview: <TrackingPreview />,
    },
    {
      num: '04',
      title: 'See the work',
      headline: 'Repair evidence replaces guesswork.',
      details:
        'Before, during and after photographs create a transparent record of the vehicle’s condition and completed work.',
      preview: <EvidencePreview />,
    },
    {
      num: '05',
      title: 'Understand every rupee',
      headline: 'Parts, labour and tax—clearly connected.',
      details:
        'Snapshot pricing preserves the price charged during service, while the invoice explains every line before payment.',
      preview: <InvoicePreview />,
    },
    {
      num: '06',
      title: 'Get moving again',
      headline: 'From roadside request to resolved assistance.',
      details:
        'Location-aware RSA requests connect the stranded driver, assigned service team and vehicle information in one operational flow.',
      preview: <RsaPreview />,
    },
  ];

  // GSAP ScrollTrigger Pinned Desktop Sequence
  useGSAP(
    () => {
      if (isReducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const sections = gsap.utils.toArray<HTMLElement>('.solution-chapter-item');

        sections.forEach((section, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveIdx(i),
            onEnterBack: () => setActiveIdx(i),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [isReducedMotion] }
  );

  return (
    <Section id="experience" className="bg-white border-t border-[#17212B]/08 py-20 lg:py-28 relative">
      <Container size="xl" ref={containerRef}>
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="cyan" className="mb-4">
            THE AUTOSERVE WAY
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            One connected lane—from booking to back on the road.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            AutoServe gives customers and service teams a shared view of every vehicle, decision, repair and payment.
          </p>
        </div>

        {/* Mobile Capability Selector Tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar select-none" role="tablist">
          {chapters.map((ch, idx) => (
            <button
              key={ch.num}
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'px-4 py-2.5 rounded-full text-xs font-mono-tech whitespace-nowrap transition-colors min-h-[44px] cursor-pointer border',
                activeIdx === idx
                  ? 'bg-[#17212B] text-white border-[#17212B]'
                  : 'bg-[#F2F7F8] text-[#66737E] border-[#17212B]/10 hover:text-[#17212B]'
              )}
            >
              {ch.num} — {ch.title}
            </button>
          ))}
        </div>

        {/* Solution Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Scrolling Chapters Copy */}
          <div className="lg:col-span-6 space-y-16">
            {chapters.map((chapter, idx) => (
              <div
                key={chapter.num}
                className={cn(
                  'solution-chapter-item p-6 sm:p-8 rounded-2xl border transition-all',
                  activeIdx === idx
                    ? 'bg-[#EAF7FA]/40 border-[#00A7B5]/30 shadow-xs'
                    : 'bg-[#F7F5EF]/60 border-[#17212B]/08 opacity-70 lg:opacity-100'
                )}
              >
                <div className="flex items-center justify-between text-xs font-mono-tech text-[#66737E] mb-3">
                  <span className="text-[#00A7B5] font-bold">{chapter.num}</span>
                  <span className="uppercase tracking-wider">{chapter.title}</span>
                </div>

                <h3 className="text-2xl font-display font-semibold text-[#17212B] mb-3">
                  {chapter.headline}
                </h3>

                <p className="text-sm text-[#66737E] leading-relaxed">
                  {chapter.details}
                </p>

                {/* Mobile Embedded Preview */}
                <div className="mt-6 lg:hidden">
                  {chapter.preview}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Persistent Desktop Sticky Product Window */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-32 self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
                transition={{ duration: isReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {chapters[activeIdx].preview}
              </motion.div>
            </AnimatePresence>

            {/* Desktop Capability Progress Bar */}
            <div className="mt-6 p-4 bg-[#F2F7F8] border border-[#17212B]/08 rounded-xl flex items-center justify-between text-xs font-mono-tech">
              <span className="text-[#66737E]">AUTOSERVE STAGE:</span>
              <span className="text-[#00A7B5] font-semibold">
                {chapters[activeIdx].num} / 06 — {chapters[activeIdx].title.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
