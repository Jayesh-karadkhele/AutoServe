import React, { useState } from 'react';
import { TRACE_STAGES } from './trustData';
import { CheckCircle2, FileCheck, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ServiceRecordTrace: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('invoice');

  const activeStage = TRACE_STAGES.find(s => s.id === activeStageId) || TRACE_STAGES[0];

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-100/60 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              End-to-End Operational Traceability Flow
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            One shared service record accumulates information across stages without losing prior context.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded font-mono text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 self-start sm:self-auto">
          Record #AS-260884
        </span>
      </div>

      {/* Connected Horizontal Flow Pipeline */}
      <div
        role="tablist"
        aria-label="Service Record Traceability Pipeline"
        className="grid grid-cols-1 sm:grid-cols-5 gap-2"
      >
        {TRACE_STAGES.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;

          return (
            <button
              key={stage.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`trace-panel-${stage.id}`}
              id={`trace-tab-${stage.id}`}
              onClick={() => setActiveStageId(stage.id)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[44px]',
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              )}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>
                  STAGE 0{idx + 1}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-xs font-bold truncate">{stage.title}</p>
              <p className={cn('text-[10px] font-mono mt-1 truncate', isSelected ? 'text-slate-300' : 'text-slate-500')}>
                {stage.ref}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Accumulation Explanation Box */}
      <div
        id={`trace-panel-${activeStage.id}`}
        role="tabpanel"
        aria-labelledby={`trace-tab-${activeStage.id}`}
        className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-200/70 text-xs space-y-2"
      >
        <div className="flex items-center justify-between text-slate-900 font-semibold">
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-cyan-600" />
            Accumulated Information at {activeStage.title} Stage ({activeStage.ref})
          </span>
          <span className="font-mono text-[10px] text-cyan-800">Connected Context</span>
        </div>

        <p className="text-slate-700 leading-relaxed font-body">
          {activeStage.addedContext}
        </p>
      </div>
    </div>
  );
};
