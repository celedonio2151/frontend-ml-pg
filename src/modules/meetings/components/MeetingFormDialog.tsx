import { zodResolver } from '@hookform/resolvers/zod';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import TitleRounded from '@mui/icons-material/TitleRounded';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormDialog from 'components/FormDialog';
import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
} from 'modules/meetings/hooks/useMeetings';
import { meetingSchema, type MeetingFormValues } from 'modules/meetings/schemas/meeting.schemas';
import type {
  CreateMeetingDto,
  Meeting,
  UpdateMeetingDto,
} from 'modules/meetings/types/meeting.types';
import { applyApiFieldErrors, getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

type MeetingFormDialogProps = {
  meeting?: Meeting | null;
  onClose: () => void;
  open: boolean;
};

const emptyValues: MeetingFormValues = {
  attendeesText: '',
  content: '',
  documentUrl: '',
  meetingDate: '',
  title: '',
};

const toDateTimeLocal = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const toFormValues = (meeting?: Meeting | null): MeetingFormValues =>
  meeting
    ? {
        attendeesText: meeting.attendees?.join(', ') ?? '',
        content: meeting.content,
        documentUrl: meeting.documentUrl ?? '',
        meetingDate: toDateTimeLocal(meeting.meetingDate),
        title: meeting.title,
      }
    : emptyValues;

const cleanOptional = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

const parseAttendees = (value?: string) => {
  const attendees = value
    ?.split(/[,\n]/)
    .map((attendee) => attendee.trim())
    .filter(Boolean);

  return attendees?.length ? attendees : undefined;
};

const toApiDate = (value: string) => new Date(value).toISOString();

function toCreatePayload(values: MeetingFormValues): CreateMeetingDto {
  return {
    attendees: parseAttendees(values.attendeesText),
    content: values.content.trim(),
    documentUrl: cleanOptional(values.documentUrl),
    meetingDate: toApiDate(values.meetingDate),
    title: values.title.trim(),
  };
}

function toUpdatePayload(values: MeetingFormValues): UpdateMeetingDto {
  return toCreatePayload(values);
}

export default function MeetingFormDialog({ meeting, onClose, open }: MeetingFormDialogProps) {
  const isEditMode = Boolean(meeting);
  const createMeetingMutation = useCreateMeetingMutation();
  const updateMeetingMutation = useUpdateMeetingMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<MeetingFormValues>({
    defaultValues: emptyValues,
    mode: 'onBlur',
    resolver: zodResolver(meetingSchema),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(meeting));
    }
  }, [meeting, open, reset]);

  const isSaving = createMeetingMutation.isPending || updateMeetingMutation.isPending;

  const handleClose = () => {
    if (!isSaving) {
      setSubmitError(null);
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (meeting) {
        await updateMeetingMutation.mutateAsync({
          id: meeting.id,
          payload: toUpdatePayload(values),
        });
      } else {
        await createMeetingMutation.mutateAsync(toCreatePayload(values));
      }

      handleClose();
    } catch (error) {
      if (!applyApiFieldErrors(error, setError)) {
        setSubmitError(getApiErrorMessage(error, 'No se pudo guardar la reunion'));
      }
    }
  });

  return (
    <FormDialog
      error={submitError}
      formId="meeting-form"
      isSubmitting={isSaving}
      onClose={handleClose}
      onSubmit={onSubmit}
      open={open}
      title={isEditMode ? 'Actualizar reunion' : 'Nueva reunion'}
    >
      <Stack direction={{ xs: 'column' }} spacing={2}>
        <TextField
          size="medium"
          error={Boolean(errors.title)}
          fullWidth
          helperText={errors.title?.message}
          label="Titulo"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <TitleRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('title')}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Controller
            control={control}
            name="meetingDate"
            render={({ field }) => (
              <DateTimePicker
                label="Fecha y hora"
                onChange={(value) => field.onChange(value?.isValid() ? value.toISOString() : '')}
                value={field.value ? dayjs(field.value) : null}
                slotProps={{
                  textField: {
                    error: Boolean(errors.meetingDate),
                    fullWidth: true,
                    helperText: errors.meetingDate?.message,
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

          <TextField
            size="medium"
            error={Boolean(errors.documentUrl)}
            fullWidth
            helperText={errors.documentUrl?.message}
            label="Documento"
            placeholder="https://..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            {...register('documentUrl')}
          />
        </Stack>

        <TextField
          error={Boolean(errors.attendeesText)}
          fullWidth
          helperText={errors.attendeesText?.message}
          label="Asistentes"
          multiline
          minRows={2}
          placeholder="Un nombre por linea o separados por coma"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <GroupsRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...register('attendeesText')}
        />

        <TextField
          error={Boolean(errors.content)}
          fullWidth
          helperText={errors.content?.message}
          label="Contenido"
          multiline
          minRows={4}
          {...register('content')}
        />
      </Stack>
    </FormDialog>
  );
}
