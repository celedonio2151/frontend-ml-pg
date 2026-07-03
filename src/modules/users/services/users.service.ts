import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type {
  CreateUserDto,
  UpdateUserDto,
  UsersList,
  UsersListParams,
  UserWithRolesAndMeters,
} from 'modules/users/types/user.types';

const USERS_ENDPOINT = '/users';

function buildUsersListParams(params: UsersListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;

  if (params.page) base.page = String(params.page);

  if (params.limit) base.limit = String(params.limit);

  return buildListParams(base, params.sortBy);
}

export const usersService = {
  findAll: (params?: UsersListParams) => {
    const searchParams = buildUsersListParams(params);
    const query = searchParams.toString();

    return httpClient.get<UsersList>(query ? `${USERS_ENDPOINT}?${query}` : USERS_ENDPOINT);
  },
  findOne: (id: string) => httpClient.get<UserWithRolesAndMeters>(`${USERS_ENDPOINT}/${id}`),

  create: (payload: CreateUserDto) => httpClient.post<UserWithRolesAndMeters>(USERS_ENDPOINT, payload),

  update: (id: string, payload: UpdateUserDto) =>
    httpClient.patch<UserWithRolesAndMeters>(`${USERS_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<UserWithRolesAndMeters>(`${USERS_ENDPOINT}/${id}`),
} as const;
