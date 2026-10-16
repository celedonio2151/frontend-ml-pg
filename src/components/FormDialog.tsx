import type { ReactNode, SubmitEventHandler } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI ICONS
import CloseRounded from '@mui/icons-material/CloseRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';

import AquaPanel from 'shared/ui/aqua/AquaPanel';

type FormDialogProps = {
  cancelLabel?: string;
  children: ReactNode;
  disableClose?: boolean;
  disableSubmit?: boolean;
  error?: ReactNode;
  formId: string;
  isSubmitting?: boolean;
  maxWidth?: DialogProps['maxWidth'];
  onClose: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  open: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  title: ReactNode;
};

const FormDialog = ({
  cancelLabel = 'Cancelar',
  children,
  disableClose = false,
  disableSubmit = false,
  error,
  formId,
  isSubmitting = false,
  maxWidth = 'sm',
  onClose,
  onSubmit,
  open,
  submitLabel = 'Guardar',
  submittingLabel = 'Guardando...',
  title,
}: FormDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    if (!disableClose && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      scroll="body"
      maxWidth={maxWidth}
      onClose={handleClose}
      open={open}
      slotProps={{
        paper: {
          // Con scroll="body" MUI centra el papel como inline-block: no cambiar su `display`.
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: 'none',
            overflow: 'hidden',
            // En móvil (fullScreen + scroll="body") MUI aplica además, por media query,
            // maxWidth: calc(100% - 64px) según `maxWidth`, que gana a fullScreen y deja
            // márgenes. `&&` sube la especificidad para forzar pantalla completa; la altura
            // crece con el formulario (fullScreen la fija en 100% y se recortaría).
            ...(isMobile
              ? {
                  '&&': {
                    margin: 0,
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    minHeight: '100%',
                    borderRadius: 0,
                  },
                }
              : {}),
          },
        },
      }}
    >
      <AquaPanel
        liquid
        sx={{
          borderRadius: isMobile ? 0 : 3,
          p: { xs: 2, sm: 3 },
          pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 3 },
          ...(isMobile ? { minHeight: '100dvh' } : {}),
        }}
      >
        <Stack spacing={2}>
          <DialogTitle
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {title}
            </Typography>
            <IconButton disabled={disableClose || isSubmitting} onClick={handleClose} size="small">
              <CloseRounded />
            </IconButton>
          </DialogTitle>

          <Box
            component="form"
            id={formId}
            onSubmit={onSubmit}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              {/* Sin scroll interno: con scroll="body" se desplaza toda la página. */}
              <DialogContent sx={{ overflow: 'visible', p: 0, pt: 1 }}>{children}</DialogContent>

              <DialogActions
                sx={{
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  p: 0,
                  '& > :not(style) ~ :not(style)': { ml: 0 },
                }}
              >
                <Button
                  disabled={disableClose || isSubmitting}
                  onClick={handleClose}
                  startIcon={<CloseRounded />}
                  variant="outlined"
                >
                  {cancelLabel}
                </Button>
                <Button
                  disabled={disableSubmit || isSubmitting}
                  form={formId}
                  startIcon={<SaveRounded />}
                  type="submit"
                  variant="contained"
                >
                  {isSubmitting ? submittingLabel : submitLabel}
                </Button>
              </DialogActions>
            </Stack>
          </Box>
        </Stack>
      </AquaPanel>
    </Dialog>
  );
};

export default FormDialog;
