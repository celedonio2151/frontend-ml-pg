import { api } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';
import type { CreateUserDto, UpdateUserDto, User, UsersList, UsersListParams } from 'modules/users/types/user.types';

const USERS_ENDPOINT = '/users';

function buildUsersListParams(params: UsersListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) {
    base.q = params.q;
  }

  if (params.page) {
    base.page = String(params.page);
  }

  if (params.limit) {
    base.limit = String(params.limit);
  }

  return buildListParams(base, params.sortBy);
}

export const usersService = {
  findAll: (params?: UsersListParams) => {
    const searchParams = buildUsersListParams(params);
    const query = searchParams.toString();

    return api.get<UsersList>(query ? `${USERS_ENDPOINT}?${query}` : USERS_ENDPOINT);
  },
  findOne: (id: string) => api.get<User>(`${USERS_ENDPOINT}/${id}`),
  create: (payload: CreateUserDto) => api.post<User>(USERS_ENDPOINT, payload),
  update: (id: string, payload: UpdateUserDto) => api.patch<User>(`${USERS_ENDPOINT}/${id}`, payload),
  remove: (id: string) => api.delete<User>(`${USERS_ENDPOINT}/${id}`),
} as const;

