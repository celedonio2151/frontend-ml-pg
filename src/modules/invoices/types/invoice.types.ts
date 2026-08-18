import type { Meter } from 'modules/meters/types/meter.types';
import type { Reading } from 'modules/readings/types/reading.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';
import { defineOptions } from 'shared/utils/define-options';

export const PaymentMethod = defineOptions([
  { label: 'Efectivo', value: 'CASH' },
  { label: 'Transferencia', value: 'TRANSFER' },
  { label: 'QR', value: 'QR' },
  { label: 'Otro', value: 'OTHER' },
]);

export type PaymentMethodType = (typeof PaymentMethod.values)[number];

export const InvoiceStatus = defineOptions([
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Pagada', value: 'PAID' },
  { label: 'Cancelada', value: 'CANCELLED' },
]);

export type InvoiceStatusType = (typeof InvoiceStatus.values)[number];

export type Invoice = {
  id: string;
  meterId: string;
  amountDue: number;
  originalAmountDue: number | null;
  status: InvoiceStatusType;
  dueDate: string | null;
  issueDate: string | null;
  paymentDate: string | null;
  paymentMethod: PaymentMethodType | null;
  isPaid: boolean;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  readingId: string;
};

export type InvoicesListParams = {
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  withDeleted?: boolean;
};
type ReadingWithMeter = Reading & {
  meter: Meter;
};
export type InvoiceWithReadingMeter = Invoice & {
  reading: ReadingWithMeter;
};

export type InvoicesList = PaginatedData<InvoiceWithReadingMeter>;

export type PayInvoiceDto = {
  paymentMethod: PaymentMethodType;
  notes?: string;
};
