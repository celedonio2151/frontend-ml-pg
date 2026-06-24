import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';

const Progress = ({ sx, ...props }: StackProps) => {
  return (
    <Stack
      sx={[
        { justifyContent: 'center', alignItems: 'center', height: '100vh' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Box sx={{ height: 50, width: 50 }}>
        <CircularProgress />
      </Box>
    </Stack>
  );
};

export default Progress;
