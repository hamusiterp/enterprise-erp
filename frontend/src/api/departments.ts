import apiClient from './client';

import type {
    DepartmentFormValues,
    DepartmentListParams,
    DepartmentListResponse,
    DepartmentResponse,
    DepartmentStatus,
} from '../types/department';

function removeEmptyParameters(
    parameters: Record<
        string,
        unknown
    >,
): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(
            parameters,
        ).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== '',
        ),
    );
}

export async function fetchDepartments(
    parameters: DepartmentListParams,
): Promise<DepartmentListResponse> {
    const response =
        await apiClient.get<DepartmentListResponse>(
            '/api/admin/departments',
            {
                params:
                    removeEmptyParameters(
                        parameters,
                    ),
            },
        );

    return response.data;
}

export async function createDepartment(
    values: DepartmentFormValues,
): Promise<DepartmentResponse> {
    const response =
        await apiClient.post<DepartmentResponse>(
            '/api/admin/departments',
            values,
        );

    return response.data;
}

export async function updateDepartment(
    departmentId: number,
    values: DepartmentFormValues,
): Promise<DepartmentResponse> {
    const response =
        await apiClient.put<DepartmentResponse>(
            `/api/admin/departments/${departmentId}`,
            values,
        );

    return response.data;
}

export async function deleteDepartment(
    departmentId: number,
): Promise<{
    message: string;
}> {
    const response =
        await apiClient.delete<{
            message: string;
        }>(
            `/api/admin/departments/${departmentId}`,
        );

    return response.data;
}

export async function changeDepartmentStatus(
    departmentId: number,
    status: DepartmentStatus,
): Promise<DepartmentResponse> {
    const response =
        await apiClient.patch<DepartmentResponse>(
            `/api/admin/departments/${departmentId}/status`,
            {
                status,
            },
        );

    return response.data;
}

export async function exportDepartments(
    parameters: Pick<
        DepartmentListParams,
        'search' | 'status'
    >,
): Promise<void> {
    const response =
        await apiClient.get(
            '/api/admin/departments/export',
            {
                params:
                    removeEmptyParameters(
                        parameters,
                    ),

                responseType:
                    'blob',
            },
        );

    const contentDisposition =
        response.headers[
            'content-disposition'
        ];

    let fileName =
        `departments-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`;

    const fileNameMatch =
        contentDisposition?.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );

    if (
        fileNameMatch?.[1]
    ) {
        fileName =
            fileNameMatch[1].replace(
                /['"]/g,
                '',
            );
    }

    const blobUrl =
        window.URL.createObjectURL(
            new Blob([
                response.data,
            ]),
        );

    const downloadLink =
        document.createElement(
            'a',
        );

    downloadLink.href =
        blobUrl;

    downloadLink.download =
        fileName;

    document.body.appendChild(
        downloadLink,
    );

    downloadLink.click();
    downloadLink.remove();

    window.URL.revokeObjectURL(
        blobUrl,
    );
}

export const fetchDeletedDepartments = async (params?: any) => {
    const response = await apiClient.get(
        '/api/admin/departments/deleted',
        { params }
    );

    return response.data;
};

export const restoreDepartment = async (id: number) => {
    const response = await apiClient.patch(
        `/api/admin/departments/${id}/restore`
    );

    return response.data;
};

export const forceDeleteDepartment = async (id: number) => {
    const response = await apiClient.delete(
        `/api/admin/departments/${id}/force-delete`
    );

    return response.data;
};

export interface DepartmentStatistics {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
}

export const fetchDepartmentStatistics =
    async (): Promise<DepartmentStatistics> => {
        const response = await apiClient.get(
            '/api/admin/departments/statistics'
        );

        return response.data.data;
    };

    export interface DepartmentOption {
    id: number;
    department_name: string;
}

export async function fetchDepartmentOptions(): Promise<DepartmentOption[]> {
    const response = await apiClient.get(
        '/api/admin/departments/options'
    );

    return response.data.data;
}

