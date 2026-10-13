import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { invoicesQueryKeys } from 'modules/invoices/hooks/useInvoices';
import { invoiceQrService } from 'modules/invoices/services/invoice-qr.service';
import { QR_TERMINAL_STATUSES } from 'modules/invoices/types/invoice-qr.types';
import { treasuryQueryKeys } from 'modules/treasury/hooks/useTreasury';
import { ApiError } from 'shared/lib/api-error';

export const invoiceQrQueryKeys = {
  all: ['invoice-qr'] as const,
  detail: (invoiceId: string) => [...invoiceQrQueryKeys.all, 'invoice', invoiceId] as const,
  status: (invoiceId: string) => [...invoiceQrQueryKeys.all, 'status', invoiceId] as const,
};

const MAX_RETRIES = 3;

/**
 * El QR depende de un servicio bancario externo (BNB): solo vale la pena
 * reintentar fallas de red/servidor, no errores de negocio (400/404) que
 * no se van a resolver solos.
 */
function shouldRetry(failureCount: number, error: unknown) {
  if (failureCount >= MAX_RETRIES) return false;
  if (error instanceof ApiError) return error.isNetwork || error.isServerError;
  return true;
}

function retryDelay(attempt: number) {
  return Math.min(1000 * 2 ** attempt, 8000);
}

/** Genera/recupera el QR de pago de una factura. */
export function useInvoiceQr(invoiceId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: invoiceQrQueryKeys.detail(invoiceId ?? ''),
    queryFn: () => invoiceQrService.generateQr(invoiceId as string),
    enabled: Boolean(invoiceId) && enabled,
    retry: shouldRetry,
    retryDelay,
    staleTime: 0,
    gcTime: 0,
  });
}

/**
 * Sondea (y confirma) el pago QR de una factura contra el banco mientras
 * siga pendiente, y deja de hacerlo al llegar a un estado terminal
 * (PAID/EXPIRED/CANCELLED/ERROR). Esta misma llamada es la que liquida la
 * factura y registra el ingreso en tesorería del lado del backend, así que
 * al detectar `settled` invalidamos factura, lista, morosos y tesorería.
 */
export function useQrPaymentStatus(invoiceId: string | undefined) {
  const queryClient = useQueryClient();
  const settledRef = useRef(false);

  const query = useQuery({
    queryKey: invoiceQrQueryKeys.status(invoiceId ?? ''),
    queryFn: () => invoiceQrService.confirmQrPayment(invoiceId as string),
    enabled: Boolean(invoiceId),
    retry: shouldRetry,
    retryDelay,
    refetchInterval: (currentQuery) => {
      const status = currentQuery.state.data?.qrStatus;
      if (!status || QR_TERMINAL_STATUSES.includes(status)) return false;
      return 4000;
    },
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (query.data?.settled && invoiceId && !settledRef.current) {
      settledRef.current = true;
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.detail(invoiceId) });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.morosos() });
      void queryClient.invalidateQueries({ queryKey: treasuryQueryKeys.all });
    }

    if (!query.data?.settled) {
      settledRef.current = false;
    }
  }, [query.data?.settled, invoiceId, queryClient]);

  return query;
}
