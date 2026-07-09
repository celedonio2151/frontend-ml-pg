import AddRounded from '@mui/icons-material/AddRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import DataTable from 'components/MainTable/DataTable';
import DeleteMeetingDialog from 'modules/meetings/components/DeleteMeetingDialog';
import MeetingFormDialog from 'modules/meetings/components/MeetingFormDialog';
import { useMeetings } from 'modules/meetings/hooks/useMeetings';
import type { Meeting, MeetingsListParams } from 'modules/meetings/types/meeting.types';
import paths from 'router/paths';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formateDate } from 'shared/utils/formatters';

export default function MeetingPage() {
  const navigate = useNavigate();
  const [formMeeting, setFormMeeting] = useState<Meeting | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteMeeting, setDeleteMeeting] = useState<Meeting | null>(null);

  const meetingsParams = useMemo<MeetingsListParams>(
    () => ({
      limit: 100,
      page: 1,
      sortBy: [{ order: 'desc', whom: 'meetingDate' }],
    }),
    [],
  );

  const meetingsQuery = useMeetings(meetingsParams);
  const meetings = meetingsQuery.data?.items ?? [];

  const handleCreate = useCallback(() => {
    setFormMeeting(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((meeting: Meeting) => {
    setFormMeeting(meeting);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setFormMeeting(null);
  }, []);

  const handleShowDetail = useCallback(
    (meeting: Meeting) => {
      navigate(`${paths.admin.meetings}/${meeting.id}`);
    },
    [navigate],
  );

  const columns = useMemo<ColumnDef<Meeting, unknown>[]>(
    () => [
      {
        accessorFn: (row) => `${row.title} ${row.content}`,
        id: 'meeting',
        header: 'Reunion',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
          <Stack spacing={0.25} sx={{ maxWidth: 420 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
              {row.original.title}
            </Typography>
            <Typography noWrap color="text.secondary" variant="caption">
              {row.original.content}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'meetingDate',
        header: 'Fecha',
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 800 }}>
            {formateDate(getValue<string>(), 'DD MMM YYYY HH:mm')}
          </Typography>
        ),
      },
      {
        accessorFn: (row) => row.attendees?.length ?? 0,
        id: 'attendees',
        header: 'Asistentes',
        meta: { filterVariant: 'number' },
        cell: ({ row }) => {
          const attendees = row.original.attendees ?? [];

          return (
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
              {attendees.length > 0 ? (
                attendees.slice(0, 3).map((attendee) => (
                  <Chip key={attendee} label={attendee} size="small" variant="outlined" />
                ))
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Sin asistentes
                </Typography>
              )}
              {attendees.length > 3 ? <Chip label={`+${attendees.length - 3}`} size="small" /> : null}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'documentUrl',
        header: 'Documento',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const url = getValue<string | undefined>();

          return url ? (
            <Link
              href={url}
              rel="noreferrer"
              target="_blank"
              underline="hover"
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 0.5, fontWeight: 800 }}
            >
              Abrir <OpenInNewRounded fontSize="inherit" />
            </Link>
          ) : (
            <Typography color="text.secondary" variant="body2">
              Sin documento
            </Typography>
          );
        },
      },
      {
        accessorKey: 'isDeleted',
        header: 'Estado',
        filterFn: 'equals',
        meta: {
          filterVariant: 'select',
          filterOptions: [
            { label: 'Activa', value: false },
            { label: 'Eliminada', value: true },
          ],
        },
        cell: ({ getValue }) => {
          const isDeleted = Boolean(getValue<boolean | undefined>());

          return (
            <StatusPill
              label={isDeleted ? 'Eliminada' : 'Activa'}
              pulse={!isDeleted}
              tone={isDeleted ? 'error' : 'success'}
            />
          );
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Ver detalle">
              <IconButton color="primary" onClick={() => handleShowDetail(row.original)} size="small">
                <VisibilityRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton color="primary" onClick={() => handleEdit(row.original)} size="small">
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => setDeleteMeeting(row.original)} size="small">
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleEdit, handleShowDetail],
  );

  const subtitle = meetingsQuery.isLoading
    ? 'Cargando reuniones...'
    : `${(meetingsQuery.data?.meta.total ?? meetings.length).toLocaleString()} reuniones en backend`;

  return (
    <Stack spacing={2.5}>
      {meetingsQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(meetingsQuery.error, 'No se pudieron cargar reuniones')}
        </Alert>
      ) : null}

      <DataTable<Meeting>
        ariaLabel="tabla de reuniones"
        columns={columns}
        data={meetings}
        emptyMessage={
          meetingsQuery.isLoading ? 'Cargando reuniones...' : 'No hay reuniones para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="reuniones"
        rowsPerPageOptions={[10, 25, 50, 100]}
        searchPlaceholder="Buscar por titulo o contenido..."
        subtitle={subtitle}
        title="Reuniones"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={meetingsQuery.isFetching}
              onClick={() => void meetingsQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button onClick={handleCreate} startIcon={<AddRounded />} variant="contained">
              Nueva reunion
            </Button>
          </Stack>
        }
      />

      <MeetingFormDialog meeting={formMeeting} onClose={handleCloseForm} open={formOpen} />
      <DeleteMeetingDialog
        meeting={deleteMeeting}
        onClose={() => setDeleteMeeting(null)}
        open={Boolean(deleteMeeting)}
      />
    </Stack>
  );
}
