import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tariffService } from 'modules/settings/services/tariff.service';
import type { ReplaceTariffsDto } from 'modules/settings/types/tariff.types';

export const tariffsQueryKeys = {
  all: ['tariffs'] as const,
};

export function useTariffs() {
  return useQuery({
    queryKey: tariffsQueryKeys.all,
    queryFn: () => tariffService.findAll(),
  });
}

export function useReplaceTariffsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReplaceTariffsDto) => tariffService.replaceAll(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tariffsQueryKeys.all });
    },
  });
}
