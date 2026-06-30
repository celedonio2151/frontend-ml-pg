import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from 'modules/users/services/users.service';
import type { CreateUserDto, UpdateUserDto, UsersListParams } from 'modules/users/types/user.types';

export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
  list: (params: UsersListParams) => [...usersQueryKeys.lists(), params] as const,
  detail: (id: string) => [...usersQueryKeys.all, 'detail', id] as const,
};

export function useUsers(params: UsersListParams = {}) {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => usersService.findAll(params),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => usersService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDto }) =>
      usersService.update(id, payload),
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail(user.id) });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() });
    },
  });
}

