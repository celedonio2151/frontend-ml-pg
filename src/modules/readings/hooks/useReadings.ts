import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsService } from 'modules/readings/services/readings.service';
import type {
  CreateReadingDto,
  ReadingsListParams,
  UpdateReadingDto,
} from 'modules/readings/types/reading.types';

export const readingsQueryKeys = {
  all: ['readings'] as const,
  lists: () => [...readingsQueryKeys.all, 'list'] as const,
  list: (params: ReadingsListParams) => [...readingsQueryKeys.lists(), params] as const,
  detail: (id: string) => [...readingsQueryKeys.all, 'detail', id] as const,
};

export function useReadings(params: ReadingsListParams = {}) {
  return useQuery({
    queryKey: readingsQueryKeys.list(params),
    queryFn: () => readingsService.findAll(params),
  });
}

export function useReading(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: readingsQueryKeys.detail(id),
    queryFn: () => readingsService.findOne(id),
  });
}

export function useCreateReadingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReadingDto) => readingsService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: readingsQueryKeys.lists() });
    },
  });
}

export function useUpdateReadingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReadingDto }) =>
      readingsService.update(id, payload),
    onSuccess: (reading) => {
      void queryClient.invalidateQueries({ queryKey: readingsQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: readingsQueryKeys.detail(reading.id) });
    },
  });
}

export function useDeleteReadingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => readingsService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: readingsQueryKeys.lists() });
    },
  });
}
