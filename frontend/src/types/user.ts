export type UserStatus = 'active' | 'inactive' | 'locked';

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  roles: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  status: UserStatus;
  roles: string[];
}

export interface UserListParameters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: UserStatus;
  role?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface UserListResponse {
  data: SystemUser[];
  meta: PaginationMeta;
}

export interface UserFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: UserStatus;
    role?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

export interface PaginatedUsersResponse {
    data: SystemUser[];

    meta: PaginationMeta;
}

export interface RolesResponse {
    data: Role[];
}