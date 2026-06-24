import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';

const LinearLoader = ({ sx, ...props }: StackProps) => {
  return (
    <Stack
      sx={[
        { justifyContent: 'center', alignItems: 'center', height: '100vh' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Box sx={{ width: '50vw' }}>
        <LinearProgress />
      </Box>
    </Stack>
  );
};

export default LinearLoader;
