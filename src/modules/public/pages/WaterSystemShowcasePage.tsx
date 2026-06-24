import { useState, type SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useUIStore } from 'shared/stores/ui.store';
import AddRounded from '@mui/icons-material/AddRounded';
import ApiRounded from '@mui/icons-material/ApiRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import FileDownloadRounded from '@mui/icons-material/FileDownloadRounded';
import FilterAltRounded from '@mui/icons-material/FilterAltRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import MetricCard from 'shared/ui/aqua/MetricCard';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import StatusPill from 'shared/ui/aqua/StatusPill';
import {
  apiSnippet,
  consumptionBars,
  endpoints,
  invoices,
  meters,
  metrics,
  navItems,
  users,
} from 'modules/public/data/waterShowcaseData';

type Tone = 'aqua' | 'success' | 'warning' | 'error' | 'neutral' | 'purple';

type ColorSwatchProps = {
  color: string;
  label: string;
};

type MeterCardProps = {
  meter: (typeof meters)[number];
};

type ApiEndpointProps = {
  endpoint: (typeof endpoints)[number];
};

const pageStyles: Record<string, SxProps<Theme>> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    color: 'text.primary',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 32rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 34rem), #060d18'
        : 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 32rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 34rem), #f0f9ff',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    opacity: (theme) => (theme.palette.mode === 'dark' ? 0.035 : 0.12),
    backgroundImage: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(rgba(34,211,238,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)'
        : 'linear-gradient(rgba(2,132,199,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(2,132,199,0.42) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: 'min(1480px, 100%)',
    mx: 'auto',
    px: { xs: 2, md: 4 },
    py: { xs: 2, md: 4 },
  },
  shell: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' },
    gap: { xs: 2, lg: 0 },
    minHeight: { lg: 'calc(100vh - 64px)' },
  },
  sidebar: {
    borderRadius: { xs: 3, lg: '24px 0 0 24px' },
    borderRight: { lg: '1px solid rgba(125, 211, 252, 0.12)' },
    p: 0,
  },
  main: {
    borderRadius: { xs: 3, lg: '0 24px 24px 0' },
    borderLeft: { lg: 0 },
    p: 0,
    minWidth: 0,
  },
  topbar: {
    minHeight: 72,
    px: { xs: 2, md: 3 },
    py: 1.5,
    borderBottom: '1px solid rgba(125, 211, 252, 0.12)',
  },
  sectionStack: {
    p: { xs: 2, md: 3 },
  },
  responsiveCards: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
    gap: 2,
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) minmax(300px, 1fr)' },
    gap: 3,
  },
  threeColumn: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
    gap: 2,
  },
  componentGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
    gap: 2,
  },
  codeBlock: {
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0d1117' : 'rgba(255, 255, 255, 0.82)'),
    border: (theme) =>
      `1px solid ${theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.16)'}`,
    borderRadius: 2,
    color: (theme) => (theme.palette.mode === 'dark' ? '#bdefff' : '#075985'),
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    fontSize: 12,
    overflowX: 'auto',
    p: 2,
    whiteSpace: 'pre',
  },
};

const navIconStyles: SxProps<Theme> = {
  color: 'primary.light',
  fontSize: 20,
};

const metricIcons = [
  <WaterDropRounded key="meters" fontSize="small" />,
  <ReceiptLongRounded key="invoices" fontSize="small" />,
  <CheckCircleRounded key="income" fontSize="small" />,
  <WarningAmberRounded key="alerts" fontSize="small" />,
] as const;

const bubbleItems = [
  { delay: '0s', duration: '12s', left: '10%', size: 20 },
  { delay: '2s', duration: '15s', left: '24%', size: 15 },
  { delay: '4s', duration: '10s', left: '45%', size: 25 },
  { delay: '1s', duration: '14s', left: '65%', size: 18 },
  { delay: '3s', duration: '11s', left: '80%', size: 12 },
  { delay: '5s', duration: '13s', left: '90%', size: 22 },
] as const;

const toneByStatus: Record<string, Tone> = {
  Activo: 'success',
  Alerta: 'warning',
  Inactivo: 'error',
  Pagado: 'success',
  Pendiente: 'warning',
  Vencido: 'error',
};

const toneByRole: Record<string, Tone> = {
  ADMIN: 'purple',
  TECHNICAL: 'warning',
  USER: 'aqua',
};

const toneByMethod: Record<string, Tone> = {
  DELETE: 'error',
  GET: 'success',
  PATCH: 'warning',
  POST: 'aqua',
};

function BackgroundBubbles() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: '-12%',
          left: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(14, 165, 233, 0.06)' : 'rgba(14, 165, 233, 0.16)'),
          filter: 'blur(96px)',
          animation: 'aquaPulseGlow 3.2s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '-12%',
          bottom: '-14%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: (theme) => (theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.13)'),
          filter: 'blur(120px)',
          animation: 'aquaPulseGlow 4s ease-in-out infinite',
          animationDelay: '1.4s',
        }}
      />
      {bubbleItems.map((bubble) => (
        <Box
          key={`${bubble.left}-${bubble.size}`}
          sx={{
            position: 'absolute',
            bottom: -40,
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 32% 28%, rgba(34, 211, 238, 0.34), rgba(6, 182, 212, 0.04) 72%)'
                : 'radial-gradient(circle at 32% 28%, rgba(6, 182, 212, 0.30), rgba(14, 165, 233, 0.05) 72%)',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.16)'}`,
            animation: `bubbleRise ${bubble.duration} linear infinite`,
            animationDelay: bubble.delay,
            boxShadow: '0 0 28px rgba(34, 211, 238, 0.12)',
          }}
        />
      ))}
    </Box>
  );
}

function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: color, border: '1px solid rgba(255,255,255,0.16)' }} />
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

function MeterCard({ meter }: MeterCardProps) {
  const tone = meter.tone as Tone;

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
                color: tone === 'warning' ? '#facc15' : tone === 'error' ? '#f87171' : '#22d3ee',
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

function ApiEndpoint({ endpoint }: ApiEndpointProps) {
  return (
    <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', color: 'inherit', '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreRounded sx={{ color: 'text.secondary' }} />}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}>
          <StatusPill label={endpoint.method} tone={toneByMethod[endpoint.method]} />
          <Typography sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 14, color: 'text.primary' }}>
            {endpoint.path}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            {endpoint.description}
          </Typography>
          {endpoint.auth ? <StatusPill label="Bearer" tone="warning" sx={{ ml: 'auto' }} /> : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: '1px solid rgba(125, 211, 252, 0.10)' }}>
        <Box component="pre" sx={pageStyles.codeBlock}>
          {apiSnippet}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function WaterSystemShowcasePage() {
  const theme = useTheme();
  const mode = useUIStore((state) => state.themeMode);
  const toggleMode = useUIStore((state) => state.toggleTheme);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value);
  };

  const handleSaveDemo = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Box sx={pageStyles.page}>
      <BackgroundBubbles />
      <Box sx={pageStyles.gridOverlay} />
      <Box sx={pageStyles.content}>
        <Box sx={pageStyles.shell}>
          <AquaPanel strong sx={pageStyles.sidebar}>
            <Stack sx={{ minHeight: { lg: 'calc(100vh - 64px)' } }}>
              <Stack spacing={2.5} sx={{ p: 3, borderBottom: '1px solid rgba(125, 211, 252, 0.12)' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
                      boxShadow: '0 18px 34px rgba(6, 182, 212, 0.24)',
                    }}
                  >
                    <WaterDropRounded />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      Aqua<span style={{ color: '#22d3ee' }}>Admin</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Water Control System
                    </Typography>
                  </Box>
                </Stack>
                <StatusPill label="Sistema activo" pulse tone="success" />
              </Stack>

              <Stack component="nav" spacing={0.75} sx={{ p: 2, flex: 1 }}>
                {navItems.map((item, index) => (
                  <Button
                    key={item.value}
                    color={index === 0 ? 'primary' : 'inherit'}
                    startIcon={index === 0 ? <DashboardRounded sx={navIconStyles} /> : <WaterDropRounded sx={navIconStyles} />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: index === 0 ? 'text.primary' : 'text.secondary',
                      bgcolor: index === 0 ? 'rgba(6, 182, 212, 0.10)' : 'transparent',
                      borderLeft: index === 0 ? '3px solid #22d3ee' : '3px solid transparent',
                    }}
                  >
                    <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
                      {item.label}
                    </Box>
                    {item.badge ? <StatusPill label={item.badge} tone={item.badge === '23' ? 'error' : 'aqua'} sx={{ height: 22 }} /> : null}
                  </Button>
                ))}
              </Stack>

              <Box sx={{ p: 2 }}>
                <AquaPanel sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'primary.contrastText' }}>AP</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap>
                        Admin Principal
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        admin@aqua.system
                      </Typography>
                    </Box>
                    <IconButton size="small" color="primary">
                      <SettingsRounded fontSize="small" />
                    </IconButton>
                  </Stack>
                </AquaPanel>
              </Box>
            </Stack>
          </AquaPanel>

          <AquaPanel strong sx={pageStyles.main}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                minHeight: 72,
                px: { xs: 2, md: 3 },
                py: 1.5,
                borderBottom: '1px solid rgba(125, 211, 252, 0.12)',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  /
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Componentes publicos
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <TextField
                  placeholder="Buscar..."
                  sx={{ display: { xs: 'none', md: 'block' }, width: 260 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRounded fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Tooltip title="Notificaciones">
                  <IconButton color="primary">
                    <Badge variant="dot" color="error">
                      <NotificationsRounded />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <IconButton color="primary" onClick={toggleMode}>
                  {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
                </IconButton>
              </Stack>
            </Stack>

            <Stack spacing={4} sx={pageStyles.sectionStack}>
              <AquaPanel
                liquid
                sx={{
                  p: { xs: 3, md: 4 },
                  background:
                    mode === 'dark'
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
                    Replica la direccion visual del HTML de referencia en componentes React/MUI: vidrio oscuro, bordes liquidos,
                    estados, formularios, tablas, cards, acciones, API docs y controles listos para conectar.
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

              <Box sx={pageStyles.responsiveCards}>
                {metrics.map((metric, index) => (
                  <MetricCard
                    key={metric.label}
                    change={metric.change}
                    icon={metricIcons[index]}
                    label={metric.label}
                    tone={metric.tone}
                    value={metric.value}
                    waterLevel={metric.waterLevel}
                  />
                ))}
              </Box>

              <Box sx={pageStyles.twoColumn}>
                <AquaPanel liquid>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Consumo de Agua
                      </Typography>
                      <Typography color="text.secondary">Metros cubicos por mes, preparado para Chart.js o MUI X Charts.</Typography>
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

              <SectionHeader
                eyebrow="Componentes de datos"
                title="Tablas, cards y estados"
                subtitle="Piezas que cubren usuarios, medidores, lecturas y facturacion."
                action={
                  <Button variant="contained" startIcon={<FilterAltRounded />}>
                    Filtros
                  </Button>
                }
              />

              <Box sx={pageStyles.twoColumn}>
                <AquaPanel liquid sx={{ p: 0 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Usuario</TableCell>
                          <TableCell>CI</TableCell>
                          <TableCell>Rol</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.ci} hover>
                            <TableCell>
                              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.dark' }}>{user.name.slice(0, 1)}</Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{user.ci}</TableCell>
                            <TableCell>
                              <StatusPill label={user.role} tone={toneByRole[user.role]} />
                            </TableCell>
                            <TableCell>
                              <StatusPill label={user.status} tone={toneByStatus[user.status]} pulse={user.status === 'Activo'} />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Editar">
                                <IconButton size="small" color="primary">
                                  <EditRounded fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton size="small" color="error">
                                  <DeleteRounded fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AquaPanel>

                <Stack spacing={2}>
                  {meters.map((meter) => (
                    <MeterCard key={meter.id} meter={meter} />
                  ))}
                </Stack>
              </Box>

              <Box sx={pageStyles.threeColumn}>
                {invoices.map((invoice) => (
                  <AquaPanel key={invoice.id} hover liquid>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Factura
                          </Typography>
                          <Typography sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}>{invoice.id}</Typography>
                        </Box>
                        <StatusPill label={invoice.status} tone={toneByStatus[invoice.status]} />
                      </Stack>
                      <Divider />
                      <Stack spacing={1}>
                        <Typography variant="body2">{invoice.client}</Typography>
                        <Typography variant="h5" color="primary.light" sx={{ fontWeight: 900 }}>
                          {invoice.amount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invoice.method} · {invoice.date}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton color="primary">
                          <QrCode2Rounded />
                        </IconButton>
                        <IconButton color="primary">
                          <FileDownloadRounded />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </AquaPanel>
                ))}
              </Box>

              <SectionHeader
                eyebrow="Inputs"
                title="Formulario base y controles MUI"
                subtitle="Incluye DatePicker de MUI X, selects, switches, checkboxes, radios, slider, feedback y dialogos."
              />

              <Box sx={pageStyles.componentGrid}>
                <AquaPanel liquid>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Registro de lectura
                    </Typography>
                    <Box component="form">
                      <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField fullWidth label="Medidor" defaultValue="#1001" />
                          <DatePicker label="Fecha de lectura" defaultValue={dayjs('2026-06-24')} slotProps={{ textField: { fullWidth: true } }} />
                        </Stack>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField fullWidth label="Lectura anterior" defaultValue="44,980" />
                          <TextField fullWidth label="Lectura actual" defaultValue="45,230" />
                        </Stack>
                        <TextField select fullWidth label="Estado de facturacion" defaultValue="pending">
                          <MenuItem value="paid">Pagado</MenuItem>
                          <MenuItem value="pending">Pendiente</MenuItem>
                          <MenuItem value="overdue">Vencido</MenuItem>
                        </TextField>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
                          <FormControlLabel control={<Switch defaultChecked />} label="Notificar al usuario" />
                          <FormControlLabel control={<Checkbox defaultChecked />} label="Generar QR" />
                        </Stack>
                        <FormControl>
                          <FormLabel>Metodo preferido</FormLabel>
                          <RadioGroup row defaultValue="qr">
                            <FormControlLabel value="qr" control={<Radio />} label="QR BNB" />
                            <FormControlLabel value="transfer" control={<Radio />} label="Transferencia" />
                          </RadioGroup>
                        </FormControl>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Consumo estimado
                          </Typography>
                          <Slider defaultValue={62} valueLabelDisplay="auto" />
                        </Box>
                        <Stack direction="row" spacing={1.5}>
                          <Button variant="contained" startIcon={<SaveRounded />} onClick={handleSaveDemo}>
                            Guardar demo
                          </Button>
                          <Button variant="outlined" startIcon={<CloseRounded />} onClick={() => setDialogOpen(true)}>
                            Cancelar
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </AquaPanel>

                <AquaPanel liquid>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Feedback y navegacion local
                    </Typography>
                    <Tabs value={tab} onChange={handleTabChange} variant="scrollable">
                      <Tab label="Estados" />
                      <Tab label="Tokens" />
                      <Tab label="API" />
                    </Tabs>
                    {tab === 0 ? (
                      <Stack spacing={1.5}>
                        <Alert severity="success">Lectura registrada y factura generada correctamente.</Alert>
                        <Alert severity="warning">El medidor #1002 esta cerca del maximo permitido.</Alert>
                        <Alert severity="error">Hay 7 usuarios con mora critica.</Alert>
                      </Stack>
                    ) : null}
                    {tab === 1 ? (
                      <Box sx={pageStyles.threeColumn}>
                        <ColorSwatch label="Primary" color={theme.palette.primary.main} />
                        <ColorSwatch label="Secondary" color={theme.palette.secondary.main} />
                        <ColorSwatch label="Paper" color={theme.palette.background.paper} />
                      </Box>
                    ) : null}
                    {tab === 2 ? (
                      <Box component="pre" sx={pageStyles.codeBlock}>
                        {apiSnippet}
                      </Box>
                    ) : null}
                  </Stack>
                </AquaPanel>
              </Box>

              <SectionHeader
                eyebrow="Contratos"
                title="API docs compacta"
                subtitle="Acordeones con metodo, ruta, descripcion, auth y ejemplo de payload."
                action={<StatusPill label="v1.0 online" pulse tone="success" />}
              />

              <AquaPanel liquid sx={{ p: 0 }}>
                <Stack divider={<Divider />}>
                  {endpoints.map((endpoint) => (
                    <ApiEndpoint key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
                  ))}
                </Stack>
              </AquaPanel>
            </Stack>
          </AquaPanel>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Cancelar cambios</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Este dialogo demuestra el componente modal personalizado para acciones sensibles del panel.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Volver</Button>
          <Button color="error" variant="contained" onClick={() => setDialogOpen(false)}>
            Descartar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3200} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          Demo guardada. El componente de snackbar esta listo.
        </Alert>
      </Snackbar>
    </Box>
  );
}

function CircularProgressMock({ value }: { value: number }) {
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

export default WaterSystemShowcasePage;
