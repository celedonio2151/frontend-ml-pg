import type { Invoice } from 'modules/invoices/types/invoice.types';
import type { MeterWithUser } from 'modules/meters/types/meter.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type MonthValue = {
  date: string;
  value: number;
};

export type ReadingInvoiceStatus = 'CANCELLED' | 'PAID' | 'PENDING' | string;

export type Reading = {
  id: string;
  date: string;
  ownerCi: string;
  ownerName: string;
  ownerSurname: string;
  cubicMeters: number;
  balance: number;
  description: string;
  isRollover: boolean;
  beforeMonth: MonthValue;
  lastMonth: MonthValue;
  meterImage: string;
  meterId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ReadingWithMeterAndUser = Reading & {
  meter: MeterWithUser;
};

export type ReadingWithInvoice = Reading & {
  invoice: Invoice;
};

export type ReadingDetail = Reading;

export type CreateReadingDto = {
  currentValue: number;
  date: string;
  description?: string;
  isRollover?: boolean;
  meterId: string;
  meterImage?: string;
};

export type UpdateReadingDto = {
  balance?: number;
  currentValue?: number;
  description?: string;
};

export type ReadingsListParams = {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  meterId?: string;
  ownerCi?: string;
  ownerName?: string;
  ownerSurname?: string;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  withDeleted?: boolean;
};

export type ReadingsList = PaginatedData<ReadingWithMeterAndUser>;
