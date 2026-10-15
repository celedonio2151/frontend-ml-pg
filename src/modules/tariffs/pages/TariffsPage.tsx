import { useEffect, useRef, useState } from 'react';

import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import PriceChangeRounded from '@mui/icons-material/PriceChangeRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import BalanceSimulatorCard from 'components/BalanceSimulator/BalanceSimulatorCard';
import { useReplaceTariffsMutation, useTariffs } from 'modules/tariffs/hooks/useTariffs';
import { TariffTierKind, type TariffTierInput } from 'modules/tariffs/types/tariff.types';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

const emptyTier: TariffTierInput = { type: 'PER_M3', price: 0, upToM3: null };

function validateTiers(tiers: TariffTierInput[]): string | null {
  if (tiers.length === 0) return 'Agrega al menos un tramo.';

  if (tiers.some((tier) => !(tier.price > 0))) {
    return 'El precio de cada tramo debe ser mayor a 0.';
  }

  if (tiers.slice(1).some((tier) => tier.type === 'FIXED')) {
    return 'Solo el primer tramo puede ser de monto fijo.';
  }

  const nonLast = tiers.slice(0, -1);
  if (nonLast.some((tier) => !tier.upToM3 || tier.upToM3 <= 0)) {
    return 'Todos los tramos deben tener un tope en m³, excepto el último.';
  }

  for (let i = 1; i < nonLast.length; i += 1) {
    if ((nonLast[i].upToM3 ?? 0) <= (nonLast[i - 1].upToM3 ?? 0)) {
      return 'El tope de cada tramo debe ser mayor al del tramo anterior.';
    }
  }

  return null;
}

export default function TariffsPage() {
  const tariffsQuery = useTariffs();
  const replaceMutation = useReplaceTariffsMutation();

  const [tiers, setTiers] = useState<TariffTierInput[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (tariffsQuery.data && !initializedRef.current) {
      initializedRef.current = true;
      setTiers(
        tariffsQuery.data.items.map((tier) => ({
          type: tier.type,
          price: tier.price,
          upToM3: tier.upToM3,
        })),
      );
    }
  }, [tariffsQuery.data]);

  const updateTier = (index: number, patch: Partial<TariffTierInput>) => {
    setSaved(false);
    setTiers((prev) => prev.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  };

  const addTier = () => {
    setSaved(false);
    setTiers((prev) => [...prev, { ...emptyTier }]);
  };

  const removeTier = (index: number) => {
    setSaved(false);
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaved(false);
    const payload = tiers.map((tier, index) => ({
      ...tier,
      upToM3: index === tiers.length - 1 ? undefined : tier.upToM3,
    }));

    const validationError = validateTiers(payload);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    try {
      await replaceMutation.mutateAsync({ tiers: payload });
      setSaved(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No se pudieron guardar las tarifas'));
    }
  };

  if (tariffsQuery.isLoading) {
    return (
      <Stack sx={{ alignItems: 'center', p: 6 }} spacing={2}>
        <CircularProgress />
        <Typography color="text.secondary">Cargando tarifas...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <PriceChangeRounded color="primary" fontSize="large" />
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Tarifas de Consumo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tramos usados para calcular el monto a pagar por consumo (m³).
          </Typography>
        </Stack>
      </Stack>

      {tariffsQuery.isError && (
        <Alert severity="error">
          {getApiErrorMessage(tariffsQuery.error, 'No se pudieron cargar las tarifas')}
        </Alert>
      )}

      {formError && <Alert severity="error">{formError}</Alert>}
      {saved && <Alert severity="success">Tarifas actualizadas correctamente.</Alert>}

      <AquaPanel liquid sx={{ p: 3 }}>
        <Stack spacing={2}>
          {tiers.map((tier, index) => {
            const isLast = index === tiers.length - 1;

            return (
              <Stack
                key={index}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ alignItems: { sm: 'center' } }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 700, minWidth: 64 }}
                >
                  Tramo {index + 1}
                </Typography>

                <TextField
                  select
                  label="Tipo"
                  size="small"
                  value={tier.type}
                  onChange={(e) =>
                    updateTier(index, { type: e.target.value as TariffTierInput['type'] })
                  }
                  sx={{ minWidth: 160 }}
                >
                  {TariffTierKind.options
                    .filter((option) => index === 0 || option.value !== 'FIXED')
                    .map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  label={tier.type === 'FIXED' ? 'Monto (Bs.)' : 'Precio por m³ (Bs.)'}
                  size="small"
                  type="number"
                  value={tier.price}
                  onChange={(e) => updateTier(index, { price: Number(e.target.value) })}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">Bs.</InputAdornment>,
                    },
                  }}
                  sx={{ minWidth: 160 }}
                />

                <TextField
                  label="Hasta (m³)"
                  size="small"
                  type="number"
                  value={isLast ? '' : (tier.upToM3 ?? '')}
                  onChange={(e) =>
                    updateTier(index, {
                      upToM3: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  disabled={isLast}
                  helperText={isLast ? 'Sin tope (último tramo)' : undefined}
                  sx={{ minWidth: 160 }}
                />

                <IconButton
                  color="error"
                  onClick={() => removeTier(index)}
                  disabled={tiers.length <= 1}
                  size="small"
                >
                  <DeleteRounded fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}

          <Button
            onClick={addTier}
            startIcon={<AddRounded />}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            Agregar tramo
          </Button>
        </Stack>
      </AquaPanel>

      <Button
        onClick={() => void handleSave()}
        disabled={replaceMutation.isPending}
        startIcon={<SaveRounded />}
        variant="contained"
        size="large"
        sx={{ alignSelf: 'flex-start', px: 4 }}
      >
        {replaceMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>

      <AquaPanel liquid sx={{ p: 3 }}>
        <BalanceSimulatorCard />
      </AquaPanel>
    </Stack>
  );
}
