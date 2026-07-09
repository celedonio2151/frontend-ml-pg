import type { Reading, ReadingWithMeter } from "modules/readings/types/reading.types";
import type { PaginatedData } from "shared/types/api-reponse";
import { defineOptions } from "shared/utils/define-options";

export const PaymentMethod = defineOptions([
    {label: 'Efectivo', value: 'CASH'},
    {label: 'Transferencia', value: 'TRANSFER'},
    {label: 'QR', value: 'QR'},
    {label: 'Otro', value: 'OTHER'},
]);

export type PaymentMethodType = (typeof PaymentMethod.values)[number];

export const InvoiceStatus = defineOptions([
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Pagada', value: 'PAID' },
  { label: 'Cancelada', value: 'CANCELLED' },
]);

export type InvoiceStatusType = (typeof InvoiceStatus.values)[number];

export type Invoice = {
    id:                string;
    meterId:           string;
    amountDue:         string;
    originalAmountDue: string;
    status:            InvoiceStatusType;
    dueDate:           null;
    issueDate:         null;
    paymentDate:       Date | null;
    paymentMethod:     null | PaymentMethodType;
    isPaid:            boolean;
    notes:             null;
    readingId:         string;
}

export type InvoiceWithReading = Invoice & {
    reading: Reading;
}

export type InvoiceWithReadingAndMeter = Invoice & {
    reading: ReadingWithMeter;
}

export interface Month {
    date:  Date;
    value: number;
}

export type InvoicesList = PaginatedData<InvoiceWithReadingAndMeter>;

