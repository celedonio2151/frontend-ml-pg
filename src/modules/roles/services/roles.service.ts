import type {
  ListRolesUsersCountResponseDto,
  Role,
  RolesList,
  UpdateRoleDto,
} from 'modules/roles/types/role.types';
import { httpClient } from 'shared/lib/http-client';

const ROLES_ENDPOINT = '/roles';

export const rolesService = {
  findAll: () => httpClient.get<RolesList>(ROLES_ENDPOINT),

  findTotalUsersByRole: () =>
    httpClient.get<ListRolesUsersCountResponseDto>(`${ROLES_ENDPOINT}/users/count`),

  findOne: (id: string) => httpClient.get<Role>(`${ROLES_ENDPOINT}/${id}`),

  update: (id: string, payload: UpdateRoleDto) =>
    httpClient.patch<Role>(`${ROLES_ENDPOINT}/${id}`, payload),
} as const;
