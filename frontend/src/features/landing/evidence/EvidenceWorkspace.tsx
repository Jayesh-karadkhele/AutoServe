import React from 'react';
import { type EvidenceStageData, JOB_CARD_REF, VEHICLE_NAME, VEHICLE_PLATE } from './evidenceData';
import { EvidenceComparison } from './EvidenceComparison';
import { ShieldCheck, Clock, UserCheck, FileText } from 'lucide-react';

interface EvidenceWorkspaceProps {
  stage: EvidenceStageData;
}

export const EvidenceWorkspace: React.FC<EvidenceWorkspaceProps> = ({ stage }) => {
  return (
    <div
      id={`evidence-panel-${stage.id}`}
      role="tabpanel"
      aria-labelledby={`evidence-tab-${stage.id}`}
      className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-100/60 space-y-6"
    >
      {/* Top Bar with Permanent Illustrative Label & Ref IDs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
              {JOB_CARD_REF}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Illustrative interface preview
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {stage.stageStatus}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900">
            {VEHICLE_NAME} <span className="text-xs font-mono font-normal text-slate-500">({VEHICLE_PLATE})</span>
          </h4>
        </div>

        <div className="text-right self-start sm:self-auto">
          <span className="text-xs font-mono font-semibold text-slate-700 block">
            {stage.badge}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            {stage.timestamp}
          </span>
        </div>
      </div>

      {/* Interactive Evidence Comparison Canvas */}
      <EvidenceComparison stage={stage} />

      {/* Technician & Manager Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>Technician Diagnostic & Repair Notes</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            "{stage.technicianNote}"
          </p>
          <p className="text-[10px] text-slate-400 pt-1 font-mono">
            Logged by Marcus Vance (Tech #3) • Bay 3
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Manager Oversight & Review State</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            {stage.managerReview}
          </p>
          <p className="text-[10px] text-slate-400 pt-1 font-mono">
            Reviewed by David Miller • Service Manager
          </p>
        </div>
      </div>

      {/* Evidence Integrity Copy */}
      <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-200/60 text-xs text-slate-700 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
        <p className="leading-snug">
          <span className="font-semibold text-slate-900">Evidence Record Integrity: </span>
          Evidence stays connected to the service record, making each important update easier to understand and review.
        </p>
      </div>
    </div>
  );
};
