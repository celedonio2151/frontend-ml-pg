import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import type { AquaTone } from 'shared/ui/aqua/aquaTones';
import { getAquaTone } from 'shared/ui/aqua/aquaTones';

export type MetricTone = Exclude<AquaTone, 'neutral'>;

export type MetricCardProps = {
  change: string;
  icon: ReactNode;
  label: string;
  tone?: MetricTone;
  value: string;
  waterLevel: number;
};

const styles: Record<string, SxProps<Theme>> = {
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 2,
    display: 'grid',
    placeItems: 'center',
    border: '1px solid currentColor',
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(2, 132, 199, 0.06)',
  },
  progress: {
    height: 6,
    borderRadius: 99,
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark' ? 'rgba(8, 47, 73, 0.70)' : 'rgba(186, 230, 253, 0.70)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 99,
      background: 'linear-gradient(90deg, currentColor, rgba(14, 165, 233, 0.88))',
    },
  },
};

function MetricCard({ change, icon, label, tone = 'aqua', value, waterLevel }: MetricCardProps) {
  return (
    <AquaPanel hover liquid sx={{ p: 2.5 }}>
      <Stack spacing={2} sx={(theme) => ({ color: getAquaTone(theme, tone).accent })}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={styles.iconBox}>{icon}</Box>
          <StatusPill label={change} tone={tone} />
        </Stack>
        <Box sx={{ color: 'text.primary' }}>
          <Typography variant="h4" component="p" sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <LinearProgress variant="determinate" value={waterLevel} sx={styles.progress} />
          <Typography
            variant="caption"
            sx={{ minWidth: 34, color: 'text.secondary', textAlign: 'right' }}
          >
            {waterLevel}%
          </Typography>
        </Stack>
      </Stack>
    </AquaPanel>
  );
}

export default MetricCard;
