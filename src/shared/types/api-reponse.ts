interface Meta {
  total: number;
  pages: number;
  currentPage: number;
}

export type SortParam = { whom: string; order: 'asc' | 'desc' };

export interface PaginatedData<T> {
  items: T[];
  meta: Meta;
}

export interface ApiResponse<T> {
  method: string;
  success: boolean;
  status: string;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  data: T;
}
