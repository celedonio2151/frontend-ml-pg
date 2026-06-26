import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRounded from '@mui/icons-material/AddRounded';
import ApiRounded from '@mui/icons-material/ApiRounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';

function HeroSection() {
  return (
    <AquaPanel
      liquid
      sx={{
        p: { xs: 3, md: 4 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(8,47,73,0.92), rgba(6,13,24,0.94))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(224,242,254,0.72))',
      }}
    >
      <Stack spacing={2.5} sx={{ maxWidth: 780 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <StatusPill label="Sistema activo" pulse tone="success" />
          <StatusPill label="MUI + X Date Pickers" tone="aqua" />
          <StatusPill label="Arquitectura por dominio" tone="purple" />
        </Stack>
        <Typography variant="h1" sx={{ maxWidth: 740, fontWeight: 900 }}>
          Showroom publico para el panel hidrico AquaAdmin
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
          Replica la direccion visual del HTML de referencia en componentes React/MUI: vidrio oscuro,
          bordes liquidos, estados, formularios, tablas, cards, acciones, API docs y controles listos
          para conectar.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" startIcon={<AddRounded />}>
            Nueva lectura
          </Button>
          <Button variant="outlined" startIcon={<ApiRounded />}>
            Ver contratos API
          </Button>
        </Stack>
      </Stack>
    </AquaPanel>
  );
}

export default HeroSection;
