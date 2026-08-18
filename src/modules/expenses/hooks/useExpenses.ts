import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesService } from 'modules/expenses/services/expenses.service';
import type {
  CreateExpenseDto,
  ExpensesListParams,
  RejectExpenseDto,
  UpdateExpenseDto,
} from 'modules/expenses/types/expense.types';

export const expensesQueryKeys = {
  all: ['expenses'] as const,
  lists: () => [...expensesQueryKeys.all, 'list'] as const,
  list: (params: ExpensesListParams) => [...expensesQueryKeys.lists(), params] as const,
  detail: (id: string) => [...expensesQueryKeys.all, 'detail', id] as const,
  summary: (dateFrom?: string, dateTo?: string) =>
    [...expensesQueryKeys.all, 'summary', { dateFrom, dateTo }] as const,
};

export function useExpenses(params: ExpensesListParams = {}) {
  return useQuery({
    queryKey: expensesQueryKeys.list(params),
    queryFn: () => expensesService.findAll(params),
  });
}

export function useExpense(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: expensesQueryKeys.detail(id),
    queryFn: () => expensesService.findOne(id),
  });
}

export function useExpensesSummary(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: expensesQueryKeys.summary(dateFrom, dateTo),
    queryFn: () => expensesService.getSummary(dateFrom, dateTo),
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseDto) => expensesService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.all });
    },
  });
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseDto }) =>
      expensesService.update(id, payload),
    onSuccess: (expense) => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.detail(expense.id) });
    },
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.all });
    },
  });
}

export function useApproveExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesService.approve(id),
    onSuccess: (expense) => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.detail(expense.id) });
    },
  });
}

export function useRejectExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RejectExpenseDto }) =>
      expensesService.reject(id, payload),
    onSuccess: (expense) => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: expensesQueryKeys.detail(expense.id) });
    },
  });
}
