import React from 'react';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  size?: number;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className, size = 32 }) => {
  return (
    <div className={cn("inline-flex items-center justify-center shrink-0", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform duration-300 hover:scale-105"
      >
        <rect width="32" height="32" rx="8" fill="#17212B" />
        <path
          d="M7 23L16 6L25 23"
          stroke="#F7F5EF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 17C10.5 17 13.5 14 16 14C18.5 14 21.5 17 21.5 17C21.5 17 18.5 20 16 20C13.5 20 10.5 17 10.5 17Z"
          fill="#00A7B5"
          opacity="0.9"
        />
        <circle cx="16" cy="17" r="1.5" fill="#F7F5EF" />
        <path d="M11 19.5H21" stroke="#F4512C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
