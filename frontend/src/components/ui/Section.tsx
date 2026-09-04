import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  gridBg?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  gridBg = false,
  ...props
}) => {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        gridBg && 'bg-tech-grid',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
