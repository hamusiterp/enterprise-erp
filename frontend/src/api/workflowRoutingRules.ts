import apiClient from './client';

export type WorkflowAssignmentType =
    | 'department'
    | 'role'
    | 'permission'
    | 'user';

export type WorkflowAssignmentMode =
    | 'all'
    | 'first_available'
    | 'manual';

export interface WorkflowRoutingRule {
    id: number;

    workflow_definition_id: number;
    workflow_state_id: number;
    workflow_transition_id?: number | null;

    assignment_type: WorkflowAssignmentType;

    assigned_to_id?: number | null;
    assigned_to_key?: string | null;

    assignment_mode: WorkflowAssignmentMode;

    sla_minutes?: number | null;

    is_active: boolean;
    priority: number;

    remarks?: string | null;

    workflow_state?: {
        id: number;
        name: string;
        code: string;
    };

    workflow_transition?: {
        id: number;
        name: string;
        action: string;
    } | null;
}

export interface WorkflowRoutingRulePayload {
    workflow_state_id: number;
    workflow_transition_id?: number | null;

    assignment_type: WorkflowAssignmentType;

    assigned_to_id?: number | null;
    assigned_to_key?: string | null;

    assignment_mode: WorkflowAssignmentMode;

    sla_minutes?: number | null;

    is_active: boolean;
    priority: number;

    remarks?: string | null;
}

export async function fetchWorkflowRoutingRules(
    workflowId: number,
): Promise<WorkflowRoutingRule[]> {
    const response = await apiClient.get(
        `/api/admin/workflows/${workflowId}/routing-rules`,
    );

    return response.data.data;
}

export async function createWorkflowRoutingRule(
    workflowId: number,
    values: WorkflowRoutingRulePayload,
): Promise<WorkflowRoutingRule> {
    const response = await apiClient.post(
        `/api/admin/workflows/${workflowId}/routing-rules`,
        values,
    );

    return response.data.data;
}

export async function updateWorkflowRoutingRule(
    workflowId: number,
    ruleId: number,
    values: WorkflowRoutingRulePayload,
): Promise<WorkflowRoutingRule> {
    const response = await apiClient.put(
        `/api/admin/workflows/${workflowId}/routing-rules/${ruleId}`,
        values,
    );

    return response.data.data;
}

export async function deleteWorkflowRoutingRule(
    workflowId: number,
    ruleId: number,
): Promise<void> {
    await apiClient.delete(
        `/api/admin/workflows/${workflowId}/routing-rules/${ruleId}`,
    );
}