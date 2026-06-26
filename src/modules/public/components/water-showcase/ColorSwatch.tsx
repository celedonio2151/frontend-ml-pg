import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type ColorSwatchProps = {
  color: string;
  label: string;
};

function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: color,
          border: '1px solid rgba(255,255,255,0.16)',
        }}
      />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>
          {color}
        </Typography>
      </Box>
    </Stack>
  );
}

export default ColorSwatch;
