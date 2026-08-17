import api from './client';

export interface AccessPolicySchedule {
    id?: number;
    day_of_week: number;
    start_time?: string | null;
    end_time?: string | null;
    is_allowed_day: boolean;
    is_active: boolean;
}

export interface AccessPolicyAssignment {
    id?: number;
    target_type:
        | 'system'
        | 'module'
        | 'permission'
        | 'role'
        | 'user';

    target_key?: string | null;
    target_id?: number | null;

    is_active: boolean;

    effective_from?: string | null;
    effective_to?: string | null;

    remarks?: string | null;
}

export interface AccessPolicy {
    id: number;
    name: string;
    code: string;
    description?: string | null;

    policy_type: 'allow' | 'deny';

    is_active: boolean;
    priority: number;

    schedules: AccessPolicySchedule[];
    assignments: AccessPolicyAssignment[];
}

export interface AccessPolicyPayload {
    name: string;
    code: string;
    description?: string | null;

    policy_type: 'allow' | 'deny';

    is_active: boolean;
    priority: number;

    schedules: AccessPolicySchedule[];
    assignments: AccessPolicyAssignment[];
}

export const getAccessPolicies = async (): Promise<
    AccessPolicy[]
> => {
    const response = await api.get(
        '/api/settings/access-policies'
    );

    return response.data.data;
};

export const createAccessPolicy = async (
    data: AccessPolicyPayload
): Promise<AccessPolicy> => {
    const response = await api.post(
        '/api/settings/access-policies',
        data
    );

    return response.data.data;
};

export const updateAccessPolicy = async (
    id: number,
    data: AccessPolicyPayload
): Promise<AccessPolicy> => {
    const response = await api.put(
        `/api/settings/access-policies/${id}`,
        data
    );

    return response.data.data;
};