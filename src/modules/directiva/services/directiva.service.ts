import type {
  BoardDirector,
  BoardDirectorsList,
  BoardDirectorsListParams,
  CreateBoardDirectorDto,
  UpdateBoardDirectorDto,
} from 'modules/directiva/types/directiva.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';

const BOARD_DIRECTORS_ENDPOINT = '/board-directors';

function buildBoardDirectorsListParams(params: BoardDirectorsListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.year) base.year = String(params.year);
  if (params.dateFrom) base.dateFrom = params.dateFrom;
  if (params.dateTo) base.dateTo = params.dateTo;
  if (params.userId) base.userId = params.userId;
  if (params.positionRole) base.positionRole = params.positionRole;
  if (params.status !== undefined) base.status = String(params.status);

  return buildListParams(base, params.sortBy);
}

export const directivaService = {
  findAll: (params?: BoardDirectorsListParams) => {
    const searchParams = buildBoardDirectorsListParams(params);
    const query = searchParams.toString();

    return httpClient.get<BoardDirectorsList>(
      query ? `${BOARD_DIRECTORS_ENDPOINT}?${query}` : BOARD_DIRECTORS_ENDPOINT,
    );
  },

  create: (payload: CreateBoardDirectorDto) =>
    httpClient.post<BoardDirector>(BOARD_DIRECTORS_ENDPOINT, payload),

  update: (id: string, payload: UpdateBoardDirectorDto) =>
    httpClient.patch<BoardDirector>(`${BOARD_DIRECTORS_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<void>(`${BOARD_DIRECTORS_ENDPOINT}/${id}`),
} as const;
