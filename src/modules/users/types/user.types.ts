import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type UserRoleName = 'ADMIN' | 'READER' | 'TECHNICAL' | 'TECHNICIAN' | 'USER' | string;

export type UserRole = {
  createdAt: string;
  description: string;
  id: string;
  name: UserRoleName;
  status: boolean;
  updatedAt: string;
};

export type UserMeter = {
  createdAt: string;
  deletedAt: null | string;
  id: string;
  isDeleted: boolean;
  maximumCapacity: number;
  meterNumber: number;
  status: boolean;
  updatedAt: string;
  userId: string;
};

export type User = {
  authProvider: string;
  birthDate?: string;
  ci: string;
  createdAt: string;
  email?: string;
  id: string;
  meters: UserMeter[];
  name: string;
  phoneNumber?: string;
  profileImg?: string;
  roles: UserRole[];
  status: boolean;
  surname: string;
  updatedAt: string;
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

export type UsersList = PaginatedData<User>;

