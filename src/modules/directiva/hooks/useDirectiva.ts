import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { directivaService } from 'modules/directiva/services/directiva.service';
import type {
  BoardDirectorsListParams,
  CreateBoardDirectorDto,
  UpdateBoardDirectorDto,
} from 'modules/directiva/types/directiva.types';

export const directivaQueryKeys = {
  all: ['board-directors'] as const,
  lists: () => [...directivaQueryKeys.all, 'list'] as const,
  list: (params: BoardDirectorsListParams) => [...directivaQueryKeys.lists(), params] as const,
};

export function useBoardDirectors(params: BoardDirectorsListParams = {}) {
  return useQuery({
    queryKey: directivaQueryKeys.list(params),
    queryFn: () => directivaService.findAll(params),
  });
}

export function useCreateBoardDirectorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBoardDirectorDto) => directivaService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: directivaQueryKeys.lists() });
    },
  });
}

export function useUpdateBoardDirectorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBoardDirectorDto }) =>
      directivaService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: directivaQueryKeys.lists() });
    },
  });
}

export function useDeleteBoardDirectorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => directivaService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: directivaQueryKeys.lists() });
    },
  });
}
