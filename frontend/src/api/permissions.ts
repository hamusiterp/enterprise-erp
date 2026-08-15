import apiClient from './client';

import type {
    MessageResponse,
    Permission,
    PermissionForm,
    PermissionListResponse,
    PermissionResponse,
} from '../types/permission';

const PERMISSIONS_URL =
    '/api/admin/permissions';

export async function fetchPermissions(
    page = 1,
    search = '',
    perPage = 10,
): Promise<PermissionListResponse> {
    const response =
        await apiClient.get<PermissionListResponse>(
            PERMISSIONS_URL,
            {
                params: {
                    page,
                    per_page: perPage,
                    search:
                        search || undefined,
                },
            },
        );

    return response.data;
}

export async function createPermission(
    values: PermissionForm,
): Promise<Permission> {
    const name =
        `${values.module}.${values.action}`
            .trim()
            .toLowerCase();

    const response =
        await apiClient.post<PermissionResponse>(
            PERMISSIONS_URL,
            {
                name,
            },
        );

    return response.data.data;
}

export async function updatePermission(
    id: number,
    values: PermissionForm,
): Promise<Permission> {
    const name =
        `${values.module}.${values.action}`
            .trim()
            .toLowerCase();

    const response =
        await apiClient.put<PermissionResponse>(
            `${PERMISSIONS_URL}/${id}`,
            {
                name,
            },
        );

    return response.data.data;
}

export async function deletePermission(
    id: number,
): Promise<MessageResponse> {
    const response =
        await apiClient.delete<MessageResponse>(
            `${PERMISSIONS_URL}/${id}`,
        );

    return response.data;
}