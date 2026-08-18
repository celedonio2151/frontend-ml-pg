import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type {
  ChangeOwnerDto,
  CreateMeterDto,
  Meter,
  MetersList,
  MetersListParams,
  MeterWithUser,
  UpdateMeterDto,
} from 'modules/meters/types/meter.types';

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

    return httpClient.get<MetersList>(
      query ? `${METERS_ENDPOINT}?${query}` : METERS_ENDPOINT,
    );
  },

  findOne: (id: string) => httpClient.get<MeterWithUser>(`${METERS_ENDPOINT}/${id}`),

  create: (payload: CreateMeterDto) => httpClient.post<MeterWithUser>(METERS_ENDPOINT, payload),

  update: (id: string, payload: UpdateMeterDto) =>
    httpClient.patch<Meter>(`${METERS_ENDPOINT}/${id}`, payload),

  changeOwner: (id: string, payload: ChangeOwnerDto) =>
    httpClient.patch<Meter>(`${METERS_ENDPOINT}/${id}/owner`, payload),

  remove: (id: string) => httpClient.delete<Meter>(`${METERS_ENDPOINT}/${id}`),
} as const;
