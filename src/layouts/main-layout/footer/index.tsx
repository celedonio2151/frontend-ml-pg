import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function Footer() {
  return (
    <Stack
      component="footer"
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{
        alignItems: { xs: 'center', md: 'center' },
        color: 'text.secondary',
        justifyContent: 'space-between',
        px: { xs: 2, md: 3 },
        pb: 3,
        pt: 1,
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        AquaAdmin Water Control System
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'success.main',
            boxShadow: '0 0 0 6px rgba(34, 197, 94, 0.12)',
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          Sistema operativo - v1.0
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Footer;
