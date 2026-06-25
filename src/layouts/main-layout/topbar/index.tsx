import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import MenuOpenRounded from '@mui/icons-material/MenuOpenRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import LanguageSelect from './LanguageSelect';
import ProfileMenu from './ProfileMenu';
import { useUIStore } from 'shared/stores/ui.store';

type TopbarProps = {
  drawerWidth: number;
  miniDrawerWidth: number;
  setMobileOpen: (open: boolean) => void;
  topbarHeight: number;
};

function Topbar({ drawerWidth, miniDrawerWidth, setMobileOpen, topbarHeight }: TopbarProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const themeMode = useUIStore((state) => state.themeMode);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const handleMobileOpen = () => {
    setMobileOpen(true);
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={(theme) => ({
        left: { xs: 0, lg: sidebarOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px` },
        minHeight: topbarHeight,
        right: 0,
        width: {
          xs: 1,
          lg: sidebarOpen
            ? `calc(100% - ${drawerWidth}px)`
            : `calc(100% - ${miniDrawerWidth}px)`,
        },
        background:
          theme.palette.mode === 'dark'
            ? 'rgba(6, 13, 24, 0.72)'
            : 'rgba(240, 249, 255, 0.76)',
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(125, 211, 252, 0.12)'
            : 'rgba(2, 132, 199, 0.14)'
        }`,
        color: 'text.primary',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 18px 54px rgba(2, 6, 23, 0.22)'
            : '0 18px 54px rgba(14, 116, 144, 0.10)',
        transition: theme.transitions.create(['left', 'width'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),
      })}
    >
      <Toolbar
        disableGutters
        sx={{
          gap: 2,
          justifyContent: 'space-between',
          minHeight: `${topbarHeight}px !important`,
          px: { xs: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} sx={{ alignItems: 'center', minWidth: 0 }}>
          <Tooltip title="Abrir menu">
            <IconButton
              aria-label="Abrir menu"
              color="primary"
              onClick={handleMobileOpen}
              sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
            >
              <MenuRounded />
            </IconButton>
          </Tooltip>

          <Tooltip title={sidebarOpen ? 'Contraer menu' : 'Expandir menu'}>
            <IconButton
              aria-label={sidebarOpen ? 'Contraer menu' : 'Expandir menu'}
              color="primary"
              onClick={toggleSidebar}
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            >
              {sidebarOpen ? <MenuOpenRounded /> : <MenuRounded />}
            </IconButton>
          </Tooltip>

          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: { xs: 'grid', lg: 'none' },
                placeItems: 'center',
                color: 'primary.contrastText',
                background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
                boxShadow: '0 16px 30px rgba(6, 182, 212, 0.22)',
              }}
            >
              <WaterDropRounded fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                Panel AquaAdmin
              </Typography>
              <Typography
                noWrap
                color="text.secondary"
                variant="caption"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                Gestion hidrica municipal
              </Typography>
            </Box>
          </Stack>

          <TextField
            placeholder="Buscar usuarios, medidores..."
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              display: { xs: 'none', md: 'block' },
              ml: { md: 1 },
              width: { md: 310, xl: 420 },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} sx={{ alignItems: 'center' }}>
          <Tooltip title="Buscar">
            <IconButton color="primary" sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
              <SearchRounded />
            </IconButton>
          </Tooltip>

          <LanguageSelect />

          <Tooltip title="Cambiar tema">
            <IconButton aria-label="Cambiar tema" color="primary" onClick={toggleTheme}>
              {themeMode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notificaciones">
            <IconButton aria-label="Notificaciones" color="primary">
              <Badge color="error" overlap="circular" variant="dot">
                <NotificationsRounded />
              </Badge>
            </IconButton>
          </Tooltip>

          <ProfileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
