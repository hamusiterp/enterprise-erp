import api from './client';

export interface DocumentSequence {
    id: number;
    document_type: string;
    name: string;
    prefix: string;

    fiscal_year_id: number;

    current_number: number;
    number_length: number;
    format: string;

    reset_per_fiscal_year: boolean;
    is_active: boolean;

    remarks?: string | null;

    fiscal_year?: {
        id: number;
        name: string;
        code: string;
        start_date: string;
        end_date: string;
    };
}

export interface DocumentSequencePayload {
    document_type: string;
    name: string;
    prefix: string;

    fiscal_year_id: number;

    current_number?: number;
    number_length: number;
    format: string;

    reset_per_fiscal_year: boolean;
    is_active: boolean;

    remarks?: string | null;
}

export const getDocumentSequences = async (
    fiscalYearId?: number
): Promise<DocumentSequence[]> => {
    const response = await api.get(
        '/api/settings/document-sequences',
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

export const createDocumentSequence = async (
    data: DocumentSequencePayload
): Promise<DocumentSequence> => {
    const response = await api.post(
        '/api/settings/document-sequences',
        data
    );

    return response.data.data;
};

export const updateDocumentSequence = async (
    id: number,
    data: DocumentSequencePayload
): Promise<DocumentSequence> => {
    const response = await api.put(
        `/api/settings/document-sequences/${id}`,
        data
    );

    return response.data.data;
};