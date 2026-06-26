import type { ReactNode } from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { ChipProps } from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

export type StatusTone = 'aqua' | 'success' | 'warning' | 'error' | 'neutral' | 'purple';

type StatusPillProps = Omit<ChipProps, 'color' | 'label'> & {
  label: ReactNode;
  pulse?: boolean;
  tone?: StatusTone;
};

const toneStyles: Record<StatusTone, SxProps<Theme>> = {
  aqua: {
    color: '#22d3ee',
    borderColor: 'rgba(34, 211, 238, 0.24)',
    backgroundColor: 'rgba(6, 182, 212, 0.10)',
  },
  success: {
    color: '#4ade80',
    borderColor: 'rgba(74, 222, 128, 0.24)',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },
  warning: {
    color: '#facc15',
    borderColor: 'rgba(250, 204, 21, 0.24)',
    backgroundColor: 'rgba(234, 179, 8, 0.10)',
  },
  error: {
    color: '#f87171',
    borderColor: 'rgba(248, 113, 113, 0.24)',
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
  },
  neutral: {
    color: '#93a8bd',
    borderColor: 'rgba(148, 163, 184, 0.20)',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  purple: {
    color: '#c084fc',
    borderColor: 'rgba(192, 132, 252, 0.24)',
    backgroundColor: 'rgba(168, 85, 247, 0.10)',
  },
};

const dotStyles: Record<string, SxProps<Theme>> = {
  root: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    position: 'relative',
  },
  pulse: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -4,
      borderRadius: 'inherit',
      border: '1px solid currentColor',
      opacity: 0.55,
      animation: 'aquaPulseRing 1.8s ease-out infinite',
    },
  },
};

function StatusPill({ label, pulse = false, tone = 'aqua', sx, ...props }: StatusPillProps) {
  return (
    <Chip
      size="small"
      variant="outlined"
      label={label}
      icon={<Box component="span" sx={pulse ? dotStyles.pulse : dotStyles.root} />}
      sx={[
        {
          height: 26,
          borderRadius: 99,
          fontWeight: 700,
          '& .MuiChip-icon': {
            ml: 1,
          },
        },
        toneStyles[tone],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}

export default StatusPill;
