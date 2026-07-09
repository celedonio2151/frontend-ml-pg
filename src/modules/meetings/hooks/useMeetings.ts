import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingsService } from 'modules/meetings/services/meetings.service';
import type {
  CreateMeetingDto,
  MeetingsListParams,
  UpdateMeetingDto,
} from 'modules/meetings/types/meeting.types';

export const meetingsQueryKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingsQueryKeys.all, 'list'] as const,
  list: (params: MeetingsListParams) => [...meetingsQueryKeys.lists(), params] as const,
  detail: (id: string) => [...meetingsQueryKeys.all, 'detail', id] as const,
};

export function useMeetings(params: MeetingsListParams = {}) {
  return useQuery({
    queryKey: meetingsQueryKeys.list(params),
    queryFn: () => meetingsService.findAll(params),
  });
}

export function useMeeting(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: meetingsQueryKeys.detail(id ?? ''),
    queryFn: () => meetingsService.findOne(id!),
  });
}

export function useCreateMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMeetingDto) => meetingsService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKeys.lists() });
    },
  });
}

export function useUpdateMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMeetingDto }) =>
      meetingsService.update(id, payload),
    onSuccess: (meeting) => {
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKeys.detail(meeting.id) });
    },
  });
}

export function useDeleteMeetingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingsService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingsQueryKeys.lists() });
    },
  });
}
