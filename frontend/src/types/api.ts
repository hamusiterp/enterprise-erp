export type RecordStatus = 'active' | 'inactive';

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface BaseListFilters {
  search?: string;
  status?: RecordStatus | '';
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}