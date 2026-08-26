import api from './client';

export interface CompanySetting {
    id: number;

    company_name: string;
    trading_name?: string | null;
    company_code?: string | null;

    logo?: string | null;
    logo_url?: string | null;

    favicon?: string | null;
    favicon_url?: string | null;

    email?: string | null;
    phone?: string | null;
    phone_2?: string | null;
    website?: string | null;

    country?: string | null;
    country_code?: string | null;
    city?: string | null;
    state_region?: string | null;
    address?: string | null;
    postal_code?: string | null;

    tin_number?: string | null;
    vat_number?: string | null;
    registration_number?: string | null;

    default_currency: string;
    timezone: string;
    date_format: string;

    print_header?: string | null;
    print_footer?: string | null;

    is_active: boolean;

    stock_management_enabled: boolean;
}

export const getCompanySettings = async (): Promise<CompanySetting> => {
    const response = await api.get(
        '/api/settings/company-profile'
    );

    return response.data.data;
};

export const updateCompanySettings = async (
    data: Partial<CompanySetting>
): Promise<CompanySetting> => {
    const response = await api.put(
        '/api/settings/company-profile',
        data
    );

    return response.data.data;
};

export const uploadCompanyBranding = async (
    logo?: File,
    favicon?: File
): Promise<CompanySetting> => {
    const formData = new FormData();

    if (logo) {
        formData.append('logo', logo);
    }

    if (favicon) {
        formData.append('favicon', favicon);
    }

    const response = await api.post(
        '/api/settings/company-profile/branding',
        formData
    );

    return response.data.data;
};