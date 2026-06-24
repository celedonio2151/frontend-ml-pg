import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Image from 'components/base/Image';
import errorImg from '../../assets/404.svg';

const ErrorPage = () => {
  return (
    <Stack spacing={3} sx={{ alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <Image src={errorImg} sx={{ width: 1 / 2, height: 1 / 2 }} />
      <Button variant="contained" component={Link} href="/">
        Go To Dashboard
      </Button>
    </Stack>
  );
};

export default ErrorPage;
