import type { User } from 'modules/users/types/user.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';
import { defineOptions } from 'shared/utils/define-options';

export const ExpenseCategory = defineOptions([
  { value: 'MAINTENANCE', label: 'Mantenimiento' },
  { value: 'SUPPLIES', label: 'Insumos' },
  { value: 'SALARIES', label: 'Salarios' },
  { value: 'INFRASTRUCTURE', label: 'Infraestructura' },
  { value: 'EMERGENCY', label: 'Emergencia' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'OTHER', label: 'Otro' },
] as const);

export type ExpenseCategoryType = (typeof ExpenseCategory.values)[number];

export const ExpenseStatus = defineOptions([
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
] as const);

export type ExpenseStatusType = (typeof ExpenseStatus.values)[number];

export type Expense = {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  category: ExpenseCategoryType;
  amount: number;
  description: string;
  receiptNumber?: string;
  receiptImage?: string;
  expenseDate: string;
  status: ExpenseStatusType;
  rejectionReason?: string;
  reviewedAt?: string;
  registeredById: string;
  reviewedById?: string;
  registeredBy?: User;
  reviewedBy?: User;
};

export type CreateExpenseDto = {
  amount: number;
  category: ExpenseCategoryType;
  description: string;
  expenseDate: string;
  receiptImage?: string;
  receiptNumber?: string;
};

export type UpdateExpenseDto = Partial<CreateExpenseDto>;

export type RejectExpenseDto = {
  rejectionReason?: string;
};

export type ExpensesListParams = {
  category?: ExpenseCategoryType;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  status?: ExpenseStatusType;
  withDeleted?: boolean;
};

export type ExpensesList = PaginatedData<Expense>;

export type ExpenseSummaryCategory = {
  category: string;
  count: number;
  total: number;
};

export type ExpenseSummary = {
  categories: ExpenseSummaryCategory[];
  totalAmount: number;
};
