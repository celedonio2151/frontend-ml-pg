import { useMemo, type PropsWithChildren } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, type Breakpoint } from '@mui/material/styles';
import { BreakpointContext, type BreakpointContextInterface } from 'providers/breakpoints';

const getViewportWidth = () => (typeof window === 'undefined' ? 0 : window.innerWidth);

const BreakpointsProvider = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  const currentBreakpoint: Breakpoint = isXlUp ? 'xl' : isLgUp ? 'lg' : isMdUp ? 'md' : isSmUp ? 'sm' : 'xs';

  const value = useMemo<BreakpointContextInterface>(() => {
    const getBreakpointValue = (key: Breakpoint | number) =>
      typeof key === 'number' ? key : theme.breakpoints.values[key];

    return {
      currentBreakpoint,
      up: (key) => getViewportWidth() >= getBreakpointValue(key),
      down: (key) => getViewportWidth() < getBreakpointValue(key),
      only: (key) => (typeof key === 'number' ? getViewportWidth() === key : currentBreakpoint === key),
      between: (start, end) => {
        const width = getViewportWidth();
        return width >= getBreakpointValue(start) && width < getBreakpointValue(end);
      },
    };
  }, [currentBreakpoint, theme.breakpoints.values]);

  return <BreakpointContext.Provider value={value}>{children}</BreakpointContext.Provider>;
};

export default BreakpointsProvider;
