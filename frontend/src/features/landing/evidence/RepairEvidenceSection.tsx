import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { EVIDENCE_STAGES, type EvidenceStageId } from './evidenceData';
import { EvidenceStageSelector } from './EvidenceStageSelector';
import { EvidenceWorkspace } from './EvidenceWorkspace';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const RepairEvidenceSection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [activeStageId, setActiveStageId] = useState<EvidenceStageId>('diagnosed');

  const activeStage = EVIDENCE_STAGES.find(s => s.id === activeStageId) || EVIDENCE_STAGES[0];

  return (
    <Section
      id="repair-evidence"
      aria-label="Repair Evidence & Transparency"
      className="py-20 sm:py-28 bg-[#F7F5EF] border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl" className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="cyan" className="mb-4">
            PROOF AT EVERY IMPORTANT STAGE
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            See the work—not just the final bill.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            Repair notes, service stages and visual evidence stay connected to the same job card, giving customers clearer context before completion.
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <EvidenceStageSelector
          activeStageId={activeStageId}
          onSelectStage={setActiveStageId}
        />

        {/* Interactive Workspace Panel */}
        <motion.div
          key={activeStageId}
          initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <EvidenceWorkspace stage={activeStage} />
        </motion.div>
      </Container>
    </Section>
  );
};
