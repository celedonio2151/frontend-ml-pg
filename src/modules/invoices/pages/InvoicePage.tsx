import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

// MUI ICONS
import PaymentRounded from '@mui/icons-material/PaymentRounded';
import PictureAsPdfRounded from '@mui/icons-material/PictureAsPdfRounded';
import ReceiptRounded from '@mui/icons-material/ReceiptRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

import type { DataTableServerSide as ServerSideConfig } from 'components/MainTableServerSide/DataTableServerSide';
import DataTableServerSide from 'components/MainTableServerSide/DataTableServerSide';
import PayInvoiceDialog from 'modules/invoices/components/PayInvoiceDialog';
import { useInvoices } from 'modules/invoices/hooks/useInvoices';
import { invoicesService } from 'modules/invoices/services/invoices.service';
import type {
  Invoice,
  InvoiceStatus,
  InvoiceWithReadingMeter,
} from 'modules/invoices/types/invoice.types';
import paths from 'router/paths';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useTableServerSide } from 'shared/hooks/useTableServerSide';
import StatusPill from 'shared/ui/aqua/StatusPill';
import { getApiErrorMessage } from 'shared/utils/applyApiFieldErrors';
import { formatCurrency } from 'shared/utils/formatters';

export default function InvoicePage() {
  const navigate = useNavigate();
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);

  const { page, pageSize, search, sortBy, serverSideProps } = useTableServerSide(10, [
    { order: 'desc', whom: 'createdAt' },
  ]);

  const debouncedSearch = useDebounce(search, 500);

  const invoicesParams = useMemo(
    () => ({
      limit: pageSize,
      page,
      sortBy,
      q: debouncedSearch,
    }),
    [pageSize, page, sortBy, debouncedSearch],
  );

  const invoicesQuery = useInvoices(invoicesParams);
  const invoices = invoicesQuery.data?.items ?? [];

  const serverSideConfig: ServerSideConfig = useMemo(
    () => ({
      ...serverSideProps,
      totalRows: invoicesQuery.data?.meta?.total ?? 0,
    }),
    [serverSideProps, invoicesQuery.data?.meta?.total],
  );

  const handleOpenPdf = useCallback(async (invoiceId: string) => {
    try {
      const url = await invoicesService.getInvoicePdfBlobUrl(invoiceId);
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
      alert('Error al generar el PDF de la factura');
    }
  }, []);

  const getStatusProps = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return { label: 'Pagada', tone: 'success' as const, pulse: false };
      case 'CANCELLED':
        return { label: 'Anulada', tone: 'error' as const, pulse: false };
      case 'PENDING':
      default:
        return { label: 'Pendiente', tone: 'warning' as const, pulse: true };
    }
  };

  const columns = useMemo<ColumnDef<InvoiceWithReadingMeter, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID Factura',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Typography color="primary.light" variant="body2" sx={{ fontWeight: 850 }}>
            {row.original.id.split('-')[0].toUpperCase()}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const status = getValue<InvoiceStatus>();
          const props = getStatusProps(status);
          return <StatusPill {...props} />;
        },
      },
      {
        accessorFn: (row) => `${row.reading.ownerName} ${row.reading.ownerSurname}`,
        id: 'owner',
        header: 'Propietario',
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Stack spacing={0.25}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 850 }}>
              {row.original.reading.ownerName} {row.original.reading.ownerSurname}
            </Typography>
            <Typography
              noWrap
              color="textSecondary"
              variant="caption"
              sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 600 }}
            >
              Medidor #{row.original.reading.meter.meterNumber}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'amountDue',
        header: 'Monto',
        enableColumnFilter: false,
        meta: { align: 'right' },
        cell: ({ getValue }) => (
          <Typography
            variant="body2"
            color="primary.light"
            sx={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontWeight: 800 }}
          >
            {formatCurrency(getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'issueDate',
        header: 'Emisión',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          return val ? dayjs(val).format('DD MMM YYYY') : '-';
        },
      },
      {
        accessorKey: 'dueDate',
        header: 'Vencimiento',
        enableColumnFilter: false,
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          return val ? (
            <Typography
              variant="body2"
              color={dayjs().isAfter(val) ? 'error.main' : 'text.primary'}
            >
              {dayjs(val).format('DD MMM YYYY')}
            </Typography>
          ) : (
            '-'
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
            <Tooltip title="Ver detalles">
              <IconButton
                color="secondary"
                onClick={() => navigate(paths.admin.invoiceDetail.replace(':id', row.original.id))}
                size="small"
              >
                <VisibilityRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver PDF">
              <IconButton
                color="primary"
                onClick={() => void handleOpenPdf(row.original.id)}
                size="small"
              >
                <PictureAsPdfRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            {row.original.status === 'PENDING' && (
              <Tooltip title="Pagar factura">
                <IconButton
                  color="success"
                  onClick={() => setPayInvoice(row.original)}
                  size="small"
                >
                  <PaymentRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
      },
    ],
    [handleOpenPdf, navigate],
  );

  const subtitle = invoicesQuery.isLoading
    ? 'Cargando facturas...'
    : `${(invoicesQuery.data?.meta.total ?? invoices.length).toLocaleString()} facturas registradas`;

  return (
    <Stack spacing={2.5}>
      {invoicesQuery.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(invoicesQuery.error, 'No se pudieron cargar las facturas')}
        </Alert>
      ) : null}

      <DataTableServerSide<InvoiceWithReadingMeter>
        serverSide={serverSideConfig}
        ariaLabel="tabla de facturas"
        columns={columns}
        data={invoices}
        emptyMessage={
          invoicesQuery.isLoading ? 'Cargando facturas...' : 'No hay facturas para mostrar.'
        }
        initialPageSize={10}
        rowsLabel="facturas"
        rowsPerPageOptions={[10, 25, 50, 100]}
        searchPlaceholder="Buscar por ID, propietario o medidor..."
        subtitle={subtitle}
        title="Facturas"
        toolbarRight={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              disabled={invoicesQuery.isFetching}
              onClick={() => void invoicesQuery.refetch()}
              startIcon={<RefreshRounded />}
              variant="outlined"
            >
              Refrescar
            </Button>
            <Button
              onClick={() => navigate(paths.admin.invoicesMorosos)}
              startIcon={<ReceiptRounded />}
              variant="contained"
              color="secondary"
            >
              Ver Morosos
            </Button>
          </Stack>
        }
      />

      <PayInvoiceDialog
        onClose={() => setPayInvoice(null)}
        open={Boolean(payInvoice)}
        invoice={payInvoice}
      />
    </Stack>
  );
}
