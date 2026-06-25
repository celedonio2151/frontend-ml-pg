import Drawer from '@mui/material/Drawer';
import type { Theme } from '@mui/material/styles';
import DrawerItems from './DrawerItems';
import { useUIStore } from 'shared/stores/ui.store';

type SidebarProps = {
  drawerWidth: number;
  miniDrawerWidth: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

function Sidebar({ drawerWidth, miniDrawerWidth, mobileOpen, setMobileOpen }: SidebarProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const getPaperStyles = (theme: Theme, width: number) => ({
    width,
    overflowX: 'hidden',
    borderRight: `1px solid ${
      theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.14)'
    }`,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(8, 47, 73, 0.82), rgba(6, 13, 24, 0.92))'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(224, 242, 254, 0.82))',
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at 18% 8%, rgba(34, 211, 238, 0.14), transparent 18rem)'
        : 'radial-gradient(circle at 18% 8%, rgba(14, 165, 233, 0.12), transparent 18rem)',
    backdropFilter: 'blur(26px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '18px 0 52px rgba(2, 6, 23, 0.26)'
        : '18px 0 52px rgba(14, 116, 144, 0.12)',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
  });

  return (
    <>
      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={handleMobileClose}
        open={mobileOpen}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': (theme) => getPaperStyles(theme, drawerWidth),
        }}
        variant="temporary"
      >
        <DrawerItems expanded onNavigate={handleMobileClose} />
      </Drawer>

      <Drawer
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          flexShrink: 0,
          width: sidebarOpen ? drawerWidth : miniDrawerWidth,
          '& .MuiDrawer-paper': (theme) =>
            getPaperStyles(theme, sidebarOpen ? drawerWidth : miniDrawerWidth),
        }}
        variant="permanent"
      >
        <DrawerItems expanded={sidebarOpen} />
      </Drawer>
    </>
  );
}

export default Sidebar;
