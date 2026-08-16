import api from './client';

export interface FiscalYear {
    id: number;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    is_active: boolean;
    is_locked: boolean;
    status: 'open' | 'closed';
    remarks?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface FiscalYearPayload {
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    is_current?: boolean;
    is_active: boolean;
    status: 'open' | 'closed';
    remarks?: string | null;
}

export const getFiscalYears = async (): Promise<FiscalYear[]> => {
    const response = await api.get('/api/settings/fiscal-years');

    return response.data.data;
};

export const createFiscalYear = async (
    data: FiscalYearPayload
): Promise<FiscalYear> => {
    const response = await api.post(
        '/api/settings/fiscal-years',
        data
    );

    return response.data.data;
};

export const updateFiscalYear = async (
    id: number,
    data: FiscalYearPayload
): Promise<FiscalYear> => {
    const response = await api.put(
        `/api/settings/fiscal-years/${id}`,
        data
    );

    return response.data.data;
};

export const setCurrentFiscalYear = async (
    id: number
): Promise<FiscalYear> => {
    const response = await api.post(
        `/api/settings/fiscal-years/${id}/set-current`
    );

    return response.data.data;
};

export const closeFiscalYear = async (
    id: number
): Promise<FiscalYear> => {
    const response = await api.post(
        `/api/settings/fiscal-years/${id}/close`
    );

    return response.data.data;
};

export const lockFiscalYear = async (
    id: number
): Promise<FiscalYear> => {
    const response = await api.post(
        `/api/settings/fiscal-years/${id}/lock`
    );

    return response.data.data;
};