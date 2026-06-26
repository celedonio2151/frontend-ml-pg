import type { SxProps, Theme } from '@mui/material/styles';

export const waterShowcaseStyles: Record<string, SxProps<Theme>> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    color: 'text.primary',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 32rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 34rem), #060d18'
        : 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 32rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 34rem), #f0f9ff',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    opacity: (theme) => (theme.palette.mode === 'dark' ? 0.035 : 0.12),
    backgroundImage: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(rgba(34,211,238,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)'
        : 'linear-gradient(rgba(2,132,199,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(2,132,199,0.42) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: 'min(1480px, 100%)',
    mx: 'auto',
    px: { xs: 2, md: 4 },
    py: { xs: 2, md: 4 },
  },
  shell: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' },
    gap: { xs: 2, lg: 0 },
    minHeight: { lg: 'calc(100vh - 64px)' },
  },
  sidebar: {
    borderRadius: { xs: 3, lg: '24px 0 0 24px' },
    borderRight: { lg: '1px solid rgba(125, 211, 252, 0.12)' },
    p: 0,
  },
  main: {
    borderRadius: { xs: 3, lg: '0 24px 24px 0' },
    borderLeft: { lg: 0 },
    p: 0,
    minWidth: 0,
  },
  sectionStack: {
    p: { xs: 2, md: 3 },
  },
  responsiveCards: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
    gap: 2,
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) minmax(300px, 1fr)' },
    gap: 3,
  },
  threeColumn: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
    gap: 2,
  },
  componentGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
    gap: 2,
  },
  codeBlock: {
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0d1117' : 'rgba(255, 255, 255, 0.82)'),
    border: (theme) =>
      `1px solid ${theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.16)'}`,
    borderRadius: 2,
    color: (theme) => (theme.palette.mode === 'dark' ? '#bdefff' : '#075985'),
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    fontSize: 12,
    overflowX: 'auto',
    p: 2,
    whiteSpace: 'pre',
  },
};
