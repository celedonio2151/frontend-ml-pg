import WaterDropRounded from '@mui/icons-material/WaterDropRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PropsWithChildren } from 'react';
import { Outlet } from 'react-router';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(420px, 520px) 1fr' },
        overflow: 'hidden',
        color: 'text.primary',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.22), transparent 32rem), #06111f'
            : 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 32rem), #f0f9ff',
      }}
    >
      <Stack
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          justifyContent: 'center',
          px: { xs: 2, sm: 5 },
          py: 5,
        }}
      >
        {children ?? <Outlet />}
      </Stack>

      <Box
        sx={{
          position: 'relative',
          display: { xs: 'none', lg: 'grid' },
          placeItems: 'center',
          overflow: 'hidden',
          borderLeft: (theme) =>
            `1px solid ${
              theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.14)'
            }`,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(8, 47, 73, 0.64), rgba(14, 23, 42, 0.52))'
              : 'linear-gradient(135deg, rgba(224, 242, 254, 0.78), rgba(255, 255, 255, 0.58))',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              borderRadius: '50%',
              filter: 'blur(80px)',
            },
            '&::before': {
              width: 460,
              height: 460,
              top: '12%',
              left: '12%',
              background: 'rgba(34, 211, 238, 0.20)',
            },
            '&::after': {
              width: 560,
              height: 560,
              right: '-12%',
              bottom: '-14%',
              background: 'rgba(14, 165, 233, 0.22)',
            },
          }}
        />

        <Stack
          spacing={3}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 560,
            px: 6,
          }}
        >
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: 'primary.contrastText',
              background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
              boxShadow: '0 24px 70px rgba(6, 182, 212, 0.34)',
            }}
          >
            <WaterDropRounded sx={{ fontSize: 44 }} />
          </Box>

          <Stack spacing={1.5}>
            <Typography variant="h2" sx={{ fontWeight: 950, lineHeight: 1 }}>
              AquaAdmin
            </Typography>
            <Typography color="text.secondary" variant="h6" sx={{ maxWidth: 480 }}>
              Control operativo para usuarios, medidores, lecturas y facturacion del sistema de agua.
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default AuthLayout;
