import type { ReactNode } from 'react';

import CloseRounded from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useExpense } from 'modules/expenses/hooks/useExpenses';
import { ExpenseCategory, ExpenseStatus } from 'modules/expenses/types/expense.types';
import type { User } from 'modules/users/types/user.types';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency, formateDate } from 'shared/utils/formatters';

type ExpenseDetailDialogProps = {
  expenseId: string | null;
  onClose: () => void;
};

const statusTone = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'error' } as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography component="div" variant="body2" sx={{ fontWeight: 500 }}>
        {children}
      </Typography>
    </Stack>
  );
}

const userName = (user?: User | null) => (user ? `${user.name} ${user.surname}` : '—');

export default function ExpenseDetailDialog({ expenseId, onClose }: ExpenseDetailDialogProps) {
  const expenseQuery = useExpense(expenseId ?? undefined);
  const expense = expenseQuery.data;

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={Boolean(expenseId)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Detalle del gasto
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {expenseQuery.isLoading && (
          <Stack sx={{ alignItems: 'center', p: 4 }}>
            <CircularProgress />
          </Stack>
        )}

        {expenseQuery.isError && (
          <Alert severity="error">
            {getApiErrorMessage(expenseQuery.error, 'No se pudo cargar el gasto')}
          </Alert>
        )}

        {expense && (
          <Stack spacing={2.5}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900 }}>
                {formatCurrency(expense.amount)}
              </Typography>
              <StatusPill
                label={ExpenseStatus.getLabel(expense.status)}
                tone={statusTone[expense.status]}
                pulse={expense.status === 'PENDING'}
              />
            </Stack>

            <Typography variant="body1">{expense.description}</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Field label="Categoría">{ExpenseCategory.getLabel(expense.category)}</Field>
              <Field label="Fecha del gasto">{formateDate(expense.expenseDate, 'DD MMM YYYY')}</Field>
              <Field label="Nº de recibo">{expense.receiptNumber || '—'}</Field>
              <Field label="Registrado por">{userName(expense.registeredBy)}</Field>
              <Field label="Revisado por">{userName(expense.reviewedBy)}</Field>
              <Field label="Fecha de revisión">
                {expense.reviewedAt ? formateDate(expense.reviewedAt, 'DD MMM YYYY HH:mm') : '—'}
              </Field>
            </Box>

            {expense.status === 'REJECTED' && (
              <Alert severity="error">
                <strong>Motivo del rechazo:</strong> {expense.rejectionReason || 'Sin motivo indicado'}
              </Alert>
            )}

            {expense.receiptImage && (
              <>
                <Divider />
                <Box
                  component="img"
                  src={expense.receiptImage}
                  alt="Comprobante del gasto"
                  sx={{ width: '100%', maxHeight: 360, objectFit: 'contain', borderRadius: 2 }}
                />
              </>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
