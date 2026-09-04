import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { RSA_STAGES, type RsaStageId } from './roadsideData';
import { RoadsideStageSelector } from './RoadsideStageSelector';
import { RoadsideMapPreview } from './RoadsideMapPreview';
import { ShieldAlert, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const RoadsideAssistanceSection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [activeStageId, setActiveStageId] = useState<RsaStageId>('dispatch_track');

  const activeStage = RSA_STAGES.find(s => s.id === activeStageId) || RSA_STAGES[0];

  return (
    <Section
      id="roadside-assistance"
      aria-label="Roadside Assistance Planned Experience"
      className="py-20 sm:py-28 bg-[#F7F5EF] border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl" className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="orange">
              HELP SHOULD FEEL VISIBLE
            </Badge>

            {/* Permanent Planned Capability Preview Badge (Must remain permanently visible across desktop & mobile) */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              Planned capability preview
            </span>
          </div>

          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            From roadside request to resolved assistance.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            The planned roadside experience brings request details, location confirmation, dispatch progress and resolution into one understandable flow.
          </p>
        </div>

        {/* 5 Stage Selector Tabs */}
        <RoadsideStageSelector
          activeStageId={activeStageId}
          onSelectStage={setActiveStageId}
        />

        {/* Code-Native SVG Map Canvas */}
        <RoadsideMapPreview stage={activeStage} />

        {/* Active Stage Details Panel */}
        <motion.div
          key={activeStageId}
          initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          id={`rsa-panel-${activeStage.id}`}
          role="tabpanel"
          aria-labelledby={`rsa-tab-${activeStage.id}`}
          className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="text-[11px] font-mono font-bold text-cyan-600">
                STEP {activeStage.stepNum} • {activeStage.statusText}
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{activeStage.title}</h4>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
              {activeStage.estimatedTime}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-body">
            {activeStage.description}
          </p>

          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2 font-mono">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{activeStage.actionHint}</span>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
