import type {
  CreateExpenseDto,
  Expense,
  ExpensesList,
  ExpensesListParams,
  ExpenseSummary,
  RejectExpenseDto,
  UpdateExpenseDto,
} from 'modules/expenses/types/expense.types';
import { httpClient } from 'shared/lib/http-client';
import { buildListParams } from 'shared/utils/buildListParams';

const EXPENSES_ENDPOINT = '/expenses';

function buildExpensesListParams(params: ExpensesListParams = {}) {
  const base: Record<string, string> = {};

  if (params.q) base.q = params.q;
  if (params.page) base.page = String(params.page);
  if (params.limit) base.limit = String(params.limit);
  if (params.withDeleted !== undefined) base.withDeleted = String(params.withDeleted);
  if (params.category) base.category = params.category;
  if (params.status) base.status = params.status;
  if (params.dateFrom) base.dateFrom = params.dateFrom;
  if (params.dateTo) base.dateTo = params.dateTo;

  return buildListParams(base, params.sortBy);
}

export const expensesService = {
  findAll: (params?: ExpensesListParams) => {
    const searchParams = buildExpensesListParams(params);
    const query = searchParams.toString();

    return httpClient.get<ExpensesList>(
      query ? `${EXPENSES_ENDPOINT}?${query}` : EXPENSES_ENDPOINT,
    );
  },

  getSummary: (dateFrom?: string, dateTo?: string) => {
    const query = new URLSearchParams();
    if (dateFrom) query.append('dateFrom', dateFrom);
    if (dateTo) query.append('dateTo', dateTo);
    const qStr = query.toString();

    return httpClient.get<ExpenseSummary>(
      qStr ? `${EXPENSES_ENDPOINT}/summary?${qStr}` : `${EXPENSES_ENDPOINT}/summary`,
    );
  },

  findOne: (id: string) => httpClient.get<Expense>(`${EXPENSES_ENDPOINT}/${id}`),

  create: (payload: CreateExpenseDto) => httpClient.post<Expense>(EXPENSES_ENDPOINT, payload),

  update: (id: string, payload: UpdateExpenseDto) =>
    httpClient.patch<Expense>(`${EXPENSES_ENDPOINT}/${id}`, payload),

  remove: (id: string) => httpClient.delete<Expense>(`${EXPENSES_ENDPOINT}/${id}`),

  approve: (id: string) => httpClient.patch<Expense>(`${EXPENSES_ENDPOINT}/${id}/approve`),

  reject: (id: string, payload?: RejectExpenseDto) =>
    httpClient.patch<Expense>(`${EXPENSES_ENDPOINT}/${id}/reject`, payload),
} as const;
