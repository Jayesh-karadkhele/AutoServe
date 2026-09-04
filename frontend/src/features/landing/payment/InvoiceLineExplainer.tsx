import React, { useState } from 'react';
import { type InvoiceLineItem, formatINR } from './invoiceData';
import { ChevronDown, Info, Tag, Wrench, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceLineExplainerProps {
  item: InvoiceLineItem;
}

export const InvoiceLineExplainer: React.FC<InvoiceLineExplainerProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryBadge = (category: InvoiceLineItem['category']) => {
    switch (category) {
      case 'part':
        return { label: 'PARTS', icon: Package, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'labour':
        return { label: 'LABOUR', icon: Wrench, color: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'discount':
        return { label: 'DISCOUNT', icon: Tag, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'ITEM', icon: Info, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getCategoryBadge(item.category);
  const IconComp = badge.icon;

  return (
    <div className="border-b border-slate-100 last:border-0">
      {/* Interactive Expandable Header Row */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`explainer-${item.id}`}
        className="w-full text-left py-3.5 px-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer min-h-[44px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-semibold border flex items-center gap-1 shrink-0', badge.color)}>
            <IconComp className="w-3 h-3" />
            {badge.label}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
            <p className="text-[11px] text-slate-400 font-mono truncate">{item.spec}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-right">
          <div className="font-mono text-xs">
            <span className="text-slate-500 text-[11px] mr-2">Qty: {item.qty}</span>
            <span className={cn('font-bold', item.totalPrice < 0 ? 'text-emerald-600' : 'text-slate-900')}>
              {formatINR(item.totalPrice)}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 transition-transform duration-200',
              isExpanded && 'rotate-180 text-cyan-600'
            )}
          />
        </div>
      </button>

      {/* Expanded Line Context Details Panel */}
      {isExpanded && (
        <div
          id={`explainer-${item.id}`}
          className="p-3.5 mx-3 mb-3 rounded-lg bg-cyan-50/40 border border-cyan-200/50 space-y-2 text-xs"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Line Cost Explanation:</p>
              <p className="text-slate-600 mt-0.5">{item.explanation}</p>
            </div>
          </div>

          <div className="pt-1.5 border-t border-cyan-200/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Calculation: {item.qty} × {formatINR(item.unitPrice)}</span>
            <span className="text-cyan-800 font-medium">{item.stageOrigin}</span>
          </div>
        </div>
      )}
    </div>
  );
};
