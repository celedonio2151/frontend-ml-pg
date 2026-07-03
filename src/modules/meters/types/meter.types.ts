import type { User } from 'modules/users/types/user.types';

export type Meter = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: null;
  meterNumber: number;
  status: boolean;
  maximumCapacity: number;
  userId: string;
};

export type MeterWithUser = Meter & {
  user: User;
};
