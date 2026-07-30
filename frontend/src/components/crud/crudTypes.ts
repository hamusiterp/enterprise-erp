import type {
    ReactNode,
} from 'react';

import type {
    TableProps,
} from 'antd';

export type CrudStatus =
    | 'active'
    | 'inactive';

export interface CrudRecord {
    id: number;
    status?: CrudStatus;
}

export interface CrudPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface CrudListResponse<
    TRecord,
> {
    data: TRecord[];
    meta: CrudPaginationMeta;
}

export interface CrudListParameters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: CrudStatus | '';
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface CrudApi<
    TRecord extends CrudRecord,
    TFormValues,
> {
    fetch: (
        parameters: CrudListParameters,
    ) => Promise<CrudListResponse<TRecord>>;

    fetchStatistics?: () =>
    Promise<CrudStatisticsData>;

    create: (
        values: TFormValues,
    ) => Promise<unknown>;

    update: (
        id: number,
        values: TFormValues,
    ) => Promise<unknown>;

    remove: (
        id: number,
    ) => Promise<{
        message: string;
    }>;

    changeStatus?: (
        id: number,
        status: CrudStatus,
    ) => Promise<unknown>;

    export?: (
        parameters: Pick<
            CrudListParameters,
            'search' | 'status'
        >,
    ) => Promise<void>;
}

export interface CrudPageProps<
    TRecord extends CrudRecord,
    TFormValues extends object,
> {
    title: string;
    description?: string;
    createButtonText: string;

    api: CrudApi<
        TRecord,
        TFormValues
    >;

    columns: TableProps<TRecord>['columns'];

    formFields: ReactNode;

    formInitialValues: TFormValues;

    getFormValues: (
        record: TRecord,
    ) => TFormValues;

    viewContent?: (
        record: TRecord,
    ) => ReactNode;

    searchPlaceholder?: string;

    defaultSortBy?: string;

    canChangeStatus?: boolean;
}

export interface CrudStatisticsData {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
}