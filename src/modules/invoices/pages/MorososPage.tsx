import { useNavigate } from 'react-router';

// MUI ICONS
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ReceiptRounded from '@mui/icons-material/ReceiptRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import Accordion from '@mui/material/Accordion';

import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useMorosos, useRunMorososCheckMutation } from 'modules/invoices/hooks/useInvoices';
import paths from 'router/paths';
import AquaPanel from 'shared/ui/aqua/AquaPanel';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';

export default function MorososPage() {
  const navigate = useNavigate();
  const morososQuery = useMorosos();
  const checkMutation = useRunMorososCheckMutation();

  // We assume morosos is an array of objects returned by the API
  const morososData = morososQuery.data?.result;

  const handleRunCheck = async () => {
    try {
      await checkMutation.mutateAsync();
      void morososQuery.refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
          Gestión de Morosos
        </Typography>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate(paths.admin.invoices)}
          variant="outlined"
        >
          Volver a Facturas
        </Button>
      </Stack>

      {checkMutation.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(checkMutation.error, 'Error al ejecutar la verificación de morosos')}
        </Alert>
      ) : null}

      <AquaPanel liquid sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Verificación manual
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ejecuta el proceso para identificar y actualizar los estados de las facturas vencidas
              (morosos) en el sistema.
            </Typography>
          </Box>
          <Button
            color="secondary"
            loading={checkMutation.isPending}
            onClick={() => void handleRunCheck()}
            startIcon={<CheckCircleRounded />}
            variant="contained"
          >
            Ejecutar verificación
          </Button>
        </Stack>
      </AquaPanel>

      {morososQuery.isLoading ? (
        <Typography>Cargando lista de morosos...</Typography>
      ) : morososQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(morososQuery.error, 'No se pudo cargar la lista de morosos')}
        </Alert>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Lista actual de morosos ({morososData?.length ?? 0})
          </Typography>

          {morososData?.length === 0 ? (
            <Alert severity="success" icon={<CheckCircleRounded />}>
              No hay morosos registrados en el sistema actualmente.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {morososData?.map((moroso) => (
                <Card key={moroso.ci} variant="outlined" sx={{ borderColor: 'error.main' }}>
                  <CardContent>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={2}
                      sx={{
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        mb: moroso.meters && moroso.meters.length > 0 ? 3 : 0,
                      }}
                    >
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <WarningRounded color="error" />
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {moroso.name} {moroso.surname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            CI: {moroso.ci}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
                      >
                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            Deuda Total
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="error.main"
                            sx={{ fontWeight: 700 }}
                          >
                            Bs. {moroso.totalDebt.toFixed(2)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${moroso.totalInvoices} facturas vencidas`}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                    </Stack>

                    {moroso.meters && moroso.meters.length > 0 && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1.5, fontWeight: 700, color: 'text.secondary' }}
                        >
                          Detalle por Medidor ({moroso.meters.length})
                        </Typography>

                        {moroso.meters.map((meter) => (
                          <Accordion
                            key={meter.meterId}
                            variant="outlined"
                            disableGutters
                            sx={{
                              mb: 1,
                              '&:before': { display: 'none' },
                              borderColor: 'divider',
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                              <Stack
                                direction="row"
                                sx={{
                                  width: '100%',
                                  pr: 2,
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, wordBreak: 'break-all' }}
                                >
                                  Medidor #{meter.meterNumber}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'error.main', fontWeight: 600 }}
                                >
                                  Bs. {meter.totalDebt.toFixed(2)}
                                </Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                              <Divider sx={{ mb: 2 }} />
                              <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block' }}
                                  >
                                    Facturas
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {meter.invoicesCount}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block' }}
                                  >
                                    Deuda más antigua
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {meter.oldestDebt
                                      ? new Date(meter.oldestDebt).toLocaleDateString()
                                      : 'N/A'}
                                  </Typography>
                                </Box>
                              </Stack>

                              {meter.invoices && meter.invoices.length > 0 && (
                                <Stack spacing={1}>
                                  {meter.invoices.map((inv) => (
                                    <Stack
                                      key={inv.id}
                                      sx={{
                                        justifyContent: 'space-between',
                                        direction: 'row',
                                        alignItems: 'center',
                                        bgcolor: 'background.default',
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1.5}
                                        sx={{ alignItems: 'center' }}
                                      >
                                        <ReceiptRounded color="action" fontSize="small" />
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              fontWeight: 600,
                                              display: 'block',
                                            }}
                                          >
                                            {inv.reading?.date
                                              ? new Date(inv.reading.date)
                                                  .toLocaleDateString('es-ES', {
                                                    month: 'long',
                                                    year: 'numeric',
                                                  })
                                                  .replace(/^\w/, (c) => c.toUpperCase())
                                              : 'Factura'}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            Vencimiento:{' '}
                                            {inv.dueDate
                                              ? new Date(inv.dueDate).toLocaleDateString()
                                              : 'N/A'}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: 'error.main',
                                        }}
                                      >
                                        Bs. {inv.amountDue}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}
