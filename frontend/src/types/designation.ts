export type DesignationStatus = 'active' | 'inactive';

export interface DesignationDepartment {
    id: number;
    code: string | null;
    name: string;
}

export interface Designation {
    id: number;
    code: string;
    name: string;
    department_id: number | null;
    department?: {
    id: number;
    department_name: string;
} | null;
    level: number | null;
    status: DesignationStatus;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface DesignationFormValues {
    code: string;
    name: string;
    department_id?: number | null;
    level?: number | null;
    status: DesignationStatus;
    description?: string | null;
}

export interface DesignationListParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: DesignationStatus | '';
    department_id?: number;
    level?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface DesignationListResponse {
    success: boolean;
    message: string;
    data: Designation[];
    pagination: PaginationMeta;
}

export interface DesignationResponse {
    success: boolean;
    message?: string;
    data: Designation;
}