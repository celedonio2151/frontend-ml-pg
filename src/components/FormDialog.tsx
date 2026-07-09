import type { FormEventHandler, ReactNode } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  onSubmit: FormEventHandler<HTMLFormElement>;
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
      maxWidth={maxWidth}
      onClose={handleClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: 'none',
            overflow: 'visible',
          },
        },
      }}
    >
      <AquaPanel liquid sx={{ borderRadius: isMobile ? 0 : 3, p: { xs: 2, sm: 3 } }}>
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

          <Box component="form" id={formId} onSubmit={onSubmit} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              <DialogContent sx={{ overflow: 'visible', p: 0 }}>{children}</DialogContent>

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
