import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import MeetingFormDialog from 'modules/meetings/components/MeetingFormDialog';
import { useMeeting } from 'modules/meetings/hooks/useMeetings';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import SectionHeader from 'shared/ui/aqua/SectionHeader';
import StatusPill from 'shared/ui/aqua/StatusPill';
import paths from 'router/paths';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formateDate } from 'shared/utils/formatters';

type DetailItemProps = {
  icon: ElementType;
  label: string;
  value: ReactNode;
};

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: 'grid',
          flexShrink: 0,
          placeItems: 'center',
          color: 'primary.light',
          bgcolor: 'rgba(6, 182, 212, 0.12)',
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography component="div" variant="body2" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const meetingQuery = useMeeting(id);
  const meeting = meetingQuery.data;
  const attendees = meeting?.attendees ?? [];

  return (
    <Stack spacing={2.5}>
      <SectionHeader
        eyebrow="Reuniones"
        title="Detalle de reunion"
        subtitle="Informacion completa del acta y sus asistentes."
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              onClick={() => navigate(paths.admin.meetings)}
              startIcon={<ArrowBackRounded />}
              variant="outlined"
            >
              Volver
            </Button>
            <Button
              disabled={meetingQuery.isFetching}
              onClick={() => void meetingQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button
              disabled={!meeting}
              onClick={() => setFormOpen(true)}
              startIcon={<EditRounded />}
              variant="contained"
            >
              Editar
            </Button>
          </Stack>
        }
      />

      {meetingQuery.isFetching ? <LinearProgress /> : null}

      {meetingQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(meetingQuery.error, 'No se pudo cargar la reunion')}
        </Alert>
      ) : null}

      {!meetingQuery.isLoading && !meeting && !meetingQuery.isError ? (
        <Alert severity="warning">No se encontro la reunion solicitada.</Alert>
      ) : null}

      {meeting ? (
        <>
          <AquaPanel strong>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ justifyContent: 'space-between' }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 950 }}>
                    {meeting.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Creada {formateDate(meeting.createdAt, 'DD MMM YYYY HH:mm')}
                  </Typography>
                </Box>
                <StatusPill
                  label={meeting.isDeleted ? 'Eliminada' : 'Activa'}
                  pulse={!meeting.isDeleted}
                  tone={meeting.isDeleted ? 'error' : 'success'}
                />
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                }}
              >
                <DetailItem
                  icon={CalendarMonthRounded}
                  label="Fecha de reunion"
                  value={formateDate(meeting.meetingDate, 'dddd DD MMM YYYY HH:mm')}
                />
                <DetailItem
                  icon={RefreshRounded}
                  label="Ultima actualizacion"
                  value={formateDate(meeting.updatedAt, 'DD MMM YYYY HH:mm')}
                />
                <DetailItem
                  icon={GroupsRounded}
                  label="Total asistentes"
                  value={`${attendees.length} asistentes`}
                />
                <DetailItem
                  icon={LinkRounded}
                  label="Documento"
                  value={
                    meeting.documentUrl ? (
                      <Link href={meeting.documentUrl} rel="noreferrer" target="_blank" underline="hover">
                        Abrir documento
                      </Link>
                    ) : (
                      'Sin documento'
                    )
                  }
                />
              </Box>
            </Stack>
          </AquaPanel>

          <AquaPanel liquid>
            <Stack spacing={2}>
              <DetailItem icon={DescriptionRounded} label="Contenido" value={meeting.content} />
              <Divider />
              <Box>
                <Typography color="text.secondary" variant="caption">
                  Asistentes
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', mt: 1 }}>
                  {attendees.length > 0 ? (
                    attendees.map((attendee) => (
                      <Chip key={attendee} label={attendee} size="small" variant="outlined" />
                    ))
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      Sin asistentes registrados.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </AquaPanel>
        </>
      ) : null}

      <MeetingFormDialog meeting={meeting ?? null} onClose={() => setFormOpen(false)} open={formOpen} />
    </Stack>
  );
}
