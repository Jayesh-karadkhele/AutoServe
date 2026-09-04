import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  variant?: 'ghost' | 'secondary' | 'outline';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  ariaLabel,
  className,
  variant = 'ghost',
  ...props
}) => {
  const variantStyles = {
    ghost: 'hover:bg-[#17212B]/05 text-[#17212B]',
    secondary: 'bg-[#FFFFFF] hover:bg-[#F2F7F8] text-[#17212B] border border-[#17212B]/12',
    outline: 'border border-[#17212B]/20 text-[#17212B] hover:bg-[#17212B]/05',
  };

  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] focus-visible:ring-offset-2 active:scale-95 cursor-pointer min-w-[44px] min-h-[44px]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
