import type {
  MyMetersList,
  MyMetersListParams,
  MyProfile,
  MyReadingsList,
  MyReadingsListParams,
  UpdateMyProfileDto,
} from 'modules/my-account/types/my-account.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams, includeQuery } from 'shared/utils/buildListParams';

function buildMyMetersParams(params: MyMetersListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.status !== undefined) base.status = String(params.status);

  return buildListParams(base, params.sortBy);
}

function buildMyReadingsParams(params: MyReadingsListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.meterId) base.meterId = params.meterId;
  if (params.dateFrom) base.dateFrom = params.dateFrom;
  if (params.dateTo) base.dateTo = params.dateTo;
  if (params.isRollover !== undefined) base.isRollover = String(params.isRollover);

  return buildListParams(base, params.sortBy, ['meter']);
}

export const myAccountService = {
  getProfile: () => httpClient.get<MyProfile>(`/users/me${includeQuery(['roles'])}`),

  updateProfile: (payload: UpdateMyProfileDto) => httpClient.patch<MyProfile>('/users/me', payload),

  findMyMeters: (params?: MyMetersListParams) => {
    const query = buildMyMetersParams(params).toString();
    return httpClient.get<MyMetersList>(query ? `/meters/me?${query}` : '/meters/me');
  },

  findMyReadings: (params?: MyReadingsListParams) => {
    const query = buildMyReadingsParams(params).toString();
    return httpClient.get<MyReadingsList>(query ? `/readings/me?${query}` : '/readings/me');
  },
} as const;
