import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { PaperProps } from '@mui/material/Paper';
import type { SxProps, Theme } from '@mui/material/styles';

type AquaPanelProps = PaperProps & {
  children: ReactNode;
  hover?: boolean;
  liquid?: boolean;
  strong?: boolean;
};

const styles: Record<string, SxProps<Theme>> = {
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 3,
    p: 3,
    background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(14, 23, 42, 0.62)' : 'rgba(255, 255, 255, 0.72)'),
    border: (theme) =>
      `1px solid ${theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.10)' : 'rgba(2, 132, 199, 0.16)'}`,
    boxShadow: (theme) =>
      theme.palette.mode === 'dark' ? '0 24px 70px rgba(0, 0, 0, 0.24)' : '0 24px 70px rgba(3, 105, 161, 0.12)',
  },
  strong: {
    background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(14, 23, 42, 0.86)' : 'rgba(255, 255, 255, 0.86)'),
    borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.16)' : 'rgba(2, 132, 199, 0.20)'),
  },
  hover: {
    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'rgba(34, 211, 238, 0.34)',
      boxShadow: (theme) =>
        theme.palette.mode === 'dark' ? '0 22px 48px rgba(6, 182, 212, 0.14)' : '0 22px 48px rgba(2, 132, 199, 0.16)',
    },
  },
  liquid: {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      p: '1px',
      borderRadius: 'inherit',
      background: (theme) =>
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.45), rgba(14, 165, 233, 0.12), rgba(34, 211, 238, 0.25))'
          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.34), rgba(14, 165, 233, 0.14), rgba(2, 132, 199, 0.22))',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
    },
  },
  waterFill: {
    position: 'absolute',
    insetInline: 0,
    bottom: 0,
    height: '46%',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, rgba(6, 182, 212, 0.14), rgba(6, 182, 212, 0.03))'
        : 'linear-gradient(to top, rgba(6, 182, 212, 0.10), rgba(240, 249, 255, 0.02))',
    pointerEvents: 'none',
  },
};

function AquaPanel({ children, hover = false, liquid = false, strong = false, sx, ...props }: AquaPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={[
        styles.root,
        strong && styles.strong,
        hover && styles.hover,
        liquid && styles.liquid,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {liquid ? <Box sx={styles.waterFill} /> : null}
      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Paper>
  );
}

export default AquaPanel;
