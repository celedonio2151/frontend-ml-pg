import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

// MUI ICONS
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';

import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormDialog from 'components/FormDialog';
import ImageUploadField from 'components/ImageUploadField';
import MeterAutocomplete from 'modules/meters/components/MeterAutocomplete';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import ReadingBalancePreview from 'modules/readings/components/ReadingBalancePreview';
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

  const [selectedMeter, setSelectedMeter] = useState<MeterWithUser | null>(null);

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

  const watchedCurrentValue = useWatch({ control, name: 'currentValue' });
  const watchedIsRollover = useWatch({ control, name: 'isRollover' });

  useEffect(() => {
    if (open) {
      reset(toFormValues(reading));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMeter(null);
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
            message: 'La descripción es obligatoria cuando se modifica el saldo',
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
            <Controller
              control={control}
              name="meterId"
              render={({ field }) => (
                <MeterAutocomplete
                  error={Boolean(errors.meterId)}
                  helperText={errors.meterId?.message}
                  onBlur={field.onBlur}
                  onChange={(meterId, meter) => {
                    field.onChange(meterId);
                    setSelectedMeter(meter);
                  }}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
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
              label="Saldo"
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
          ) : null}
        </Stack>

        {!isEditMode ? (
          <ReadingBalancePreview
            currentValue={watchedCurrentValue ?? ''}
            isRollover={Boolean(watchedIsRollover)}
            previousValue={selectedMeter?.currentValue}
          />
        ) : null}

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

        {!isEditMode ? (
          <ImageUploadField
            label="Foto del medidor (opcional)"
            notice="La foto todavía no se guarda: falta integrar Cloudinary en el backend."
            onChange={() => undefined}
          />
        ) : null}

        <TextField
          error={Boolean(errors.description)}
          fullWidth
          helperText={
            errors.description?.message ??
            (isEditMode ? 'Obligatoria si modificas el saldo.' : undefined)
          }
          label={isEditMode ? 'Descripción / justificación' : 'Descripción'}
          multiline
          minRows={3}
          {...register('description')}
        />
      </Stack>
    </FormDialog>
  );
}
