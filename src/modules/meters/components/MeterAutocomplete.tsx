import { useMemo, useState } from 'react';

import SpeedRounded from '@mui/icons-material/SpeedRounded';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useMeters } from 'modules/meters/hooks/useMeters';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import { useDebounce } from 'shared/hooks/useDebounce';

type MeterAutocompleteProps = {
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  /** Id del medidor seleccionado ('' = ninguno). */
  value: string;
  /** Devuelve también el medidor completo (lectura anterior, capacidad...). */
  onChange: (meterId: string, meter: MeterWithUser | null) => void;
  onBlur?: () => void;
};

const ownerName = (meter: MeterWithUser) =>
  meter.user ? `${meter.user.name} ${meter.user.surname}` : 'Sin propietario';

const getMeterLabel = (meter: MeterWithUser) => `#${meter.meterNumber} — ${ownerName(meter)}`;

/**
 * Autocomplete de medidores con búsqueda en el servidor (`q`). El input muestra
 * "#número — propietario"; el CI aparece en la lista de opciones y también
 * se puede escribir para buscar.
 */
export default function MeterAutocomplete({
  disabled,
  error,
  helperText,
  label = 'Medidor',
  value,
  onChange,
  onBlur,
}: MeterAutocompleteProps) {
  const [selected, setSelected] = useState<MeterWithUser | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const metersQuery = useMeters({
    limit: 20,
    q: debouncedSearch || undefined,
    sortBy: [{ whom: 'meterNumber', order: 'asc' }],
  });

  const current = value && selected?.id === value ? selected : null;

  const options = useMemo(() => {
    const meters: MeterWithUser[] = metersQuery.data?.items ?? [];
    return current && !meters.some((meter) => meter.id === current.id)
      ? [current, ...meters]
      : meters;
  }, [metersQuery.data, current]);

  const isSearching = metersQuery.isFetching || searchTerm !== debouncedSearch;

  return (
    <Autocomplete
      autoHighlight
      clearOnEscape
      fullWidth
      disabled={disabled}
      filterOptions={(opts) => opts} // el filtrado lo hace el servidor
      getOptionLabel={getMeterLabel}
      inputValue={inputValue}
      isOptionEqualToValue={(option, selectedOption) => option.id === selectedOption.id}
      loading={isSearching}
      loadingText="Buscando medidores..."
      noOptionsText={
        metersQuery.isError
          ? 'No se pudieron cargar los medidores'
          : searchTerm
            ? 'Ningún medidor coincide con la búsqueda'
            : 'Escriba para buscar un medidor'
      }
      onBlur={onBlur}
      onChange={(_, meter) => {
        setSelected(meter);
        onChange(meter?.id ?? '', meter);
      }}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        setSearchTerm(reason === 'input' ? newInputValue : '');
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          size="medium"
          label={label}
          placeholder="Buscar por n° de medidor, nombre o CI"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SpeedRounded fontSize="small" />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isSearching ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, meter) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" {...optionProps}>
            <Stack spacing={0}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                #{meter.meterNumber} — {ownerName(meter)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {meter.user ? `CI: ${meter.user.ci} · ` : ''}
                {meter.address || 'Sin dirección'}
              </Typography>
            </Stack>
          </Box>
        );
      }}
      value={current}
    />
  );
}
