import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsService } from 'modules/settings/services/settings.service';
import type { SettingsListParams } from 'modules/settings/types/setting.types';

export const settingsQueryKeys = {
  all: ['settings'] as const,
  lists: () => [...settingsQueryKeys.all, 'list'] as const,
  list: (params: SettingsListParams) => [...settingsQueryKeys.lists(), params] as const,
  detail: (key: string) => [...settingsQueryKeys.all, 'detail', key] as const,
};

export function useSettings(params: SettingsListParams = {}) {
  return useQuery({
    queryKey: settingsQueryKeys.list(params),
    queryFn: () => settingsService.findAll(params),
  });
}

export function useSetting(key: string | undefined) {
  return useQuery({
    queryKey: settingsQueryKeys.detail(key ?? ''),
    queryFn: () => settingsService.findOne(key as string),
    enabled: Boolean(key),
  });
}

export function useUpdateSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsService.update(key, { value }),
    onSuccess: (setting) => {
      void queryClient.invalidateQueries({ queryKey: settingsQueryKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.detail(setting.settingKey),
      });
    },
  });
}
