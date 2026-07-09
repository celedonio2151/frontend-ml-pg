import { useQuery } from '@tanstack/react-query';
import { metersService } from 'modules/meters/services/meters.service';
import type { MetersListParams } from 'modules/meters/types/meter.types';

export const metersQueryKeys = {
  all: ['meters'] as const,
  lists: () => [...metersQueryKeys.all, 'list'] as const,
  list: (params: MetersListParams) => [...metersQueryKeys.lists(), params] as const,
};

export function useMeters(params: MetersListParams = {}) {
  return useQuery({
    queryKey: metersQueryKeys.list(params),
    queryFn: () => metersService.findAll(params),
  });
}
