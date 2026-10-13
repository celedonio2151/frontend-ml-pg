import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

/**
 * Tipos propios de "Mi Cuenta" (vista de autoservicio del admin logueado,
 * vía los endpoints /me). Se mantienen separados de los tipos de los
 * módulos de administración (meters/readings/users) a propósito, para no
 * mezclar el trabajo de gestión con los datos personales del usuario.
 */

export type MyProfile = {
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
  /** Solo con `include=roles`. */
  roles: { id: string; name: string }[];
};

/** PATCH /users/me — los roles no se pueden cambiar desde aquí. */
export type UpdateMyProfileDto = {
  email: string;
  phoneNumber?: string;
  birthDate?: string;
  profileImg?: string;
};

export type MyMeter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  meterNumber: number;
  address: string;
  meterImage: string | null;
  currentValue: number;
  status: boolean;
  maximumCapacity: number;
  userId: string;
};

export type MyMetersListParams = {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: SortParam[];
  withDeleted?: boolean;
  status?: boolean;
};

export type MyMetersList = PaginatedData<MyMeter>;

export type MonthValue = {
  date: string;
  value: number;
};

export type MyReading = {
  id: string;
  date: string;
  ownerCi: string;
  ownerName: string;
  ownerSurname: string;
  cubicMeters: number;
  balance: number;
  description: string | null;
  isRollover: boolean;
  beforeMonth: MonthValue;
  lastMonth: MonthValue;
  meterImage: string | null;
  meterId: string;
  createdAt: string;
  updatedAt: string;
  /** Solo con `include=meter`. */
  meter: MyMeter;
};

export type MyReadingsListParams = {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: SortParam[];
  withDeleted?: boolean;
  meterId?: string;
  dateFrom?: string;
  dateTo?: string;
  isRollover?: boolean;
};

export type MyReadingsList = PaginatedData<MyReading>;
