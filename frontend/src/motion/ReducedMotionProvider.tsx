import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ReducedMotionContext } from './ReducedMotionContext';

export const ReducedMotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isReducedMotion = useReducedMotion();
  return (
    <ReducedMotionContext.Provider value={isReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
};
