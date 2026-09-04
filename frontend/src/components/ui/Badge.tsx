import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'orange' | 'success' | 'neutral';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className,
}) => {
  const variantStyles = {
    cyan: 'bg-[#EAF7FA] text-[#00A7B5] border-[#00A7B5]/20',
    orange: 'bg-[#F4512C]/10 text-[#F4512C] border-[#F4512C]/20',
    success: 'bg-[#178A68]/10 text-[#178A68] border-[#178A68]/20',
    neutral: 'bg-[#F2F7F8] text-[#66737E] border-[#17212B]/10',
  };

  const dotColors = {
    cyan: 'bg-[#00A7B5]',
    orange: 'bg-[#F4512C]',
    success: 'bg-[#178A68]',
    neutral: 'bg-[#66737E]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tech font-medium tracking-wide uppercase border select-none',
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])}
          />
        </span>
      )}
      {children}
    </span>
  );
};
