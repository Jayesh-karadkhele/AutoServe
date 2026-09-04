import React from 'react';
import { cn } from '@/lib/utils';

interface ProductWindowProps {
  title: string;
  badgeText: string;
  badgeVariant?: 'cyan' | 'orange' | 'success';
  children: React.ReactNode;
  className?: string;
}

export const ProductWindow: React.FC<ProductWindowProps> = ({
  title,
  badgeText,
  badgeVariant = 'cyan',
  children,
  className,
}) => {
  const badgeColors = {
    cyan: 'bg-[#EAF7FA] text-[#00A7B5] border-[#00A7B5]/20',
    orange: 'bg-[#F4512C]/10 text-[#F4512C] border-[#F4512C]/20',
    success: 'bg-[#178A68]/10 text-[#178A68] border-[#178A68]/20',
  };

  return (
    <div className={cn('bg-white border border-[#17212B]/12 rounded-2xl shadow-lg shadow-[#17212B]/06 overflow-hidden select-none', className)}>
      {/* Product Window Top Bar */}
      <div className="bg-[#F2F7F8] border-b border-[#17212B]/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#17212B]/20" />
          <div className="w-3 h-3 rounded-full bg-[#17212B]/20" />
          <div className="w-3 h-3 rounded-full bg-[#17212B]/20" />
          <span className="text-xs font-mono-tech text-[#17212B] font-semibold ml-2">
            {title}
          </span>
        </div>

        <span className={cn('text-[10px] font-mono-tech font-medium px-2.5 py-0.5 rounded-full border uppercase tracking-wider', badgeColors[badgeVariant])}>
          {badgeText}
        </span>
      </div>

      {/* Internal Content Area */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
