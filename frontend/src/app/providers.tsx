import React from 'react';
import { ReducedMotionProvider } from '@/motion/ReducedMotionProvider';
import { SmoothScrollProvider } from '@/motion/SmoothScrollProvider';
import { AuthProvider } from '@/features/auth/context/AuthProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ReducedMotionProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </ReducedMotionProvider>
    </AuthProvider>
  );
};

