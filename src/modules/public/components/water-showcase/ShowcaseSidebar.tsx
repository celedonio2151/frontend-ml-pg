import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { navItems } from 'modules/public/data/waterShowcaseData';
import { waterShowcaseStyles } from './waterShowcase.styles';

const navIconStyles: SxProps<Theme> = {
  color: 'primary.light',
  fontSize: 20,
};

function ShowcaseSidebar() {
  return (
    <AquaPanel strong sx={waterShowcaseStyles.sidebar}>
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
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
              {item.badge ? (
                <StatusPill label={item.badge} tone={item.badge === '23' ? 'error' : 'aqua'} sx={{ height: 22 }} />
              ) : null}
            </Button>
          ))}
        </Stack>

        <Box sx={{ p: 2 }}>
          <AquaPanel sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                AP
              </Avatar>
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
  );
}

export default ShowcaseSidebar;
