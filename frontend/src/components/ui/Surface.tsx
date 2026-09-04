import React from 'react';
import { cn } from '@/lib/utils';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'soft' | 'ice' | 'ghost';
  elevation?: 'none' | 'xs' | 'sm' | 'md';
  clippedCorner?: boolean;
  className?: string;
}

export const Surface: React.FC<SurfaceProps> = ({
  children,
  variant = 'surface',
  elevation = 'xs',
  clippedCorner = false,
  className,
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-white border-[#17212B]/10',
    soft: 'bg-[#F2F7F8] border-[#17212B]/08',
    ice: 'bg-[#EAF7FA]/60 border-[#00A7B5]/15',
    ghost: 'bg-transparent border-transparent',
  };

  const elevationStyles = {
    none: '',
    xs: 'shadow-xs shadow-[#17212B]/05',
    sm: 'shadow-sm shadow-[#17212B]/08',
    md: 'shadow-md shadow-[#17212B]/10',
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300',
        variantStyles[variant],
        elevationStyles[elevation],
        clippedCorner && 'clip-corner-tr',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
