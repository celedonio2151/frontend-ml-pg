import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type Meeting = {
  attendees?: string[];
  content: string;
  createdAt: string;
  deletedAt?: string | null;
  documentUrl?: string;
  id: string;
  isDeleted?: boolean;
  meetingDate: string;
  title: string;
  updatedAt: string;
};

export type CreateMeetingDto = {
  attendees?: string[];
  content: string;
  documentUrl?: string;
  meetingDate: string;
  title: string;
};

export type UpdateMeetingDto = Partial<CreateMeetingDto>;

export type MeetingsListParams = {
  limit?: number;
  page?: number;
  q?: string;
  sortBy?: SortParam[];
  withDeleted?: boolean;
};

export type MeetingsList = PaginatedData<Meeting>;
