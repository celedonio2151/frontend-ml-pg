import Stack from '@mui/material/Stack';
import SignInImage from 'assets/images/auth/signin-image.png';
import SignUpImage from 'assets/images/auth/signup-image.png';
import Image from 'components/base/Image';
import { type PropsWithChildren } from 'react';
import { useLocation } from 'react-router';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const pathname = location.pathname.split('/').pop();

  return (
    <Stack sx={{ height: '100vh', justifyContent: 'space-between' }}>
      <Stack
        sx={{
          bgcolor: 'info.lighter',
          height: 'auto',
          minHeight: 1,
          overflow: 'scroll',
          px: { xs: 2, sm: 5 },
          width: { xs: 1, lg: 450 },
        }}
      >
        {children}
      </Stack>
      <Stack
        direction="column"
        sx={{
          alignItems: 'center',
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          height: 1,
          justifyContent: 'center',
        }}
      >
        <Image src={pathname === 'signin' ? SignInImage : SignUpImage} height="55%" />
      </Stack>
    </Stack>
  );
};

export default AuthLayout;
