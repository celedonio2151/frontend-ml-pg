import {
  READING_DETAIL_INCLUDE,
  READING_LIST_INCLUDE,
  type CreateReadingDto,
  type Reading,
  type ReadingsList,
  type ReadingsListParams,
  type ReadingWithMeterInvoice,
  type SimulatedBalance,
  type UpdateReadingDto,
} from 'modules/readings/types/reading.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams, includeQuery } from 'shared/utils/buildListParams';

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
  if (params.isRollover !== undefined) base.isRollover = String(params.isRollover);
  if (params.meterNumber !== undefined) base.meterNumber = String(params.meterNumber);

  return buildListParams(base, params.sortBy, READING_LIST_INCLUDE);
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
    httpClient.get<ReadingWithMeterInvoice>(
      `${READINGS_ENDPOINT}/${id}${includeQuery(READING_DETAIL_INCLUDE)}`,
    ),

  create: (payload: CreateReadingDto) => httpClient.post<Reading>(READINGS_ENDPOINT, payload),

  update: (id: string, payload: UpdateReadingDto) =>
    httpClient.patch<Reading>(`${READINGS_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<Reading>(`${READINGS_ENDPOINT}/${id}`),

  simulateBalance: (cubicMeters: number | null) =>
    httpClient.get<SimulatedBalance>(`${READINGS_ENDPOINT}/balance?cubicMeters=${cubicMeters}`),
} as const;
