import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSimulateBalance } from 'modules/readings/hooks/useReadings';
import { useDebounce } from 'shared/hooks/useDebounce';
import { formatCurrency } from 'shared/utils/formatters';

type ReadingBalancePreviewProps = {
  /** Valor que el usuario está escribiendo en "Lectura actual" (puede ser vacío). */
  currentValue: string;
  isRollover: boolean;
  /** Lectura anterior del medidor; undefined si aún no hay medidor. */
  previousValue?: number;
};

/**
 * Calcula el consumo que implica la lectura (actual − anterior) y consulta
 * GET /readings/balance para mostrar cuánto se pagaría. Es solo informativo:
 * no se envía al backend, que calcula el saldo real al registrar la lectura.
 */
export default function ReadingBalancePreview({
  currentValue,
  isRollover,
  previousValue,
}: ReadingBalancePreviewProps) {
  const current = currentValue.trim() === '' ? NaN : Number(currentValue);
  const hasInputs = Number.isFinite(current) && previousValue !== undefined;

  // consumo (m³) = lectura actual − lectura anterior
  const consumption = hasInputs && !isRollover ? current - previousValue : null;
  const roundedConsumption = consumption === null ? null : Math.round(consumption * 100) / 100;
  const isNegative = roundedConsumption !== null && roundedConsumption < 0;

  const debouncedConsumption = useDebounce(isNegative ? null : roundedConsumption, 500);
  const balanceQuery = useSimulateBalance(debouncedConsumption);

  if (previousValue === undefined) {
    return (
      <Typography variant="caption" color="text.secondary">
        Selecciona un medidor para ver cuánto pagaría con esta lectura.
      </Typography>
    );
  }

  const balance = balanceQuery.data;
  const waiting =
    roundedConsumption !== null && !isNegative && debouncedConsumption !== roundedConsumption;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <AccountBalanceWalletRounded color="primary" />
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            Vista previa del saldo a pagar (no se guarda)
          </Typography>
          {isRollover ? (
            <Typography variant="body2" color="text.secondary">
              Con rollover el backend calcula el consumo al registrar; no hay vista previa.
            </Typography>
          ) : roundedConsumption === null ? (
            <Typography variant="body2" color="text.secondary">
              Ingresa la lectura actual para calcularlo.
            </Typography>
          ) : isNegative ? (
            <Typography variant="body2" color="warning.main">
              La lectura es menor a la anterior ({previousValue}). Si el contador dio la vuelta,
              activa “Rollover”.
            </Typography>
          ) : (
            <Typography variant="body2">
              Anterior {previousValue} → consumo <strong>{roundedConsumption} m³</strong>
              {balance?.billableCubicMeters !== undefined &&
                balance.billableCubicMeters !== roundedConsumption &&
                ` (se cobran ${balance.billableCubicMeters} m³)`}
            </Typography>
          )}
        </Stack>

        {(balanceQuery.isFetching || waiting) && <CircularProgress size={20} />}
        {balance && !waiting && !isNegative && roundedConsumption !== null && (
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 900 }}>
            {formatCurrency(balance.balance)}
          </Typography>
        )}
      </Stack>

      {balanceQuery.isError && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          No se pudo calcular la vista previa.
        </Alert>
      )}
    </Box>
  );
}
