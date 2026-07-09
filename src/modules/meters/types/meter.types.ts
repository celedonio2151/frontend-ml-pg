import type { User } from 'modules/users/types/user.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type Meter = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleted: boolean;
  deletedAt: Date | string | null;
  meterNumber: number;
  status: boolean;
  maximumCapacity: number;
  userId: string;
};

export type MeterWithUser = Meter & {
  user: User;
};

export type MetersListParams = {
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  withDeleted?: boolean;
};

export type MetersList = PaginatedData<MeterWithUser>;
