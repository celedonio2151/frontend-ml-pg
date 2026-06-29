import type { SxProps, Theme } from '@mui/material/styles';

export const dataTableStyles: Record<string, SxProps<Theme>> = {
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 2,
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(14, 23, 42, 0.72)'
        : 'rgba(255, 255, 255, 0.84)',
    border: (theme) =>
      `1px solid ${
        theme.palette.mode === 'dark' ? 'rgba(34, 211, 238, 0.32)' : 'rgba(2, 132, 199, 0.20)'
      }`,
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 24px 70px rgba(2, 6, 23, 0.28)'
        : '0 24px 70px rgba(3, 105, 161, 0.14)',
    backdropFilter: 'blur(24px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      p: '1px',
      borderRadius: 'inherit',
      background:
        'linear-gradient(135deg, rgba(34, 211, 238, 0.38), rgba(14, 165, 233, 0.08), rgba(34, 211, 238, 0.18))',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
    },
  },
  toolbar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    px: 3,
    py: 2,
    borderBottom: (theme) =>
      `1px solid ${
        theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.10)' : 'rgba(2, 132, 199, 0.12)'
      }`,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minWidth: 0,
  },
  toolbarRight: {
    display: 'flex',
    alignItems: { xs: 'stretch', sm: 'center' },
    flexDirection: { xs: 'column-reverse', sm: 'row' },
    gap: 1.25,
  },
  searchField: {
    minWidth: { xs: 1, sm: 300 },
    '& .MuiOutlinedInput-root': {
      height: 42,
      borderRadius: 1.5,
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(8, 47, 73, 0.38)' : 'rgba(224, 242, 254, 0.56)',
      '& fieldset': {
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.14)' : 'rgba(2, 132, 199, 0.18)',
      },
      '&:hover fieldset, &.Mui-focused fieldset': {
        borderColor: 'rgba(34, 211, 238, 0.42)',
      },
    },
  },
  tableContainer: {
    position: 'relative',
    zIndex: 1,
    background: 'transparent',
    overflowX: 'auto',
  },
  table: {
    minWidth: 760,
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  headerCell: {
    verticalAlign: 'top',
    borderBottom: (theme) =>
      `1px solid ${
        theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.10)' : 'rgba(2, 132, 199, 0.12)'
      }`,
    color: 'primary.light',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.08em',
    px: 3,
    py: 2,
    textTransform: 'uppercase',
    whiteSpace: 'normal',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 0.75,
    minWidth: 0,
  },
  headerLabel: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  filterInput: {
    mt: 0,
    minWidth: 126,
    textTransform: 'none',
    '& .MuiOutlinedInput-root': {
      height: 34,
      borderRadius: 1.25,
      fontSize: 12,
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(8, 47, 73, 0.26)' : 'rgba(240, 249, 255, 0.58)',
      '& fieldset': {
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.10)' : 'rgba(2, 132, 199, 0.14)',
      },
      '&:hover fieldset, &.Mui-focused fieldset': {
        borderColor: 'rgba(34, 211, 238, 0.36)',
      },
    },
  },
  numberFilterGroup: {
    width: 1,
    minWidth: 150,
    mt: 0,
    '& .MuiTextField-root': {
      minWidth: 70,
    },
  },
  bodyRow: {
    '&:hover': {
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.07)' : 'rgba(14, 165, 233, 0.08)',
    },
  },
  bodyCell: {
    borderBottom: (theme) =>
      `1px solid ${
        theme.palette.mode === 'dark' ? 'rgba(125, 211, 252, 0.08)' : 'rgba(2, 132, 199, 0.10)'
      }`,
    px: 3,
    py: 2.25,
  },
  emptyCell: {
    borderBottom: 0,
    color: 'text.secondary',
    px: 3,
    py: 6,
  },
};
