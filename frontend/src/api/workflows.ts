import apiClient from './client';

export interface WorkflowState {
    id?: number;
    workflow_definition_id?: number;

    code: string;
    name: string;
    sequence: number;

    is_initial: boolean;
    is_final: boolean;
    is_editable: boolean;
    is_active: boolean;

    color?: string | null;
    description?: string | null;
}

export interface WorkflowTransition {
    id?: number;
    workflow_definition_id?: number;

    from_state_id?: number;
    to_state_id?: number;

    from_state_code?: string;
    to_state_code?: string;

    action: string;
    name: string;

    permission_name?: string | null;

    is_return: boolean;
    requires_remarks: boolean;
    is_active: boolean;

    sequence: number;

    description?: string | null;

    from_state?: WorkflowState;
    to_state?: WorkflowState;
}

export interface WorkflowDefinition {
    id: number;

    code: string;
    name: string;
    module_key: string;

    description?: string | null;

    version: number;
    is_active: boolean;

    states: WorkflowState[];
    transitions: WorkflowTransition[];
}

export interface WorkflowDefinitionPayload {
    code: string;
    name: string;
    module_key: string;

    description?: string | null;

    version: number;
    is_active: boolean;

    states: WorkflowState[];

    transitions: Array<{
        from_state_code: string;
        to_state_code: string;

        action: string;
        name: string;

        permission_name?: string | null;

        is_return: boolean;
        requires_remarks: boolean;
        is_active: boolean;

        sequence: number;

        description?: string | null;
    }>;
}

export async function fetchWorkflows(
    moduleKey?: string
): Promise<WorkflowDefinition[]> {
    const response = await apiClient.get(
        '/api/settings/workflows',
        {
            params: moduleKey
                ? {
                      module_key: moduleKey,
                  }
                : undefined,
        }
    );

    return response.data.data;
}

export async function fetchWorkflow(
    id: number
): Promise<WorkflowDefinition> {
    const response = await apiClient.get(
        `/api/settings/workflows/${id}`
    );

    return response.data.data;
}

export async function createWorkflow(
    values: WorkflowDefinitionPayload
): Promise<WorkflowDefinition> {
    const response = await apiClient.post(
        '/api/settings/workflows',
        values
    );

    return response.data.data;
}

export async function updateWorkflow(
    id: number,
    values: WorkflowDefinitionPayload
): Promise<WorkflowDefinition> {
    const response = await apiClient.put(
        `/api/settings/workflows/${id}`,
        values
    );

    return response.data.data;
}