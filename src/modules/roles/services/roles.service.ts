import { httpClient } from 'shared/lib/http-client';
import type { Role, RolesList, UpdateRoleDto } from 'modules/roles/types/role.types';

const ROLES_ENDPOINT = '/roles';

export const rolesService = {
  findAll: () => httpClient.get<RolesList>(ROLES_ENDPOINT),

  findOne: (id: string) => httpClient.get<Role>(`${ROLES_ENDPOINT}/${id}`),

  update: (id: string, payload: UpdateRoleDto) =>
    httpClient.patch<Role>(`${ROLES_ENDPOINT}/${id}`, payload),
} as const;
