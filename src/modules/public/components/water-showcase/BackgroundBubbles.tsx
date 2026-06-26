import Box from '@mui/material/Box';

const bubbleItems = [
  { delay: '0s', duration: '12s', left: '10%', size: 20 },
  { delay: '2s', duration: '15s', left: '24%', size: 15 },
  { delay: '4s', duration: '10s', left: '45%', size: 25 },
  { delay: '1s', duration: '14s', left: '65%', size: 18 },
  { delay: '3s', duration: '11s', left: '80%', size: 12 },
  { delay: '5s', duration: '13s', left: '90%', size: 22 },
] as const;

function BackgroundBubbles() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: '-12%',
          left: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(14, 165, 233, 0.06)' : 'rgba(14, 165, 233, 0.16)',
          filter: 'blur(96px)',
          animation: 'aquaPulseGlow 3.2s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '-12%',
          bottom: '-14%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.13)',
          filter: 'blur(120px)',
          animation: 'aquaPulseGlow 4s ease-in-out infinite',
          animationDelay: '1.4s',
        }}
      />
      {bubbleItems.map((bubble) => (
        <Box
          key={`${bubble.left}-${bubble.size}`}
          sx={{
            position: 'absolute',
            bottom: -40,
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 32% 28%, rgba(34, 211, 238, 0.34), rgba(6, 182, 212, 0.04) 72%)'
                : 'radial-gradient(circle at 32% 28%, rgba(6, 182, 212, 0.30), rgba(14, 165, 233, 0.05) 72%)',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.12)' : 'rgba(2, 132, 199, 0.16)'
              }`,
            animation: `bubbleRise ${bubble.duration} linear infinite`,
            animationDelay: bubble.delay,
            boxShadow: '0 0 28px rgba(34, 211, 238, 0.12)',
          }}
        />
      ))}
    </Box>
  );
}

export default BackgroundBubbles;
