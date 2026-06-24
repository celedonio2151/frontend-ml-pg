import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

type SectionHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle: string;
  title: string;
};

const styles: Record<string, SxProps<Theme>> = {
  root: {
    alignItems: { xs: 'flex-start', md: 'center' },
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    gap: 2,
  },
  eyebrow: {
    color: 'primary.light',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
};

function SectionHeader({ action, eyebrow, subtitle, title }: SectionHeaderProps) {
  return (
    <Stack sx={styles.root}>
      <Stack spacing={0.5}>
        {eyebrow ? (
          <Typography variant="caption" sx={styles.eyebrow}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h4" component="h2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Stack>
      {action}
    </Stack>
  );
}

export default SectionHeader;
