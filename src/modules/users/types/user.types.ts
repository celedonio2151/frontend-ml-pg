import type { Meter } from 'modules/meters/types/meter.types';
import type { Role } from 'modules/roles/types/role.types';
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

export type UserWithRoles = User & {
  roles: Role[];
};

export type UserWithMeter = User & {
  meters: Meter[];
};

export type UserWithRolesAndMeters = UserWithRoles & {
  meters: Meter[];
};

export type CreateUserDto = {
  birthDate?: string;
  ci: string;
  email: string;
  name: string;
  phoneNumber?: string;
  surname: string;
};

export type UpdateUserDto = {
  birthDate?: string;
  email: string;
  phoneNumber?: string;
  rolIds?: string[];
};

export type UsersListParams = {
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
};

export type UsersList = PaginatedData<UserWithRolesAndMeters>;
