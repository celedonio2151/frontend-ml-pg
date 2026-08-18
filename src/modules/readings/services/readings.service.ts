import type {
  CreateReadingDto,
  Reading,
  ReadingsList,
  ReadingsListParams,
  ReadingWithInvoice,
  ReadingWithMeterUserInvoice,
  UpdateReadingDto,
} from 'modules/readings/types/reading.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';

const READINGS_ENDPOINT = '/readings';

function buildReadingsListParams(params: ReadingsListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.ownerCi) base.ownerCi = params.ownerCi;
  if (params.ownerName) base.ownerName = params.ownerName;
  if (params.ownerSurname) base.ownerSurname = params.ownerSurname;
  if (params.meterId) base.meterId = params.meterId;
  if (params.dateFrom) base.dateFrom = params.dateFrom;
  if (params.dateTo) base.dateTo = params.dateTo;

  return buildListParams(base, params.sortBy);
}

export const readingsService = {
  findAll: (params?: ReadingsListParams) => {
    const searchParams = buildReadingsListParams(params);
    const query = searchParams.toString();

    return httpClient.get<ReadingsList>(
      query ? `${READINGS_ENDPOINT}?${query}` : READINGS_ENDPOINT,
    );
  },

  findOne: (id: string) =>
    httpClient.get<ReadingWithMeterUserInvoice>(`${READINGS_ENDPOINT}/${id}`),

  create: (payload: CreateReadingDto) =>
    httpClient.post<ReadingWithInvoice>(READINGS_ENDPOINT, payload),

  update: (id: string, payload: UpdateReadingDto) =>
    httpClient.patch<Reading>(`${READINGS_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<Reading>(`${READINGS_ENDPOINT}/${id}`),
} as const;
