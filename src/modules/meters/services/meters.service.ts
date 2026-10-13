import { httpClient } from 'shared/lib/http-client';
import { buildListParams, includeQuery } from 'shared/utils/buildListParams';
import {
  METER_INCLUDE,
  type ChangeOwnerDto,
  type CreateMeterDto,
  type Meter,
  type MetersList,
  type MetersListParams,
  type MeterWithUser,
  type UpdateMeterDto,
} from 'modules/meters/types/meter.types';

const METERS_ENDPOINT = '/meters';

function buildMetersListParams(params: MetersListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.ci) base.ci = params.ci;
  if (params.email) base.email = params.email;
  if (params.name) base.name = params.name;
  if (params.meterNumber !== undefined) base.meterNumber = String(params.meterNumber);
  if (params.status !== undefined) base.status = String(params.status);
  if (params.userId) base.userId = params.userId;

  return buildListParams(base, params.sortBy, METER_INCLUDE);
}

export const metersService = {
  findAll: (params?: MetersListParams) => {
    const searchParams = buildMetersListParams(params);
    const query = searchParams.toString();

    return httpClient.get<MetersList>(
      query ? `${METERS_ENDPOINT}?${query}` : METERS_ENDPOINT,
    );
  },

  findOne: (id: string) =>
    httpClient.get<MeterWithUser>(`${METERS_ENDPOINT}/${id}${includeQuery(METER_INCLUDE)}`),

  create: (payload: CreateMeterDto) => httpClient.post<MeterWithUser>(METERS_ENDPOINT, payload),

  update: (id: string, payload: UpdateMeterDto) =>
    httpClient.patch<Meter>(`${METERS_ENDPOINT}/${id}`, payload),

  changeOwner: (id: string, payload: ChangeOwnerDto) =>
    httpClient.patch<Meter>(`${METERS_ENDPOINT}/${id}/owner`, payload),

  remove: (id: string) => httpClient.delete<Meter>(`${METERS_ENDPOINT}/${id}`),
} as const;
