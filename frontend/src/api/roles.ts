import apiClient from './client';

import type {
    PaginatedRolesResponse,
    PermissionResponse,
    Role,
    RoleForm,
} from '../types/role';

interface MessageResponse {
    message: string;
}

interface RoleResponse {
    data: Role;
}

function cleanParams(params: Record<string, unknown>) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== '',
        ),
    );
}

export async function fetchRoles(
    page = 1,
    search = '',
    per_page = 10,
): Promise<PaginatedRolesResponse> {

    const response =
        await apiClient.get<PaginatedRolesResponse>(
            '/api/admin/roles',
            {
                params: cleanParams({
                    page,
                    search,
                    per_page,
                }),
            },
        );

    return response.data;
}

export async function fetchPermissions():
Promise<PermissionResponse> {

    const response =
        await apiClient.get<PermissionResponse>(
            '/api/admin/roles/permissions',
        );

    return response.data;
}

export async function createRole(
    values: RoleForm,
): Promise<Role> {

    const response =
        await apiClient.post<RoleResponse>(
            '/api/admin/roles',
            values,
        );

    return response.data.data;
}

export async function updateRole(
    id: number,
    values: RoleForm,
): Promise<Role> {

    const response =
        await apiClient.put<RoleResponse>(
            `/api/admin/roles/${id}`,
            values,
        );

    return response.data.data;
}

export async function deleteRole(
    id: number,
): Promise<MessageResponse> {

    const response =
        await apiClient.delete<MessageResponse>(
            `/api/admin/roles/${id}`,
        );

    return response.data;
}

export async function getRole(
    id: number,
): Promise<Role> {

    const response =
        await apiClient.get<RoleResponse>(
            `/api/admin/roles/${id}`,
        );

    return response.data.data;
}

export async function exportRoles(
    search = '',
): Promise<void> {
    const response = await apiClient.get(
        '/api/admin/roles/export',
        {
            params: search
                ? { search }
                : undefined,

            responseType: 'blob',
        },
    );

    const disposition =
        response.headers['content-disposition'];

    const match = disposition?.match(
        /filename="?([^"]+)"?/,
    );

    const fileName =
        match?.[1] ?? 'roles.xlsx';

    const url = window.URL.createObjectURL(
        new Blob([response.data]),
    );

    const link =
        document.createElement('a');

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}