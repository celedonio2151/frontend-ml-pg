import type { Invoice } from 'modules/invoices/types/invoice.types';

export type QrPaymentStatusType =
  | 'GENERATING'
  | 'PENDING'
  | 'PAID'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'ERROR';

export const QR_TERMINAL_STATUSES: QrPaymentStatusType[] = [
  'PAID',
  'EXPIRED',
  'CANCELLED',
  'ERROR',
];

export type InvoiceQrPayment = {
  id: string;
  qrId: string;
  qrImage: string;
  amount: number;
  singleUse: boolean;
  currency: string;
  gloss: string | null;
  status: QrPaymentStatusType;
  expirationDate: string;
  additionalData: string | null;
  transactionId: string | null;
  destinationAccountId: number;
  payerName: string | null;
  paidAt: string | null;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * GET /invoices/{id}/qr/status — consulta al banco y, si ya está pagado,
 * liquida la factura y registra el ingreso en tesorería (idempotente).
 */
export type ConfirmQrPaymentResult = {
  qrStatus: QrPaymentStatusType;
  /** true si esta llamada marcó la factura como pagada. */
  settled: boolean;
  /** true si la factura ya estaba pagada por otra vía (requiere conciliación). */
  duplicate: boolean;
  invoice: Invoice;
};
