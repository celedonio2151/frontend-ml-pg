import { useState, type MouseEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountCircleRounded from '@mui/icons-material/AccountCircleRounded';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';

type ProfileAction = {
  danger?: boolean;
  icon: typeof AccountCircleRounded;
  label: string;
};

const profileActions: ProfileAction[] = [
  { label: 'Mi perfil', icon: AccountCircleRounded },
  { label: 'Preferencias', icon: SettingsRounded },
  { label: 'Notificaciones', icon: NotificationsRounded },
  { label: 'Centro de ayuda', icon: HelpOutlineRounded },
  { label: 'Cerrar sesion', icon: LogoutRounded, danger: true },
];

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        aria-controls={open ? 'profile-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-label="Abrir perfil"
        disableRipple
        onClick={handleOpen}
        sx={{
          borderRadius: 2,
          p: 0.35,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(6, 182, 212, 0.08)'
              : 'rgba(14, 165, 233, 0.10)',
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(125, 211, 252, 0.12)'
                : 'rgba(2, 132, 199, 0.14)'
            }`,
        }}
      >
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          AP
        </Avatar>
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="profile-menu"
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          mt: 1.25,
          '& .MuiList-root': { minWidth: 250, p: 0 },
        }}
      >
        <Box sx={{ p: 1 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1, py: 1.25 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 900 }}>
              AP
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 900 }}>
                Admin Principal
              </Typography>
              <Typography noWrap color="text.secondary" variant="caption">
                admin@aqua.system
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: 0.75 }}>
          {profileActions.map((item) => {
            const Icon = item.icon;

            return (
              <MenuItem
                key={item.label}
                onClick={handleClose}
                sx={{
                  borderRadius: 1.5,
                  color: item.danger ? 'error.main' : 'text.primary',
                  gap: 1.25,
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.label}
                </Typography>
              </MenuItem>
            );
          })}
        </Box>
      </Menu>
    </>
  );
}

export default ProfileMenu;
