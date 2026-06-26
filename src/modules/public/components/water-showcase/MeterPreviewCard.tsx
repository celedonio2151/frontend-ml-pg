import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import type { StatusTone } from 'shared/ui/aqua/StatusPill';
import { meters } from 'modules/public/data/waterShowcaseData';
import { toneByStatus } from './waterShowcaseTones';

type MeterPreviewCardProps = {
  meter: (typeof meters)[number];
};

const meterToneColor: Record<StatusTone, string> = {
  aqua: '#22d3ee',
  success: '#4ade80',
  warning: '#facc15',
  error: '#f87171',
  neutral: '#93a8bd',
  purple: '#c084fc',
};

function MeterPreviewCard({ meter }: MeterPreviewCardProps) {
  const tone = meter.tone as StatusTone;

  return (
    <AquaPanel hover liquid sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                color: meterToneColor[tone],
                border: '1px solid currentColor',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <SpeedRounded />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}>
                {meter.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {meter.label}
              </Typography>
            </Box>
          </Stack>
          <StatusPill label={meter.status} tone={toneByStatus[meter.status]} />
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Propietario
            </Typography>
            <Typography variant="body2">{meter.owner}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Lectura actual
            </Typography>
            <Typography variant="body2" color="primary.light" sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
              {meter.reading}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <LinearProgress variant="determinate" value={meter.progress} sx={{ flex: 1, height: 7, borderRadius: 99 }} />
          <Typography variant="caption" color="text.secondary">
            {meter.progress}%
          </Typography>
        </Stack>
      </Stack>
    </AquaPanel>
  );
}

export default MeterPreviewCard;
