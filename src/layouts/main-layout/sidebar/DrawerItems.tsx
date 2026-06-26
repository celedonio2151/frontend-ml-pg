import ApiRounded from '@mui/icons-material/ApiRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import paths from 'router/paths';

type DrawerItemsProps = {
  expanded: boolean;
  onNavigate?: () => void;
};

type NavItem = {
  badge?: string;
  href: string;
  icon: typeof DashboardRounded;
  label: string;
};

type NavSection = {
  items: NavItem[];
  title: string;
};

const navSections: NavSection[] = [
  {
    title: 'Operacion',
    items: [
      { label: 'Dashboard', href: paths.admin.dashboard, icon: DashboardRounded, badge: 'Live' },
      { label: 'Usuarios', href: paths.admin.users, icon: PeopleAltRounded },
      { label: 'Medidores', href: paths.admin.meters, icon: SpeedRounded },
      { label: 'Lecturas', href: paths.admin.readings, icon: WaterDropRounded, badge: '23' },
      { label: 'Facturas', href: paths.admin.invoices, icon: ReceiptLongRounded },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { label: 'Roles', href: paths.admin.roles, icon: ShieldRounded },
      { label: 'Directiva', href: paths.admin.directiva, icon: GroupsRounded },
      { label: 'API Docs', href: paths.admin.apidocs, icon: ApiRounded },
      { label: 'Configuracion', href: paths.admin.settings, icon: SettingsRounded },
    ],
  },
];

const getCurrentPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.pathname;
};

function DrawerItems({ expanded, onNavigate }: DrawerItemsProps) {
  const currentPath = getCurrentPath();

  return (
    <Stack sx={{ minHeight: '100%', px: 1.5, py: 2.5 }}>
      <ButtonBase
        component="a"
        disableRipple
        href="/"
        onClick={onNavigate}
        sx={{
          borderRadius: 2,
          display: 'flex',
          gap: expanded ? 1.5 : 0,
          justifyContent: expanded ? 'flex-start' : 'center',
          mb: 2,
          minHeight: 58,
          px: expanded ? 1.5 : 1,
          textAlign: 'left',
          width: 1,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: 'grid',
            flexShrink: 0,
            placeItems: 'center',
            color: 'primary.contrastText',
            background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
            boxShadow: '0 18px 34px rgba(6, 182, 212, 0.25)',
          }}
        >
          <WaterDropRounded />
        </Box>
        {expanded ? (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Aqua<span style={{ color: '#22d3ee' }}>Admin</span>
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
              sx={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Water Control
            </Typography>
          </Box>
        ) : null}
      </ButtonBase>

      <Box
        sx={{
          borderRadius: 2,
          mb: 2,
          mx: expanded ? 0.5 : 0,
          p: expanded ? 1.5 : 1,
          textAlign: expanded ? 'left' : 'center',
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(14, 165, 233, 0.10)',
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(125, 211, 252, 0.12)'
                : 'rgba(2, 132, 199, 0.14)'
            }`,
        }}
      >
        <Stack direction={expanded ? 'row' : 'column'} spacing={1.25} sx={{ alignItems: 'center' }}>
          <Badge
            color="success"
            overlap="circular"
            variant="dot"
            sx={{ '& .MuiBadge-badge': { boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.18)' } }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'primary.light',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <WaterDropRounded fontSize="small" />
            </Box>
          </Badge>
          {expanded ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 800 }}>
                Sistema activo
              </Typography>
              <Typography noWrap color="text.secondary" variant="caption">
                98.7% sensores online
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>

      <Stack component="nav" spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {navSections.map((section) => (
          <Box key={section.title}>
            {expanded ? (
              <Typography
                color="text.secondary"
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 800,
                  mb: 1,
                  px: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                {section.title}
              </Typography>
            ) : (
              <Divider sx={{ mb: 1.25, mx: 1.25 }} />
            )}

            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon;
                const selected = item.href === '/' ? currentPath === '/' : false;

                return (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip
                      arrow
                      disableHoverListener={expanded}
                      placement="right"
                      title={item.label}
                    >
                      <ListItemButton
                        component="a"
                        href={item.href}
                        onClick={onNavigate}
                        selected={selected}
                        sx={{
                          borderRadius: 2,
                          justifyContent: expanded ? 'flex-start' : 'center',
                          minHeight: 48,
                          px: expanded ? 1.5 : 1,
                          '&.Mui-selected': {
                            color: 'primary.light',
                            background:
                              'linear-gradient(90deg, rgba(6, 182, 212, 0.18), rgba(14, 165, 233, 0.04))',
                            borderLeft: '3px solid #22d3ee',
                            '&:hover': {
                              background:
                                'linear-gradient(90deg, rgba(6, 182, 212, 0.24), rgba(14, 165, 233, 0.07))',
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: selected ? 'primary.light' : 'text.secondary',
                            justifyContent: 'center',
                            minWidth: expanded ? 42 : 0,
                          }}
                        >
                          <Icon fontSize="small" />
                        </ListItemIcon>
                        {expanded ? (
                          <>
                            <ListItemText
                              primary={item.label}
                              slotProps={{ primary: { sx: { fontWeight: selected ? 800 : 600 } } }}
                            />
                            {item.badge ? (
                              <Box
                                component="span"
                                sx={{
                                  borderRadius: 99,
                                  color: item.badge === '23' ? 'error.light' : 'success.light',
                                  fontSize: 11,
                                  fontWeight: 800,
                                  px: 1,
                                  py: 0.25,
                                  backgroundColor:
                                    item.badge === '23'
                                      ? 'rgba(248, 113, 113, 0.12)'
                                      : 'rgba(34, 197, 94, 0.12)',
                                }}
                              >
                                {item.badge}
                              </Box>
                            ) : null}
                          </>
                        ) : null}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          borderRadius: 2,
          display: expanded ? 'block' : 'none',
          mt: 2,
          overflow: 'hidden',
          p: 2,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.16), rgba(14, 165, 233, 0.06))',
          border: '1px solid rgba(125, 211, 252, 0.14)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>
          Proxima alerta
        </Typography>
        <Typography color="text.secondary" variant="caption">
          Sector Norte requiere revision preventiva en 2 horas.
        </Typography>
      </Box>
    </Stack>
  );
}

export default DrawerItems;
