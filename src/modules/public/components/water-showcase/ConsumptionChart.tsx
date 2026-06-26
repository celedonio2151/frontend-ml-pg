import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { consumptionBars } from 'modules/public/data/waterShowcaseData';

function ConsumptionChart() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'end', height: 260, pt: 3 }}>
      {consumptionBars.map((bar) => (
        <Stack key={bar.label} spacing={1} sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: '100%',
              height: `${bar.value}%`,
              minHeight: 36,
              borderRadius: '14px 14px 6px 6px',
              background: 'linear-gradient(180deg, #22d3ee, rgba(14, 165, 233, 0.42))',
              boxShadow: '0 18px 34px rgba(6, 182, 212, 0.18)',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {bar.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default ConsumptionChart;
