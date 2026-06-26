import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useUIStore } from 'shared/stores/ui.store';

function ShowcaseTopbar() {
  const mode = useUIStore((state) => state.themeMode);
  const toggleMode = useUIStore((state) => state.toggleTheme);

  return (
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
  );
}

export default ShowcaseTopbar;
