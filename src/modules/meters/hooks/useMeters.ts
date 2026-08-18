import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { metersService } from 'modules/meters/services/meters.service';
import type {
  ChangeOwnerDto,
  CreateMeterDto,
  MetersListParams,
  UpdateMeterDto,
} from 'modules/meters/types/meter.types';

export const metersQueryKeys = {
  all: ['meters'] as const,
  lists: () => [...metersQueryKeys.all, 'list'] as const,
  list: (params: MetersListParams) => [...metersQueryKeys.lists(), params] as const,
  detail: (id: string) => [...metersQueryKeys.all, 'detail', id] as const,
};

export function useMeters(params: MetersListParams = {}) {
  return useQuery({
    queryKey: metersQueryKeys.list(params),
    queryFn: () => metersService.findAll(params),
  });
}

export function useMeter(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: metersQueryKeys.detail(id ?? ''),
    queryFn: () => metersService.findOne(id),
  });
}

export function useCreateMeterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeterDto) => metersService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.lists() });
    },
  });
}

export function useUpdateMeterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMeterDto }) =>
      metersService.update(id, payload),
    onSuccess: (meter) => {
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.detail(meter.id) });
    },
  });
}

export function useChangeMeterOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangeOwnerDto }) =>
      metersService.changeOwner(id, payload),
    onSuccess: (meter) => {
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.detail(meter.id) });
    },
  });
}

export function useDeleteMeterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => metersService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: metersQueryKeys.lists() });
    },
  });
}
