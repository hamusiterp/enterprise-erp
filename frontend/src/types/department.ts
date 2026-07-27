export type DepartmentStatus =
    | 'active'
    | 'inactive';

export interface RegisteredByUser {
    id: number;
    name: string;
    email: string;
}

export interface Department {
    id: number;
    department_id: string;
    department_name: string;
    description: string | null;
    status: DepartmentStatus;
    registered_by: RegisteredByUser | null;
    created_at: string;
    updated_at: string;
}

export interface DepartmentFormValues {
    department_name: string;
    description?: string;
    status: DepartmentStatus;
}

export interface DepartmentListParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: DepartmentStatus | '';
    sort_by?:
        | 'department_id'
        | 'department_name'
        | 'status'
        | 'created_at'
        | 'updated_at';
    sort_order?: 'asc' | 'desc';
}

export interface DepartmentMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface DepartmentListResponse {
    data: Department[];
    meta: DepartmentMeta;
}

export interface DepartmentResponse {
    message?: string;
    data: Department;
}