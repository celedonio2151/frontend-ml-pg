import {
  TREASURY_INCLUDE,
  type CreateAdjustmentDto,
  type TreasuryBalance,
  type TreasuryList,
  type TreasuryListParams,
  type TreasuryMovement,
  type TreasurySummary,
} from 'modules/treasury/types/treasury.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';

const TREASURY_ENDPOINT = '/treasury';

function buildTreasuryListParams(params: TreasuryListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.type) base.type = params.type;
  if (params.referenceType) base.referenceType = params.referenceType;
  if (params.registeredById) base.registeredById = params.registeredById;
  if (params.dateFrom) base.dateFrom = params.dateFrom;
  if (params.dateTo) base.dateTo = params.dateTo;

  return buildListParams(base, params.sortBy, TREASURY_INCLUDE);
}

export const treasuryService = {
  findAll: (params?: TreasuryListParams) => {
    const searchParams = buildTreasuryListParams(params);
    const query = searchParams.toString();

    return httpClient.get<TreasuryList>(
      query ? `${TREASURY_ENDPOINT}?${query}` : TREASURY_ENDPOINT,
    );
  },

  getBalance: () =>
    httpClient.get<TreasuryBalance>(`${TREASURY_ENDPOINT}/balance`),

  getSummary: (dateFrom?: string, dateTo?: string) => {
    const query = new URLSearchParams();
    if (dateFrom) query.append('dateFrom', dateFrom);
    if (dateTo) query.append('dateTo', dateTo);
    const qStr = query.toString();

    return httpClient.get<TreasurySummary>(
      qStr ? `${TREASURY_ENDPOINT}/summary?${qStr}` : `${TREASURY_ENDPOINT}/summary`,
    );
  },

  createAdjustment: (payload: CreateAdjustmentDto) =>
    httpClient.post<TreasuryMovement>(`${TREASURY_ENDPOINT}/adjustment`, payload),
} as const;
