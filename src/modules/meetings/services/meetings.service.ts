import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type {
  CreateMeetingDto,
  Meeting,
  MeetingsList,
  MeetingsListParams,
  UpdateMeetingDto,
} from 'modules/meetings/types/meeting.types';

const MEETINGS_ENDPOINT = '/meetings';

function buildMeetingsListParams(params: MeetingsListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);

  return buildListParams(base, params.sortBy);
}

export const meetingsService = {
  findAll: (params?: MeetingsListParams) => {
    const searchParams = buildMeetingsListParams(params);
    const query = searchParams.toString();

    return httpClient.get<MeetingsList>(query ? `${MEETINGS_ENDPOINT}?${query}` : MEETINGS_ENDPOINT);
  },

  findOne: (id: string) => httpClient.get<Meeting>(`${MEETINGS_ENDPOINT}/${id}`),

  create: (payload: CreateMeetingDto) => httpClient.post<Meeting>(MEETINGS_ENDPOINT, payload),

  update: (id: string, payload: UpdateMeetingDto) =>
    httpClient.patch<Meeting>(`${MEETINGS_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<Meeting>(`${MEETINGS_ENDPOINT}/${id}`),
} as const;
