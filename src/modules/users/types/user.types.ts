import type { Meter } from 'modules/meters/types/meter.types';
import type { Role, RoleType } from 'modules/roles/types/role.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type UserRoleName = 'ADMIN' | 'READER' | 'TECHNICAL' | 'TECHNICIAN' | 'USER' | string;

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  ci: string;
  name: string;
  surname: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  profileImg?: string;
  status: boolean;
};

/** Relaciones que el backend solo devuelve si se piden con `include`. */
export const USER_INCLUDE = ['roles'] as const;

/** Usuario con `include=roles`. */
export type UserWithRoles = User & {
  roles: Role[];
};

export type UserWithMeter = User & {
  meters: Meter[];
};

/**
 * La API actual ya no devuelve `meters` en usuarios (solo `roles` vía include);
 * se deja opcional porque el backend aún se está actualizando.
 */
export type UserWithRolesAndMeters = UserWithRoles & {
  meters?: Meter[];
};

export type CreateUserDto = {
  birthDate?: string;
  ci: string;
  email?: string;
  name: string;
  phoneNumber?: string;
  surname: string;
};

export type UpdateUserDto = Partial<Pick<CreateUserDto, 'birthDate' | 'email' | 'phoneNumber'>> & {
  profileImg?: string;
  roleIds?: string[];
};

export type UsersListParams = {
  q?: string;
  limit?: number;
  page?: number;
  withDeleted?: boolean;
  sortBy?: SortParam[];
  ci?: string;
  status?: boolean;
  roleName?: RoleType;
};

export type UsersList = PaginatedData<UserWithRolesAndMeters>;
