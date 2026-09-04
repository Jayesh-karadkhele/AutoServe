import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ServiceJourneyRail } from './ServiceJourneyRail';
import { JourneyStepCard } from './JourneyStepCard';
import { JourneyStepData } from './howItWorksData';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const HowItWorksSection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [activeIdx, setActiveIdx] = useState(0);
  const steps = JourneyStepData.steps;

  return (
    <Section id="how-it-works" className="bg-[#F7F5EF] border-t border-[#17212B]/08 py-20 lg:py-28 relative">
      <Container size="xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <Badge variant="cyan" className="mb-4">
            YOUR SERVICE, STEP BY STEP
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            From first concern to final confirmation.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            One connected journey keeps your vehicle, service team, repair evidence and payment in the same clear record.
          </p>
        </div>

        {/* 7 Checkpoints Interactive Service Run Rail */}
        <ServiceJourneyRail activeIdx={activeIdx} onSelectStep={(idx) => setActiveIdx(idx)} />

        {/* Active Step Detailed Card with Preview */}
        <motion.div
          key={activeIdx}
          initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <JourneyStepCard
            step={steps[activeIdx]}
            isActive={true}
            onSelect={() => {}}
          />
        </motion.div>
      </Container>
    </Section>
  );
};
