import apiClient from './client';

import type {
    Designation,
    DesignationFormValues,
    DesignationListParams,
    DesignationListResponse,
    DesignationResponse,
    DesignationStatus,
} from '../types/designation';

const DESIGNATIONS_URL =
    '/api/admin/designations';

interface CrudDesignationListResponse {
    data: Designation[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

interface ActionResponse {
    message: string;
}

function removeEmptyParameters<T extends object>(
    parameters: T,
): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(parameters).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== '',
        ),
    );
}

function normalizeListResponse(
    response: DesignationListResponse,
): CrudDesignationListResponse {
    return {
        data: response.data,
        meta: {
            current_page:
                response.pagination.current_page,
            last_page:
                response.pagination.last_page,
            per_page:
                response.pagination.per_page,
            total:
                response.pagination.total,
            from:
                response.pagination.from,
            to:
                response.pagination.to,
        },
    };
}

export async function fetchDesignations(
    parameters: DesignationListParams,
): Promise<CrudDesignationListResponse> {
    const response =
        await apiClient.get<DesignationListResponse>(
            DESIGNATIONS_URL,
            {
                params:
                    removeEmptyParameters(
                        parameters,
                    ),
            },
        );

    return normalizeListResponse(
        response.data,
    );
}

export async function getDesignation(
    id: number,
): Promise<Designation> {
    const response =
        await apiClient.get<DesignationResponse>(
            `${DESIGNATIONS_URL}/${id}`,
        );

    return response.data.data;
}

export async function createDesignation(
    values: DesignationFormValues,
): Promise<DesignationResponse> {
    const response =
        await apiClient.post<DesignationResponse>(
            DESIGNATIONS_URL,
            values,
        );

    return response.data;
}

export async function updateDesignation(
    id: number,
    values: DesignationFormValues,
): Promise<DesignationResponse> {
    const response =
        await apiClient.put<DesignationResponse>(
            `${DESIGNATIONS_URL}/${id}`,
            values,
        );

    return response.data;
}

export async function changeDesignationStatus(
    id: number,
    status: DesignationStatus,
): Promise<DesignationResponse> {
    const response =
        await apiClient.patch<DesignationResponse>(
            `${DESIGNATIONS_URL}/${id}/status`,
            { status },
        );

    return response.data;
}

export async function deleteDesignation(
    id: number,
): Promise<ActionResponse> {
    const response =
        await apiClient.delete<ActionResponse>(
            `${DESIGNATIONS_URL}/${id}`,
        );

    return response.data;
}

export async function fetchDeletedDesignations(
    parameters?: DesignationListParams,
): Promise<CrudDesignationListResponse> {
    const response =
        await apiClient.get<DesignationListResponse>(
            `${DESIGNATIONS_URL}/deleted`,
            {
                params:
                    removeEmptyParameters(
                        parameters ?? {},
                    ),
            },
        );

    return normalizeListResponse(
        response.data,
    );
}

export async function restoreDesignation(
    id: number,
): Promise<ActionResponse> {
    const response =
        await apiClient.patch<ActionResponse>(
            `${DESIGNATIONS_URL}/${id}/restore`,
        );

    return response.data;
}

export async function forceDeleteDesignation(
    id: number,
): Promise<ActionResponse> {
    const response =
        await apiClient.delete<ActionResponse>(
            `${DESIGNATIONS_URL}/${id}/force-delete`,
        );

    return response.data;
}

export async function exportDesignations(
    parameters: Pick<
        DesignationListParams,
        'search' | 'status'
    >,
): Promise<void> {
    const response =
        await apiClient.get(
            `${DESIGNATIONS_URL}/export`,
            {
                params:
                    removeEmptyParameters(
                        parameters,
                    ),
                responseType: 'blob',
            },
        );

    const contentDisposition =
        response.headers[
            'content-disposition'
        ];

    let fileName =
        `designations-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`;

    const fileNameMatch =
        contentDisposition?.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );

    if (fileNameMatch?.[1]) {
        fileName =
            fileNameMatch[1].replace(
                /['"]/g,
                '',
            );
    }

    const blobUrl =
        window.URL.createObjectURL(
            new Blob([response.data]),
        );

    const downloadLink =
        document.createElement('a');

    downloadLink.href = blobUrl;
    downloadLink.download = fileName;

    document.body.appendChild(
        downloadLink,
    );

    downloadLink.click();
    downloadLink.remove();

    window.URL.revokeObjectURL(
        blobUrl,
    );
}