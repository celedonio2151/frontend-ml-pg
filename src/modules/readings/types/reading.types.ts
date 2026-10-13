import type { Invoice } from 'modules/invoices/types/invoice.types';
import type { Meter } from 'modules/meters/types/meter.types';
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
  description: string | null;
  isRollover: boolean;
  beforeMonth: MonthValue;
  lastMonth: MonthValue;
  meterImage: string | null;
  meterId: string;
  registeredById?: string | null;
  updatedById?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

/**
 * Relaciones que el backend solo devuelve si se piden con `include`. El
 * propietario al momento de la lectura siempre viene en ownerCi/Name/Surname,
 * por eso el medidor anidado ya no trae `user`.
 */
export const READING_LIST_INCLUDE = ['meter'] as const;
export const READING_DETAIL_INCLUDE = ['meter', 'invoice'] as const;

/** Lectura con `include=meter`. */
export type ReadingWithMeter = Reading & {
  meter: Meter;
};

/** Lectura con `include=meter,invoice`. La factura puede no existir aún. */
export type ReadingWithMeterInvoice = Reading & {
  meter: Meter;
  invoice?: Invoice | null;
};

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
  isRollover?: boolean;
  meterNumber?: number;
};

export type ReadingsList = PaginatedData<ReadingWithMeter>;

export type SimulatedBalance = {
  cubicMeters: number;
  balance: number;
};
