import { useState } from 'react';

import CalculateRounded from '@mui/icons-material/CalculateRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useSimulateBalance } from 'modules/readings/hooks/useReadings';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';

type BalanceSimulatorCardProps = {
  /** Oculta el título/ícono grande cuando ya va dentro de un Dialog o panel con su propio título. */
  compact?: boolean;
};

export default function BalanceSimulatorCard({ compact = false }: BalanceSimulatorCardProps) {
  const [cubicMetersInput, setCubicMetersInput] = useState('');
  const [simulatedValue, setSimulatedValue] = useState<number | null>(null);
  const simulationQuery = useSimulateBalance(simulatedValue);

  const handleSimulate = () => {
    const value = Number(cubicMetersInput);
    if (value > 0) setSimulatedValue(value);
  };

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 420 }}>
      {!compact && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <CalculateRounded color="primary" />
          <Typography variant="h6">Simular saldo a pagar</Typography>
        </Stack>
      )}
      <Typography variant="body2" color="text.secondary">
        Calcula cuánto se pagaría por un consumo determinado según las tarifas vigentes. No guarda
        nada, es solo una simulación.
      </Typography>

      <TextField
        label="Consumo (m³)"
        type="number"
        value={cubicMetersInput}
        onChange={(e) => setCubicMetersInput(e.target.value)}
        slotProps={{ input: { endAdornment: <InputAdornment position="end">m³</InputAdornment> } }}
      />

      <Button
        onClick={handleSimulate}
        variant="contained"
        startIcon={<CalculateRounded />}
        sx={{ alignSelf: 'flex-start' }}
        disabled={!cubicMetersInput || Number(cubicMetersInput) <= 0}
      >
        Calcular
      </Button>

      {simulationQuery.isLoading && <CircularProgress size={24} />}

      {simulationQuery.isError && (
        <Alert severity="error">
          {getApiErrorMessage(simulationQuery.error, 'No se pudo calcular el saldo')}
        </Alert>
      )}

      {simulationQuery.data && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Saldo estimado para {simulationQuery.data.cubicMeters} m³:
          </Typography>
          <Typography variant="h4" color="primary.main">
            {formatCurrency(simulationQuery.data.balance)}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
