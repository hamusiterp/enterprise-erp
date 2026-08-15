export interface Permission {
    id: number;
    name: string;
    module: string;
    action: string;
    guard_name: string;
    roles_count: number;
    created_at: string | null;
    updated_at: string | null;
}

export interface PermissionForm {
    module: string;
    action: string;
}

export interface PermissionListResponse {
    data: Permission[];

    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface PermissionResponse {
    message?: string;
    data: Permission;
}

export interface MessageResponse {
    message: string;
}