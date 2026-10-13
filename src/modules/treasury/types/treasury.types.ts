import { defineOptions } from 'shared/utils/define-options';

import type { User } from 'modules/users/types/user.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export const TreasuryMovement = defineOptions([
  { value: 'INCOME', label: 'Ingreso' },
  { value: 'EXPENSE', label: 'Egreso' },
]);
export type TreasuryMovementType = (typeof TreasuryMovement.values)[number];

export const TreasuryReference = defineOptions([
  { value: 'INVOICE', label: 'Factura' },
  { value: 'EXPENSE', label: 'Gasto' },
  { value: 'ADJUSTMENT', label: 'Ajuste manual' },
  { value: 'OTHER', label: 'Otro' },
]);
export type TreasuryReferenceType = (typeof TreasuryReference.values)[number];

export type TreasuryMovement = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: TreasuryMovementType;
  amount: number;
  description: string;
  referenceType: TreasuryReferenceType;
  referenceId: string | null;
  balanceAfter: number;
  movementDate: string;
  /** null en pagos confirmados por el banco (QR). */
  registeredById: string | null;
  /** Solo con `include=registeredBy`; null en pagos confirmados por el banco. */
  registeredBy?: User | null;
};

export const TREASURY_INCLUDE = ['registeredBy'] as const;

export type TreasuryList = PaginatedData<TreasuryMovement>;

export type TreasuryListParams = {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: SortParam[];
  withDeleted?: boolean;
  type?: TreasuryMovementType;
  referenceType?: TreasuryReferenceType;
  registeredById?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TreasuryBalance = {
  balance: number;
};

export type TreasurySummaryItem = {
  total: number;
  count: number;
};

export type TreasurySummaryMovements = {
  INCOME: TreasurySummaryItem;
  EXPENSE: TreasurySummaryItem;
};

export type TreasurySummary = {
  movements: TreasurySummaryMovements;
  netBalance: number;
  currentBalance: number;
};

export type CreateAdjustmentDto = {
  type: TreasuryMovementType;
  amount: number;
  description: string;
};
