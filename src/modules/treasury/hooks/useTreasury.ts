import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { treasuryService } from 'modules/treasury/services/treasury.service';
import type { CreateAdjustmentDto, TreasuryListParams } from 'modules/treasury/types/treasury.types';

export const treasuryQueryKeys = {
  all: ['treasury'] as const,
  lists: () => [...treasuryQueryKeys.all, 'list'] as const,
  list: (params: TreasuryListParams) => [...treasuryQueryKeys.lists(), params] as const,
  balance: () => [...treasuryQueryKeys.all, 'balance'] as const,
  summary: (dateFrom?: string, dateTo?: string) => [...treasuryQueryKeys.all, 'summary', { dateFrom, dateTo }] as const,
};

export function useTreasuryMovements(params: TreasuryListParams = {}) {
  return useQuery({
    queryKey: treasuryQueryKeys.list(params),
    queryFn: () => treasuryService.findAll(params),
  });
}

export function useTreasuryBalance() {
  return useQuery({
    queryKey: treasuryQueryKeys.balance(),
    queryFn: treasuryService.getBalance,
  });
}

export function useTreasurySummary(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: treasuryQueryKeys.summary(dateFrom, dateTo),
    queryFn: () => treasuryService.getSummary(dateFrom, dateTo),
  });
}

export function useCreateAdjustmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdjustmentDto) => treasuryService.createAdjustment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: treasuryQueryKeys.all });
    },
  });
}
