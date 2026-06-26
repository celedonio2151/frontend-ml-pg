import Box from '@mui/material/Box';
import { useState, type PropsWithChildren } from 'react';
import { Outlet } from 'react-router';

import { useUIStore } from 'shared/stores/ui.store';
import Footer from './footer';
import Sidebar from './sidebar';
import Topbar from './topbar';

const drawerWidth = 288;
const miniDrawerWidth = 86;
const topbarHeight = 84;

function LayoutBubbles() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        '&::before': {
          position: 'absolute',
          top: '-18%',
          left: '-12%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.16)',
          content: '""',
          filter: 'blur(92px)',
        },
        '&::after': {
          position: 'absolute',
          right: '-14%',
          bottom: '-18%',
          width: 620,
          height: 620,
          borderRadius: '50%',
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.07)' : 'rgba(6, 182, 212, 0.14)',
          content: '""',
          filter: 'blur(116px)',
        },
      }}
    >
      {[12, 22, 34, 48, 64, 78, 91].map((left, index) => (
        <Box
          key={left}
          sx={{
            position: 'absolute',
            bottom: -48,
            left: `${left}%`,
            width: 12 + (index % 4) * 5,
            height: 12 + (index % 4) * 5,
            borderRadius: '50%',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(125, 211, 252, 0.14)'
                  : 'rgba(2, 132, 199, 0.18)'
              }`,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 32% 28%, rgba(34, 211, 238, 0.30), rgba(6, 182, 212, 0.05) 72%)'
                : 'radial-gradient(circle at 32% 28%, rgba(6, 182, 212, 0.28), rgba(14, 165, 233, 0.06) 72%)',
            boxShadow: '0 0 28px rgba(34, 211, 238, 0.14)',
            animation: `aquaLayoutBubbleRise ${11 + index}s linear infinite`,
            animationDelay: `${index * 0.75}s`,
          }}
        />
      ))}
    </Box>
  );
}

function MainLayout({ children }: PropsWithChildren) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarOffset = {
    xs: 0,
    lg: sidebarOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: 'text.primary',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 34rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 36rem), #060d18'
            : 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.14), transparent 34rem), radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.12), transparent 36rem), #f0f9ff',
        overflowX: 'hidden',
        '@keyframes aquaLayoutBubbleRise': {
          '0%': {
            opacity: 0,
            transform: 'translate3d(0, 0, 0) scale(0.85)',
          },
          '12%': {
            opacity: 0.74,
          },
          '100%': {
            opacity: 0,
            transform: 'translate3d(18px, -112vh, 0) scale(1.25)',
          },
        },
      }}
    >
      <LayoutBubbles />
      <Sidebar
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box
        sx={(theme) => ({
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          ml: sidebarOffset,
          transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
        })}
      >
        <Topbar
          drawerWidth={drawerWidth}
          miniDrawerWidth={miniDrawerWidth}
          setMobileOpen={setMobileOpen}
          topbarHeight={topbarHeight}
        />
        <Box
          component="main"
          sx={{
            minHeight: `calc(100vh - ${topbarHeight}px - 76px)`,
            px: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
            pt: `calc(${topbarHeight}px + 24px)`,
          }}
        >
          {/* {children} */}
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default MainLayout;
