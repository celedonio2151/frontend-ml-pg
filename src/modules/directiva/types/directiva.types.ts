import type { User } from 'modules/users/types/user.types';
import type { PaginatedData, SortParam } from 'shared/types/api-reponse';

export type BoardDirector = {
  id: string;
  startDate: string;
  endDate: string;
  positionRole: string;
  order: number;
  description: string | null;
  status: boolean;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export type BoardDirectorsList = PaginatedData<BoardDirector>;

export type BoardDirectorsListParams = {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: SortParam[];
  withDeleted?: boolean;
  year?: number;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  positionRole?: string;
  status?: boolean;
};

export type CreateBoardDirectorDto = {
  startDate: string;
  endDate: string;
  positionRole: string;
  order: number;
  description?: string;
  status?: boolean;
  userId: string;
};

export type UpdateBoardDirectorDto = Partial<CreateBoardDirectorDto>;
