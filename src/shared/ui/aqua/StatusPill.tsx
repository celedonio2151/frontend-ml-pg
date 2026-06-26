import Box from '@mui/material/Box';
import type { ChipProps } from '@mui/material/Chip';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type { AquaTone } from 'shared/ui/aqua/aquaTones';
import { getAquaTone } from 'shared/ui/aqua/aquaTones';

export type StatusTone = AquaTone;

type StatusPillProps = Omit<ChipProps, 'color' | 'label'> & {
  label: ReactNode;
  pulse?: boolean;
  tone?: StatusTone;
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
        (theme) => {
          const token = getAquaTone(theme, tone);
          return {
            height: 26,
            borderRadius: 99,
            fontWeight: 700,
            color: token.accent,
            borderColor: token.border,
            backgroundColor: token.surface,
            '& .MuiChip-icon': {
              ml: 1,
            },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}

export default StatusPill;
