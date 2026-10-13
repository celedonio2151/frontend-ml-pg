import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { myAccountService } from 'modules/my-account/services/my-account.service';
import type {
  MyMetersListParams,
  MyReadingsListParams,
  UpdateMyProfileDto,
} from 'modules/my-account/types/my-account.types';

export const myAccountQueryKeys = {
  all: ['my-account'] as const,
  profile: () => [...myAccountQueryKeys.all, 'profile'] as const,
  meters: (params: MyMetersListParams) => [...myAccountQueryKeys.all, 'meters', params] as const,
  readings: (params: MyReadingsListParams) =>
    [...myAccountQueryKeys.all, 'readings', params] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: myAccountQueryKeys.profile(),
    queryFn: () => myAccountService.getProfile(),
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyProfileDto) => myAccountService.updateProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myAccountQueryKeys.profile() });
    },
  });
}

export function useMyMeters(params: MyMetersListParams = {}) {
  return useQuery({
    queryKey: myAccountQueryKeys.meters(params),
    queryFn: () => myAccountService.findMyMeters(params),
  });
}

export function useMyReadings(params: MyReadingsListParams = {}) {
  return useQuery({
    queryKey: myAccountQueryKeys.readings(params),
    queryFn: () => myAccountService.findMyReadings(params),
  });
}
