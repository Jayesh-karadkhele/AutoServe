import React from 'react';
import type { TrustPrinciple } from './trustData';
import { Shield, FileText, Calculator, History } from 'lucide-react';

interface TrustPrincipleCardProps {
  principle: TrustPrinciple;
}

const ICON_MAP = {
  shield: Shield,
  'file-text': FileText,
  calculator: Calculator,
  history: History,
};

export const TrustPrincipleCard: React.FC<TrustPrincipleCardProps> = ({ principle }) => {
  const IconComp = ICON_MAP[principle.iconName] || Shield;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <IconComp className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {principle.badge}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900">{principle.title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{principle.copy}</p>
      </div>

      {/* Technical Micro-UI Fragment */}
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Verified State</span>
        <span className="text-emerald-600 font-semibold">Active Guard</span>
      </div>
    </div>
  );
};
