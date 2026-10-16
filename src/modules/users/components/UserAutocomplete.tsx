import { useMemo, useState } from 'react';

import PersonRounded from '@mui/icons-material/PersonRounded';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useUsers } from 'modules/users/hooks/useUsers';
import type { User } from 'modules/users/types/user.types';
import { useDebounce } from 'shared/hooks/useDebounce';

type UserAutocompleteProps = {
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  /** Usuario que `value` ya tiene al abrir (p. ej. el actual en una edición), para mostrarlo sin buscarlo. */
  initialUser?: User | null;
  /** Usuario que no debe ofrecerse como opción (p. ej. el propietario actual). */
  excludeUserId?: string;
  label?: string;
  /** Id del usuario seleccionado ('' = ninguno). */
  value: string;
  onChange: (userId: string) => void;
  onBlur?: () => void;
};

const getUserLabel = (user: User) => `${user.name} ${user.surname} (CI: ${user.ci})`;

/**
 * Autocomplete de usuarios con estados controlados (value + inputValue) y
 * búsqueda en el servidor: escribir nombre, apellido o CI consulta la API
 * con `q`, así no hace falta cargar todos los usuarios de golpe.
 */
export default function UserAutocomplete({
  disabled,
  error,
  helperText,
  initialUser,
  excludeUserId,
  label = 'Propietario',
  value,
  onChange,
  onBlur,
}: UserAutocompleteProps) {
  const [selected, setSelected] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const usersQuery = useUsers({
    limit: 20,
    q: debouncedSearch || undefined,
    sortBy: [{ whom: 'name', order: 'asc' }],
  });

  // Si el formulario se reinicia (value = ''), no se muestra el usuario anterior.
  const current = !value
    ? null
    : selected?.id === value
      ? selected
      : initialUser?.id === value
        ? initialUser
        : null;

  // El elegido siempre debe estar en las opciones, aunque la búsqueda ya no lo devuelva.
  const options = useMemo(() => {
    const users: User[] = (usersQuery.data?.items ?? []).filter(
      (user) => user.id !== excludeUserId,
    );
    return current && !users.some((user) => user.id === current.id) ? [current, ...users] : users;
  }, [usersQuery.data, current, excludeUserId]);

  const isSearching = usersQuery.isFetching || searchTerm !== debouncedSearch;

  return (
    <Autocomplete
      autoHighlight
      clearOnEscape
      disabled={disabled}
      filterOptions={(opts) => opts} // el filtrado lo hace el servidor
      getOptionLabel={getUserLabel}
      inputValue={inputValue}
      isOptionEqualToValue={(option, selectedOption) => option.id === selectedOption.id}
      loading={isSearching}
      loadingText="Buscando usuarios..."
      noOptionsText={
        usersQuery.isError
          ? 'No se pudieron cargar los usuarios'
          : searchTerm
            ? 'Ningún usuario coincide con la búsqueda'
            : 'Escriba para buscar un usuario'
      }
      onBlur={onBlur}
      onChange={(_, user) => {
        setSelected(user);
        onChange(user?.id ?? '');
      }}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        // Solo lo que el usuario escribe dispara búsqueda; al elegir o limpiar se
        // vuelve a la lista general en vez de buscar el texto de la etiqueta.
        setSearchTerm(reason === 'input' ? newInputValue : '');
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          label={label}
          placeholder="Buscar por nombre o CI"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <PersonRounded fontSize="small" />
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
      renderOption={(props, user) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" {...optionProps}>
            <Avatar
              alt={`${user.name} ${user.surname}`}
              src={user.profileImg}
              sx={{ width: 36, height: 36, mr: 1.5 }}
            >
              {user.name[0]}
            </Avatar>
            <Stack spacing={0}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.name} {user.surname}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CI: {user.ci}
              </Typography>
            </Stack>
          </Box>
        );
      }}
      value={current}
    />
  );
}
