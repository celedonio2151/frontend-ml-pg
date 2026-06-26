import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRounded from '@mui/icons-material/AddRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import CircularProgressMock from './CircularProgressMock';
import ConsumptionChart from './ConsumptionChart';
import { waterShowcaseStyles } from './waterShowcase.styles';

function OperationsOverview() {
  return (
    <Box sx={waterShowcaseStyles.twoColumn}>
      <AquaPanel liquid>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Consumo de Agua
            </Typography>
            <Typography color="text.secondary">
              Metros cubicos por mes, preparado para Chart.js o MUI X Charts.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined">
              Mensual
            </Button>
            <Button size="small" color="inherit">
              Anual
            </Button>
          </Stack>
        </Stack>
        <ConsumptionChart />
      </AquaPanel>

      <Stack spacing={2}>
        <AquaPanel liquid>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
            Tasa de Cobro
          </Typography>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgressMock value={80} />
            </Box>
            <Stack spacing={1}>
              <StatusPill label="Pagado Bs. 45,230" tone="success" />
              <StatusPill label="Pendiente Bs. 11,307" tone="warning" />
            </Stack>
          </Stack>
        </AquaPanel>

        <AquaPanel liquid>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
            Acciones Rapidas
          </Typography>
          <Stack spacing={1}>
            <Button fullWidth variant="outlined" startIcon={<AddRounded />} sx={{ justifyContent: 'flex-start' }}>
              Nueva lectura
            </Button>
            <Button fullWidth variant="outlined" startIcon={<PeopleAltRounded />} sx={{ justifyContent: 'flex-start' }}>
              Registrar usuario
            </Button>
            <Button fullWidth variant="outlined" startIcon={<QrCode2Rounded />} sx={{ justifyContent: 'flex-start' }}>
              Generar QR BNB
            </Button>
          </Stack>
        </AquaPanel>
      </Stack>
    </Box>
  );
}

export default OperationsOverview;
