import api from './client';

export interface TaxRate {
    id: number;
    code: string;
    name: string;
    type: string;
    rate: string | number;

    country_code?: string | null;

    effective_from: string;
    effective_to?: string | null;

    fiscal_year_id?: number | null;

    calculation_method:
        | 'add'
        | 'deduct'
        | 'info';

    is_active: boolean;
    is_default: boolean;

    description?: string | null;

    fiscal_year?: {
        id: number;
        name: string;
        code: string;
    } | null;
}

export interface TaxRatePayload {
    code: string;
    name: string;
    type: string;
    rate: number;

    country_code?: string | null;

    effective_from: string;
    effective_to?: string | null;

    fiscal_year_id?: number | null;

    calculation_method:
        | 'add'
        | 'deduct'
        | 'info';

    is_active: boolean;
    is_default: boolean;

    description?: string | null;
}

export const getTaxRates = async (): Promise<TaxRate[]> => {
    const response = await api.get(
        '/api/settings/tax-rates'
    );

    return response.data.data;
};

export const createTaxRate = async (
    data: TaxRatePayload
): Promise<TaxRate> => {
    const response = await api.post(
        '/api/settings/tax-rates',
        data
    );

    return response.data.data;
};

export const updateTaxRate = async (
    id: number,
    data: TaxRatePayload
): Promise<TaxRate> => {
    const response = await api.put(
        `/api/settings/tax-rates/${id}`,
        data
    );

    return response.data.data;
};