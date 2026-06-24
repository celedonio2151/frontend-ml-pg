import { createContext, useContext } from 'react';
import type { Breakpoint } from '@mui/material/styles';

export interface BreakpointContextInterface {
  currentBreakpoint: Breakpoint;
  up: (key: Breakpoint | number) => boolean;
  down: (key: Breakpoint | number) => boolean;
  only: (key: Breakpoint | number) => boolean;
  between: (start: Breakpoint | number, end: Breakpoint | number) => boolean;
}

export const BreakpointContext = createContext<BreakpointContextInterface | undefined>(undefined);

export const useBreakpoints = () => {
  const context = useContext(BreakpointContext);

  if (!context) {
    throw new Error('useBreakpoints must be used within BreakpointsProvider');
  }

  return context;
};
