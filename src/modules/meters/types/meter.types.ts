import type { User } from 'modules/users/types/user.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type Meter = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  meterNumber: number;
  address: string;
  meterImage: string | null;
  currentValue: number;
  status: boolean;
  maximumCapacity: number;
  userId: string;
};

/** Relaciones que el backend solo devuelve si se piden con `include`. */
export const METER_INCLUDE = ['user'] as const;

/** Medidor con `include=user`. */
export type MeterWithUser = Meter & {
  user: User;
};

export type MetersListParams = {
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  withDeleted?: boolean;
  ci?: string;
  email?: string;
  name?: string;
  meterNumber?: number;
  status?: boolean;
  userId?: string;
};

export type MetersList = PaginatedData<MeterWithUser>;

export type CreateMeterDto = {
  meterNumber: number;
  maximumCapacity?: number;
  userId: string;
};

export type UpdateMeterDto = {
  meterNumber?: number;
  maximumCapacity?: number;
  status?: boolean;
};

export type ChangeOwnerDto = {
  newUserId: string;
};
