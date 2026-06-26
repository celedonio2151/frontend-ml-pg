import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

type CircularProgressMockProps = {
  value: number;
};

function CircularProgressMock({ value }: CircularProgressMockProps) {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', width: 134, height: 134, display: 'grid', placeItems: 'center' }}>
      <Box
        component="svg"
        viewBox="0 0 134 134"
        sx={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="67"
          cy="67"
          r="56"
          stroke={theme.palette.mode === 'dark' ? 'rgba(8, 47, 73, 0.9)' : 'rgba(186, 230, 253, 0.82)'}
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="67"
          cy="67"
          r="56"
          stroke="url(#aquaProgress)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={351.86}
          strokeDashoffset={351.86 - (351.86 * value) / 100}
        />
        <defs>
          <linearGradient id="aquaProgress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </Box>
      <Stack spacing={0} sx={{ alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {value}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Cobrado
        </Typography>
      </Stack>
    </Box>
  );
}

export default CircularProgressMock;
