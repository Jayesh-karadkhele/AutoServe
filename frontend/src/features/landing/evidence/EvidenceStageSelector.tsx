import React from 'react';
import { EVIDENCE_STAGES, type EvidenceStageId } from './evidenceData';
import { CheckCircle2, Clock, Wrench, FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceStageSelectorProps {
  activeStageId: EvidenceStageId;
  onSelectStage: (id: EvidenceStageId) => void;
}

export const EvidenceStageSelector: React.FC<EvidenceStageSelectorProps> = ({
  activeStageId,
  onSelectStage,
}) => {
  const getIcon = (id: EvidenceStageId) => {
    switch (id) {
      case 'reported':
        return Clock;
      case 'diagnosed':
        return FileSearch;
      case 'in_progress':
        return Wrench;
      case 'verified':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Repair Evidence Story Stages"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-slate-100/80 border border-slate-200 rounded-xl"
    >
      {EVIDENCE_STAGES.map((stage) => {
        const isSelected = activeStageId === stage.id;
        const IconComponent = getIcon(stage.id);

        return (
          <button
            key={stage.id}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`evidence-panel-${stage.id}`}
            id={`evidence-tab-${stage.id}`}
            onClick={() => onSelectStage(stage.id)}
            className={cn(
              'px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]',
              isSelected
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            )}
          >
            <IconComponent
              className={cn(
                'w-4 h-4 shrink-0',
                isSelected ? 'text-cyan-600' : 'text-slate-400'
              )}
            />
            <span>{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};
