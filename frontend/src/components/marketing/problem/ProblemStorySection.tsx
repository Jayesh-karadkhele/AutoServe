import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Surface } from '@/components/ui/Surface';
import { TimelineFragmentVisual } from './visuals/TimelineFragmentVisual';
import { SurpriseCostsVisual } from './visuals/SurpriseCostsVisual';
import { NoVisibilityVisual } from './visuals/NoVisibilityVisual';
import { ScatteredHistoryVisual } from './visuals/ScatteredHistoryVisual';
import { RoadsideUncertaintyVisual } from './visuals/RoadsideUncertaintyVisual';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';
import { cn } from '@/lib/utils';

export const ProblemStorySection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [activeIdx, setActiveIdx] = useState(0);

  const chapters = [
    {
      num: '01',
      title: 'No clear timeline',
      headline: 'You hand over the keys. Then the updates stop.',
      copy: 'Service progress is scattered across calls and messages, leaving customers unsure whether inspection, repair or final testing has even started.',
      visual: <TimelineFragmentVisual />,
      rotationClass: '-rotate-1',
    },
    {
      num: '02',
      title: 'Surprise costs',
      headline: 'The final bill shouldn’t be the first explanation.',
      copy: 'Parts, labour and tax often appear only at the end, without a clear connection to the work performed.',
      visual: <SurpriseCostsVisual />,
      rotationClass: 'rotate-1',
    },
    {
      num: '03',
      title: 'No repair visibility',
      headline: 'Important work happens completely out of sight.',
      copy: 'Without photographic evidence or structured job updates, customers have no simple way to understand what was found, replaced or repaired.',
      visual: <NoVisibilityVisual />,
      rotationClass: '-rotate-1.5',
    },
    {
      num: '04',
      title: 'Scattered service history',
      headline: 'Every visit starts the story again.',
      copy: 'Vehicle details, previous repairs, invoices and feedback live in different places—or disappear completely.',
      visual: <ScatteredHistoryVisual />,
      rotationClass: 'rotate-1',
    },
    {
      num: '05',
      title: 'Roadside uncertainty',
      headline: 'An emergency request needs more than “help is coming.”',
      copy: 'Drivers need location-aware assistance, clear assignment and visible progress when their vehicle stops unexpectedly.',
      visual: <RoadsideUncertaintyVisual />,
      rotationClass: '-rotate-0.5',
    },
  ];

  return (
    <Section id="why-autoserve" className="bg-[#F7F5EF] border-t border-[#17212B]/08 py-20 lg:py-28 relative">
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="orange" className="mb-4">
            THE OLD SERVICE EXPERIENCE
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            Your car disappears behind a workshop door.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            Updates get buried in phone calls. Costs arrive without context. Repair progress stays invisible. Vehicle care becomes a waiting game built on uncertainty.
          </p>
        </div>

        {/* Story Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Vertical Chapter Tracker & Thesis Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <div className="bg-white border border-[#17212B]/10 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#17212B]/08 pb-4">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-[#66737E]">
                  PROBLEM CHAPTERS
                </span>
                <span className="text-xs font-mono-tech text-[#F4512C] font-semibold">
                  0{activeIdx + 1} / 05
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-[#E5EBEE] h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#F4512C] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((activeIdx + 1) / 5) * 100}%` }}
                />
              </div>

              {/* Chapter Indicators List */}
              <div className="space-y-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.num}
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl transition-all flex items-center justify-between min-h-[44px] cursor-pointer text-xs font-mono-tech',
                      activeIdx === idx
                        ? 'bg-[#EAF7FA] text-[#00A7B5] font-semibold border border-[#00A7B5]/20'
                        : 'text-[#66737E] hover:bg-[#F2F7F8] hover:text-[#17212B]'
                    )}
                  >
                    <span className="truncate">{ch.num} — {ch.title}</span>
                    {activeIdx === idx && <span className="text-[#00A7B5] font-bold">●</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Layered Stack Cards */}
          <div className="lg:col-span-7 space-y-8">
            {chapters.map((chapter, idx) => (
              <motion.div
                key={chapter.num}
                onViewportEnter={() => setActiveIdx(idx)}
                initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: isReducedMotion ? 0 : 0.5,
                  delay: isReducedMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <Surface
                  variant="surface"
                  elevation="xs"
                  clippedCorner={idx % 2 === 1}
                  className={cn(
                    'p-6 sm:p-8 transition-all hover:border-[#17212B]/25',
                    !isReducedMotion && chapter.rotationClass
                  )}
                >
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#66737E] mb-4">
                    <span className="text-[#F4512C] font-semibold">{chapter.num}</span>
                    <span className="uppercase tracking-wider">{chapter.title}</span>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-[#17212B] mb-3">
                    {chapter.headline}
                  </h3>

                  <p className="text-sm text-[#66737E] leading-relaxed mb-6">
                    {chapter.copy}
                  </p>

                  {/* SVG / CSS Visual Metaphor */}
                  {chapter.visual}
                </Surface>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
