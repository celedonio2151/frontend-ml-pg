import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type { MetersList, MetersListParams } from 'modules/meters/types/meter.types';

const METERS_ENDPOINT = '/meters';

function buildMetersListParams(params: MetersListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);

  return buildListParams(base, params.sortBy);
}

export const metersService = {
  findAll: (params?: MetersListParams) => {
    const searchParams = buildMetersListParams(params);
    const query = searchParams.toString();

    return httpClient.get<MetersList>(query ? `${METERS_ENDPOINT}?${query}` : METERS_ENDPOINT);
  },
} as const;
