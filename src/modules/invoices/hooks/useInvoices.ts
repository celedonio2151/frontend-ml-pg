import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoicesService } from 'modules/invoices/services/invoices.service';
import type { InvoicesListParams, PayInvoiceDto } from 'modules/invoices/types/invoice.types';

export const invoicesQueryKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesQueryKeys.all, 'list'] as const,
  list: (params: InvoicesListParams) => [...invoicesQueryKeys.lists(), params] as const,
  detail: (id: string) => [...invoicesQueryKeys.all, 'detail', id] as const,
  morosos: () => [...invoicesQueryKeys.all, 'morosos'] as const,
};

export function useInvoices(params: InvoicesListParams = {}) {
  return useQuery({
    queryKey: invoicesQueryKeys.list(params),
    queryFn: () => invoicesService.findAll(params),
  });
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: invoicesQueryKeys.detail(id),
    queryFn: () => invoicesService.findOne(id),
    enabled: Boolean(id),
  });
}

export function usePayInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayInvoiceDto }) =>
      invoicesService.payInvoice(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.morosos() });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.detail(variables.id) });
    },
  });
}

export function useMorosos() {
  return useQuery({
    queryKey: invoicesQueryKeys.morosos(),
    queryFn: () => invoicesService.getMorosos(),
  });
}

export function useRunMorososCheckMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => invoicesService.runMorososCheck(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: invoicesQueryKeys.morosos() });
    },
  });
}
