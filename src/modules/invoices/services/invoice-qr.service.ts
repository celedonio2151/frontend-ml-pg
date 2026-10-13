import type {
  ConfirmQrPaymentResult,
  InvoiceQrPayment,
} from 'modules/invoices/types/invoice-qr.types';
import { httpClient } from 'shared/lib/http-client';

const INVOICES_ENDPOINT = '/invoices';

export const invoiceQrService = {
  /** Genera (o recupera) el QR de pago de una factura. */
  generateQr: (invoiceId: string) =>
    httpClient.get<InvoiceQrPayment>(`${INVOICES_ENDPOINT}/${invoiceId}/qr`),

  /**
   * Consulta al banco el estado del QR de una factura y, si ya está pagado,
   * liquida la factura y registra el ingreso en tesorería (idempotente).
   */
  confirmQrPayment: (invoiceId: string) =>
    httpClient.get<ConfirmQrPaymentResult>(`${INVOICES_ENDPOINT}/${invoiceId}/qr/status`),
} as const;
