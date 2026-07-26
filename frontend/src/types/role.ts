export interface Permission {
    id: number;
    name: string;
    label: string;
}

export interface PermissionGroup {
    module: string;
    label: string;
    permissions: Permission[];
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;

    permissions: string[];

    permissions_count: number;

    users_count: number;

    is_system: boolean;

    created_at: string | null;

    updated_at: string | null;
}

export interface PaginatedRolesResponse {
    data: Role[];

    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface PermissionResponse {
    data: PermissionGroup[];
}

export interface RoleForm {
    name: string;

    permissions: string[];
}