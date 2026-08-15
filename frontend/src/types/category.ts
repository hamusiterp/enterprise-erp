export type CategoryStatus =
  | 'active'
  | 'inactive';

export interface Category {
  id: number;

  category: string;

  type: string;

  status: CategoryStatus;

  created_at: string | null;

  updated_at: string | null;

  deleted_at: string | null;
}

export interface CategoryFormValues {
  category: string;

  type: string;

  status: CategoryStatus;
}

export interface CategoryStatistics {
  total: number;

  active: number;

  inactive: number;

  deleted: number;
}

export interface CategoryOption {
  value: number;
  label: string;

  id: number;
  category: string;
  name?: string;
  type: string;
}

export interface CategoryFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  type?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}