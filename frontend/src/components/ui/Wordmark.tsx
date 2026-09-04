import React from 'react';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
  light?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ className, light = false }) => {
  return (
    <div className={cn("inline-flex items-center gap-1.5 font-display tracking-tight text-xl font-bold select-none", className)}>
      <span className={light ? "text-[#F7F5EF]" : "text-[#17212B]"}>Auto</span>
      <span className="text-[#F4512C]">Serve</span>
      <span className="w-1.5 h-1.5 rounded-full bg-[#00A7B5] inline-block ml-0.5" aria-hidden="true"></span>
    </div>
  );
};
