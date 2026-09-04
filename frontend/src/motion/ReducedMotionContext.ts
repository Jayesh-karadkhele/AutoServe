import { createContext, useContext } from 'react';

export const ReducedMotionContext = createContext<boolean>(false);

export const useReducedMotionContext = () => useContext(ReducedMotionContext);
