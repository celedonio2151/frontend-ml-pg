import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

// MUI ICONS
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';

import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import FormDialog from 'components/FormDialog';
import { useMeters } from 'modules/meters/hooks/useMeters';
import type { MetersListParams } from 'modules/meters/types/meter.types';
import {
  useCreateReadingMutation,
  useUpdateReadingMutation,
} from 'modules/readings/hooks/useReadings';
import {
  readingFormSchema,
  type ReadingFormValues,
} from 'modules/readings/schemas/reading.schemas';
import type {
  CreateReadingDto,
  Reading,
  ReadingWithMeter,
  UpdateReadingDto,
} from 'modules/readings/types/reading.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { defaultReadingFormValues } from '../utils/reading-form.mapper';

type ReadingFormDialogProps = {
  onClose: () => void;
  open: boolean;
  reading?: ReadingWithMeter;
};

const formatNumber = (value?: number) => (Number.isFinite(value) ? String(value) : '');

const getCurrentReadingValue = (reading: Reading) => reading.lastMonth?.value ?? 0;

const toFormValues = (reading?: Reading | null): ReadingFormValues =>
  reading
    ? {
        balance: formatNumber(reading.balance),
        currentValue: formatNumber(getCurrentReadingValue(reading)),
        date: reading.date,
        description: reading.description ?? '',
        isRollover: reading.isRollover,
        meterId: reading.meterId,
        meterImage: reading.meterImage ?? '',
      }
    : defaultReadingFormValues();

const cleanOptional = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

const toOptionalNumber = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? Number(trimmed) : undefined;
};

const toApiDate = (value: string) => new Date(value).toISOString();

function toCreatePayload(values: ReadingFormValues): CreateReadingDto {
  return {
    currentValue: Number(values.currentValue),
    date: toApiDate(values.date ?? ''),
    description: cleanOptional(values.description),
    isRollover: values.isRollover,
    meterId: values.meterId ?? '',
    meterImage: cleanOptional(values.meterImage),
  };
}

function toUpdatePayload(values: ReadingFormValues, reading: Reading): UpdateReadingDto | null {
  const nextBalance = toOptionalNumber(values.balance);
  const description = cleanOptional(values.description);
  const balanceChanged = nextBalance !== undefined && nextBalance !== reading.balance;

  if (balanceChanged && !description) {
    return null;
  }

  return {
    currentValue: Number(values.currentValue),
    description,
    ...(balanceChanged ? { balance: nextBalance } : {}),
  };
}

export default function ReadingFormDialog({ onClose, open, reading }: ReadingFormDialogProps) {
  const isEditMode = Boolean(reading);
  const createReadingMutation = useCreateReadingMutation();
  const updateReadingMutation = useUpdateReadingMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const metersParams = useMemo<MetersListParams>(
    () => ({
      limit: 100,
      page: 1,
      sortBy: [{ order: 'asc', whom: 'meterNumber' }],
    }),
    [],
  );
  const metersQuery = useMeters(metersParams);
  const meters = metersQuery.data?.items ?? [];

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ReadingFormValues>({
    defaultValues: defaultReadingFormValues(),
    mode: 'onBlur',
    resolver: zodResolver(readingFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(reading));
    }
  }, [open, reading, reset]);

  const isSaving = createReadingMutation.isPending || updateReadingMutation.isPending;

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    if (!reading) {
      let hasClientError = false;

      if (!values.meterId?.trim()) {
        setError('meterId', { message: 'El medidor es requerido', type: 'validate' });
        hasClientError = true;
      }

      if (!values.date?.trim()) {
        setError('date', { message: 'La fecha es requerida', type: 'validate' });
        hasClientError = true;
      }

      if (hasClientError) return;
    }

    try {
      if (reading) {
        const payload = toUpdatePayload(values, reading);

        if (!payload) {
          setError('description', {
            message: 'La descripcion es obligatoria cuando se modifica el balance',
            type: 'validate',
          });
          return;
        }

        await updateReadingMutation.mutateAsync({
          id: reading.id,
          payload,
        });
      } else {
        await createReadingMutation.mutateAsync(toCreatePayload(values));
      }

      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo guardar la lectura'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="reading-form"
      isSubmitting={isSaving}
      maxWidth="md"
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditMode ? 'Actualizar lectura' : 'Nueva lectura'}
    >
      <Stack direction={{ xs: 'column' }} spacing={2}>
        {isEditMode ? (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              disabled
              fullWidth
              label="Propietario"
              size="medium"
              value={`${reading?.ownerName ?? ''} ${reading?.ownerSurname ?? ''}`.trim()}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              disabled
              fullWidth
              label="Medidor"
              size="medium"
              value={
                reading?.meter?.meterNumber
                  ? `#${reading.meter.meterNumber}`
                  : (reading?.meterId ?? '')
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpeedRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              disabled={metersQuery.isLoading}
              error={Boolean(errors.meterId)}
              fullWidth
              helperText={
                errors.meterId?.message ??
                (metersQuery.isError ? 'No se pudieron cargar medidores' : undefined)
              }
              label="Medidor"
              size="medium"
              select
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpeedRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('meterId')}
            >
              {meters.length > 0 ? (
                meters.map((meter) => (
                  <MenuItem key={meter.id} value={meter.id}>
                    #{meter.meterNumber} - {meter.user.name} {meter.user.surname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Sin medidores disponibles
                </MenuItem>
              )}
            </TextField>

            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DateTimePicker
                  label="Fecha de lectura"
                  onChange={(value) => field.onChange(value?.isValid() ? value.toISOString() : '')}
                  value={field.value ? dayjs(field.value) : null}
                  slotProps={{
                    textField: {
                      error: Boolean(errors.date),
                      fullWidth: true,
                      helperText: errors.date?.message,
                      slotProps: {
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthRounded fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Stack>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            error={Boolean(errors.currentValue)}
            fullWidth
            helperText={errors.currentValue?.message}
            label="Lectura actual"
            type="number"
            size="medium"
            slotProps={{
              htmlInput: { min: 0, step: '0.01' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <WaterDropRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('currentValue')}
          />

          {isEditMode ? (
            <TextField
              error={Boolean(errors.balance)}
              fullWidth
              helperText={errors.balance?.message}
              label="Balance"
              type="number"
              size="medium"
              slotProps={{
                htmlInput: { min: 0, step: '0.01' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceWalletRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('balance')}
            />
          ) : (
            <TextField
              error={Boolean(errors.meterImage)}
              fullWidth
              helperText={errors.meterImage?.message}
              label="Imagen del medidor"
              placeholder="URL o base64"
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('meterImage')}
            />
          )}
        </Stack>

        {!isEditMode ? (
          <Controller
            control={control}
            name="isRollover"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onBlur={field.onBlur}
                    onChange={(_, checked) => field.onChange(checked)}
                  />
                }
                label="Rollover del contador"
              />
            )}
          />
        ) : null}

        <TextField
          error={Boolean(errors.description)}
          fullWidth
          helperText={
            errors.description?.message ??
            (isEditMode ? 'Obligatoria si modificas el balance.' : undefined)
          }
          label={isEditMode ? 'Descripcion / justificacion' : 'Descripcion'}
          multiline
          minRows={3}
          {...register('description')}
        />
      </Stack>
    </FormDialog>
  );
}
