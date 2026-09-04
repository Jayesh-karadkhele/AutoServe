import React from 'react';
import { RSA_STAGES, type RsaStageId } from './roadsideData';
import { cn } from '@/lib/utils';

interface RoadsideStageSelectorProps {
  activeStageId: RsaStageId;
  onSelectStage: (id: RsaStageId) => void;
}

export const RoadsideStageSelector: React.FC<RoadsideStageSelectorProps> = ({
  activeStageId,
  onSelectStage,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Planned Roadside Assistance Stages"
      className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-xl"
    >
      {RSA_STAGES.map((stage) => {
        const isSelected = activeStageId === stage.id;

        return (
          <button
            key={stage.id}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`rsa-panel-${stage.id}`}
            id={`rsa-tab-${stage.id}`}
            onClick={() => onSelectStage(stage.id)}
            className={cn(
              'px-3 py-2.5 rounded-lg text-xs font-mono-tech font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer min-h-[44px]',
              isSelected
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            )}
          >
            <span className={cn('text-[10px]', isSelected ? 'text-cyan-600 font-bold' : 'text-slate-400')}>
              STEP {stage.stepNum}
            </span>
            <span className="truncate w-full text-center">{stage.title}</span>
          </button>
        );
      })}
    </div>
  );
};
