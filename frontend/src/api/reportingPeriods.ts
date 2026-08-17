import api from './client';

export interface ReportingPeriod {
    id: number;
    fiscal_year_id: number;

    name: string;
    code: string;
    period_number: number;

    start_date: string;
    end_date: string;

    calendar_type:
        | 'gregorian'
        | 'ethiopian'
        | 'custom';

    display_start_date?: string | null;
    display_end_date?: string | null;

    is_active: boolean;
    is_closed: boolean;

    remarks?: string | null;

    fiscal_year?: {
        id: number;
        name: string;
        code: string;
        start_date: string;
        end_date: string;
    };
}

export interface ReportingPeriodPayload {
    fiscal_year_id: number;

    name: string;
    code: string;
    period_number: number;

    start_date: string;
    end_date: string;

    calendar_type:
        | 'gregorian'
        | 'ethiopian'
        | 'custom';

    display_start_date?: string | null;
    display_end_date?: string | null;

    is_active: boolean;
    is_closed: boolean;

    remarks?: string | null;
}

export const getReportingPeriods = async (
    fiscalYearId?: number
): Promise<ReportingPeriod[]> => {
    const response = await api.get(
        '/api/settings/reporting-periods',
        {
            params: fiscalYearId
                ? {
                    fiscal_year_id: fiscalYearId,
                }
                : undefined,
        }
    );

    return response.data.data;
};

export const createReportingPeriod = async (
    data: ReportingPeriodPayload
): Promise<ReportingPeriod> => {
    const response = await api.post(
        '/api/settings/reporting-periods',
        data
    );

    return response.data.data;
};

export const updateReportingPeriod = async (
    id: number,
    data: ReportingPeriodPayload
): Promise<ReportingPeriod> => {
    const response = await api.put(
        `/api/settings/reporting-periods/${id}`,
        data
    );

    return response.data.data;
};