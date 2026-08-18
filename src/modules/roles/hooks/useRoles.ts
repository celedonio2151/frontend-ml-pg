import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesService } from 'modules/roles/services/roles.service';
import type { UpdateRoleDto } from 'modules/roles/types/role.types';

export const rolesQueryKeys = {
  all: ['roles'] as const,
  usersCount: () => [...rolesQueryKeys.all, 'users-count'] as const,
  lists: () => [...rolesQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...rolesQueryKeys.all, 'detail', id] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: rolesQueryKeys.lists(),
    queryFn: rolesService.findAll,
  });
}

export function useTotalUsersByRole() {
  return useQuery({
    queryKey: rolesQueryKeys.usersCount(),
    queryFn: rolesService.findTotalUsersByRole,
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoleDto }) =>
      rolesService.update(id, payload),
    onSuccess: (role) => {
      void queryClient.invalidateQueries({ queryKey: rolesQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: rolesQueryKeys.detail(role.id) });
    },
  });
}
