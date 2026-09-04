import React from 'react';
import { ReducedMotionProvider } from '@/motion/ReducedMotionProvider';
import { SmoothScrollProvider } from '@/motion/SmoothScrollProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReducedMotionProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ReducedMotionProvider>
  );
};
