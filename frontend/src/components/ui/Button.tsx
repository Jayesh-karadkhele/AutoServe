import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  withArrow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  withArrow = false,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-lg cursor-pointer';

  const variantStyles = {
    primary:
      'bg-[#F4512C] hover:bg-[#DC3F1E] text-white shadow-sm shadow-[#F4512C]/20 border border-transparent',
    secondary:
      'bg-[#FFFFFF] hover:bg-[#F2F7F8] text-[#17212B] border border-[#17212B]/12 shadow-xs',
    outline:
      'bg-transparent hover:bg-[#EAF7FA]/50 text-[#17212B] border border-[#17212B]/20',
    ghost:
      'bg-transparent hover:bg-[#17212B]/05 text-[#17212B]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 font-mono-tech',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-medium',
  };

  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  const combinedClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    withArrow && 'group',
    className
  );

  if (href) {
    if (href.startsWith('#')) {
      return (
        <a href={href} className={combinedClasses}>
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};
