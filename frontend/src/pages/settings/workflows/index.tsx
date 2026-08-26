import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Button,
    Card,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    message,
} from 'antd';

import {
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';

import {
    createWorkflow,
    fetchWorkflows,
    updateWorkflow,
} from '../../../api/workflows';

import type {
    WorkflowDefinition,
    WorkflowDefinitionPayload,
    WorkflowState,
    WorkflowTransition,
} from '../../../api/workflows';

import {
    DeleteOutlined,
} from '@ant-design/icons';

import {
    fetchPermissions,
} from '../../../api/permissions';

import type {
    Permission,
} from '../../../types/permission';

import {
    createWorkflowRoutingRule,
    deleteWorkflowRoutingRule,
    fetchWorkflowRoutingRules,
    updateWorkflowRoutingRule,
} from '../../../api/workflowRoutingRules';

import type {
    WorkflowAssignmentMode,
    WorkflowAssignmentType,
    WorkflowRoutingRule,
    WorkflowRoutingRulePayload,
} from '../../../api/workflowRoutingRules';

import {
    fetchDepartmentOptions,
} from '../../../api/departments';

import type {
    DepartmentOption,
} from '../../../api/departments';

import {
    fetchRoles as fetchRoleOptions,
} from '../../../api/roles';

import {
    fetchUsers as fetchUserOptions,
} from '../../../api/users';

import type {
    Role,
} from '../../../types/role';

import type {
    SystemUser,
} from '../../../types/user';

const WorkflowSettingsPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] =
        useState<WorkflowDefinition[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editing, setEditing] =
        useState<WorkflowDefinition | null>(null);

    const [states, setStates] =
        useState<WorkflowState[]>([]);

    const [transitions, setTransitions] =
        useState<WorkflowTransition[]>([]);

    const [stateDrawerOpen, setStateDrawerOpen] =
    useState(false);

    const [editingStateIndex, setEditingStateIndex] =
    useState<number | null>(null);

    const [transitionDrawerOpen, setTransitionDrawerOpen] =
    useState(false);

    const [editingTransitionIndex, setEditingTransitionIndex] =
    useState<number | null>(null);

    const [permissions, setPermissions] =
    useState<Permission[]>([]);

    const [permissionsLoading, setPermissionsLoading] =
    useState(false);

    const [transitionForm] = Form.useForm();

    const [stateForm] = Form.useForm();

    const [routingRules, setRoutingRules] =
    useState<WorkflowRoutingRule[]>([]);

const [routingDrawerOpen, setRoutingDrawerOpen] =
    useState(false);

const [editingRoutingRule, setEditingRoutingRule] =
    useState<WorkflowRoutingRule | null>(null);

const [routingLoading, setRoutingLoading] =
    useState(false);

const [routingSaving, setRoutingSaving] =
    useState(false);

const [routingForm] = Form.useForm();

const [departmentOptions, setDepartmentOptions] =
    useState<DepartmentOption[]>([]);

const [roles, setRoles] =
    useState<Role[]>([]);

const [users, setUsers] =
    useState<SystemUser[]>([]);

const [routingOptionsLoading, setRoutingOptionsLoading] =
    useState(false);

 
const loadRoutingRules = async (
    workflowId: number
) => {
    try {
        setRoutingLoading(true);

        const result =
            await fetchWorkflowRoutingRules(
                workflowId
            );

        setRoutingRules(result);
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load workflow routing rules.'
        );
    } finally {
        setRoutingLoading(false);
    }
};

const loadRoutingOptions = async () => {
    try {
        setRoutingOptionsLoading(true);

        const [
            departmentsResult,
            rolesResult,
            usersResult,
        ] = await Promise.all([
            fetchDepartmentOptions(),
            fetchRoleOptions(
                1,
                '',
                100
            ),
            fetchUserOptions({
                page: 1,
                per_page: 100,
            }),
        ]);

        setDepartmentOptions(
            departmentsResult
        );

        setRoles(
            rolesResult.data
        );

        setUsers(
            usersResult.data
        );
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load routing options.'
        );
    } finally {
        setRoutingOptionsLoading(false);
    }
};

const openCreateState = () => {
    setEditingStateIndex(null);

    stateForm.resetFields();

    stateForm.setFieldsValue({
        sequence:
            states.length + 1,
        is_initial:
            states.length === 0,
        is_final: false,
        is_editable: false,
        is_active: true,
    });

    setStateDrawerOpen(true);
};

const openEditState = (
    index: number
) => {
    const state = states[index];

    setEditingStateIndex(index);

    stateForm.setFieldsValue({
        code: state.code,
        name: state.name,
        sequence: state.sequence,
        is_initial: state.is_initial,
        is_final: state.is_final,
        is_editable: state.is_editable,
        is_active: state.is_active,
        color: state.color,
        description: state.description,
    });

    setStateDrawerOpen(true);
};

const handleSaveState = async () => {
    try {
        const values =
            await stateForm.validateFields();

        const newState: WorkflowState = {
            code:
                values.code
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_'),

            name:
                values.name.trim(),

            sequence:
                Number(values.sequence),

            is_initial:
                values.is_initial,

            is_final:
                values.is_final,

            is_editable:
                values.is_editable,

            is_active:
                values.is_active,

            color:
                values.color || null,

            description:
                values.description || null,
        };

        const duplicateCode =
            states.some(
                (state, index) =>
                    state.code ===
                        newState.code &&
                    index !==
                        editingStateIndex
            );

        if (duplicateCode) {
            message.error(
                'Workflow state code already exists.'
            );

            return;
        }

        let updatedStates =
            [...states];

        if (newState.is_initial) {
            updatedStates =
                updatedStates.map(
                    (state) => ({
                        ...state,
                        is_initial: false,
                    })
                );
        }

        if (editingStateIndex === null) {
            updatedStates.push(
                newState
            );
        } else {
            updatedStates[
                editingStateIndex
            ] = newState;
        }

        updatedStates.sort(
            (a, b) =>
                a.sequence -
                b.sequence
        );

        setStates(updatedStates);

        setStateDrawerOpen(false);
    } catch (error: any) {
        if (error?.errorFields) {
            return;
        }

        message.error(
            'Failed to save workflow state.'
        );
    }
};

const openCreateTransition = () => {
    if (states.length < 2) {
        message.warning(
            'Add at least two workflow states before creating a transition.'
        );

        return;
    }

    setEditingTransitionIndex(null);

    transitionForm.resetFields();

    transitionForm.setFieldsValue({
        is_return: false,
        requires_remarks: false,
        is_active: true,
        sequence:
            transitions.length + 1,
    });

    setTransitionDrawerOpen(true);
};

const openEditTransition = (
    index: number
) => {
    const transition =
        transitions[index];

    setEditingTransitionIndex(index);

    transitionForm.setFieldsValue({
        from_state_code:
            transition.from_state_code,

        to_state_code:
            transition.to_state_code,

        action:
            transition.action,

        name:
            transition.name,

        permission_name:
            transition.permission_name,

        is_return:
            transition.is_return,

        requires_remarks:
            transition.requires_remarks,

        is_active:
            transition.is_active,

        sequence:
            transition.sequence,

        description:
            transition.description,
    });

    setTransitionDrawerOpen(true);
};

const handleSaveTransition = async () => {
    try {
        const values =
            await transitionForm.validateFields();

        if (
            values.from_state_code ===
            values.to_state_code
        ) {
            message.error(
                'Source and target states cannot be the same.'
            );

            return;
        }

        const newTransition:
            WorkflowTransition = {
            from_state_code:
                values.from_state_code,

            to_state_code:
                values.to_state_code,

            action:
                values.action
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_'),

            name:
                values.name.trim(),

            permission_name:
                values.permission_name ||
                null,

            is_return:
                values.is_return,

            requires_remarks:
                values.requires_remarks,

            is_active:
                values.is_active,

            sequence:
                Number(
                    values.sequence
                ),

            description:
                values.description ||
                null,
        };

        const duplicate =
            transitions.some(
                (
                    transition,
                    index
                ) =>
                    transition.from_state_code ===
                        newTransition.from_state_code &&
                    transition.action ===
                        newTransition.action &&
                    index !==
                        editingTransitionIndex
            );

        if (duplicate) {
            message.error(
                'This action already exists for the selected source state.'
            );

            return;
        }

        let updatedTransitions =
            [...transitions];

        if (
            editingTransitionIndex ===
            null
        ) {
            updatedTransitions.push(
                newTransition
            );
        } else {
            updatedTransitions[
                editingTransitionIndex
            ] = newTransition;
        }

        updatedTransitions.sort(
            (a, b) =>
                a.sequence -
                b.sequence
        );

        setTransitions(
            updatedTransitions
        );

        setTransitionDrawerOpen(
            false
        );
    } catch (error: any) {
        if (error?.errorFields) {
            return;
        }

        message.error(
            'Failed to save workflow transition.'
        );
    }
};

const removeTransition = (
    index: number
) => {
    setTransitions((current) =>
        current.filter(
            (_, itemIndex) =>
                itemIndex !== index
        )
    );
};

const removeState = (
    index: number
) => {
    const state =
        states[index];

    const usedByTransition =
        transitions.some(
            (transition) =>
                transition.from_state_code ===
                    state.code ||
                transition.to_state_code ===
                    state.code
        );

    if (usedByTransition) {
        message.error(
            'This state is used by a workflow transition. Remove or update the transition first.'
        );

        return;
    }

    setStates((current) =>
        current.filter(
            (_, itemIndex) =>
                itemIndex !== index
        )
    );
};

    const loadData = async () => {
        try {
            setLoading(true);

            const result =
                await fetchWorkflows();

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load workflows.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    loadData();
    loadPermissions();
}, []);

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            version: 1,
            is_active: true,
        });

        setStates([]);
        setTransitions([]);

        setDrawerOpen(true);
        setRoutingRules([]);
    };

    const openEdit = (
        record: WorkflowDefinition
    ) => {
        setEditing(record);

        form.setFieldsValue({
            code: record.code,
            name: record.name,
            module_key: record.module_key,
            description:
                record.description,
            version:
                record.version,
            is_active:
                record.is_active,
        });

        setStates(
            record.states.map(
                (state) => ({
                    ...state,
                })
            )
        );

        setTransitions(
            record.transitions.map(
                (transition) => ({
                    ...transition,

                    from_state_code:
                        transition.from_state?.code,

                    to_state_code:
                        transition.to_state?.code,
                })
            )
        );

        void loadRoutingRules(
    record.id
);

void loadRoutingOptions();

        setDrawerOpen(true);
    };

const openCreateRoutingRule = () => {
    if (!editing) {
        message.warning(
            'Save the workflow before adding routing rules.'
        );

        return;
    }

    if (states.length === 0) {
        message.warning(
            'The workflow must have at least one saved state.'
        );

        return;
    }

    setEditingRoutingRule(null);

    routingForm.resetFields();

    routingForm.setFieldsValue({
        assignment_type:
            'department',

        assignment_mode:
            'all',

        is_active:
            true,

        priority:
            100,

        workflow_transition_id:
            null,
    });

    setRoutingDrawerOpen(true);
};

const openEditRoutingRule = (
    rule: WorkflowRoutingRule
) => {
    setEditingRoutingRule(rule);

    routingForm.setFieldsValue({
        workflow_state_id:
            rule.workflow_state_id,

        workflow_transition_id:
            rule.workflow_transition_id ??
            null,

        assignment_type:
            rule.assignment_type,

        assigned_to_id:
            rule.assigned_to_id ??
            null,

        assigned_to_key:
            rule.assigned_to_key ??
            null,

        assignment_mode:
            rule.assignment_mode,

        sla_minutes:
            rule.sla_minutes ??
            null,

        priority:
            rule.priority,

        is_active:
            rule.is_active,

        remarks:
            rule.remarks ??
            null,
    });

    setRoutingDrawerOpen(true);
};

const handleSaveRoutingRule = async () => {
    if (!editing) {
        return;
    }

    try {
        const values =
            await routingForm.validateFields();

        setRoutingSaving(true);

        const assignmentType:
            WorkflowAssignmentType =
            values.assignment_type;

        const assignmentMode:
            WorkflowAssignmentMode =
            values.assignment_mode;

        const payload:
            WorkflowRoutingRulePayload = {
            workflow_state_id:
                values.workflow_state_id,

            workflow_transition_id:
                values.workflow_transition_id ||
                null,

            assignment_type:
                assignmentType,

            assigned_to_id:
                [
                    'department',
                    'role',
                    'user',
                ].includes(
                    assignmentType
                )
                    ? values.assigned_to_id
                    : null,

            assigned_to_key:
                assignmentType ===
                'permission'
                    ? values.assigned_to_key
                    : null,

            assignment_mode:
                assignmentMode,

            sla_minutes:
                values.sla_minutes ||
                null,

            priority:
                values.priority,

            is_active:
                values.is_active,

            remarks:
                values.remarks ||
                null,
        };

        if (!editingRoutingRule) {
            await createWorkflowRoutingRule(
                editing.id,
                payload
            );

            message.success(
                'Workflow routing rule created successfully.'
            );
        } else {
            await updateWorkflowRoutingRule(
                editing.id,
                editingRoutingRule.id,
                payload
            );

            message.success(
                'Workflow routing rule updated successfully.'
            );
        }

        setRoutingDrawerOpen(false);

        await loadRoutingRules(
            editing.id
        );
    } catch (error: any) {
        if (error?.errorFields) {
            return;
        }

        message.error(
            error?.response?.data?.message ||
                'Failed to save workflow routing rule.'
        );
    } finally {
        setRoutingSaving(false);
    }
};

const handleDeleteRoutingRule = async (
    rule: WorkflowRoutingRule
) => {
    if (!editing) {
        return;
    }

    try {
        await deleteWorkflowRoutingRule(
            editing.id,
            rule.id
        );

        message.success(
            'Workflow routing rule deleted successfully.'
        );

        await loadRoutingRules(
            editing.id
        );
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to delete workflow routing rule.'
        );
    }
};

    const handleSave = async () => {
        try {
            const values =
                await form.validateFields();

            if (states.length === 0) {
                message.warning(
                    'Add at least one workflow state.'
                );

                return;
            }

            const initialStates =
                states.filter(
                    (state) =>
                        state.is_initial
                );

            if (
                initialStates.length !== 1
            ) {
                message.warning(
                    'The workflow must have exactly one initial state.'
                );

                return;
            }

            setSaving(true);

            const payload:
                WorkflowDefinitionPayload = {
                code:
                    values.code,
                name:
                    values.name,
                module_key:
                    values.module_key,
                description:
                    values.description ||
                    null,

                version:
                    values.version,

                is_active:
                    values.is_active,

                states:
                    states.map(
                        (state) => ({
                            code:
                                state.code,
                            name:
                                state.name,
                            sequence:
                                state.sequence,
                            is_initial:
                                state.is_initial,
                            is_final:
                                state.is_final,
                            is_editable:
                                state.is_editable,
                            is_active:
                                state.is_active,
                            color:
                                state.color ||
                                null,
                            description:
                                state.description ||
                                null,
                        })
                    ),

                transitions:
                    transitions.map(
                        (transition) => ({
                            from_state_code:
                                transition.from_state_code ||
                                '',

                            to_state_code:
                                transition.to_state_code ||
                                '',

                            action:
                                transition.action,

                            name:
                                transition.name,

                            permission_name:
                                transition.permission_name ||
                                null,

                            is_return:
                                transition.is_return,

                            requires_remarks:
                                transition.requires_remarks,

                            is_active:
                                transition.is_active,

                            sequence:
                                transition.sequence,

                            description:
                                transition.description ||
                                null,
                        })
                    ),
            };

            if (!editing) {
                await createWorkflow(
                    payload
                );

                message.success(
                    'Workflow created successfully.'
                );
            } else {
                await updateWorkflow(
                    editing.id,
                    payload
                );

                message.success(
                    'Workflow updated successfully.'
                );
            }

            setDrawerOpen(false);

            await loadData();
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            message.error(
                error?.response?.data?.message ||
                    'Failed to save workflow.'
            );
        } finally {
            setSaving(false);
        }
    };

    const loadPermissions = async () => {
    try {
        setPermissionsLoading(true);

        const response =
        await fetchPermissions(
            1,
            '',
            100
        );

        setPermissions(
            response.data
        );
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load permissions.'
        );
    } finally {
        setPermissionsLoading(false);
    }
};

    const stateCountByWorkflow =
        useMemo(() => {
            return data.reduce<
                Record<number, number>
            >(
                (result, workflow) => {
                    result[workflow.id] =
                        workflow.states.length;

                    return result;
                },
                {}
            );
        }, [data]);

    const transitionCountByWorkflow =
        useMemo(() => {
            return data.reduce<
                Record<number, number>
            >(
                (result, workflow) => {
                    result[workflow.id] =
                        workflow.transitions.length;

                    return result;
                },
                {}
            );
        }, [data]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Module',
            dataIndex: 'module_key',
            key: 'module_key',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: 'States',
            key: 'states',
            render: (
                _: unknown,
                record: WorkflowDefinition
            ) =>
                stateCountByWorkflow[
                    record.id
                ] ?? 0,
        },
        {
            title: 'Transitions',
            key: 'transitions',
            render: (
                _: unknown,
                record: WorkflowDefinition
            ) =>
                transitionCountByWorkflow[
                    record.id
                ] ?? 0,
        },
        {
            title: 'Status',
            key: 'is_active',
            render: (
                _: unknown,
                record: WorkflowDefinition
            ) =>
                record.is_active ? (
                    <Tag color="green">
                        Active
                    </Tag>
                ) : (
                    <Tag color="red">
                        Inactive
                    </Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (
                _: unknown,
                record: WorkflowDefinition
            ) => (
                <Button
                    size="small"
                    icon={
                        <EditOutlined />
                    }
                    onClick={() =>
                        openEdit(record)
                    }
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Workflow Settings"
                extra={
                    <Button
                        type="primary"
                        icon={
                            <PlusOutlined />
                        }
                        onClick={
                            openCreate
                        }
                    >
                        New Workflow
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{
                        x: 1000,
                    }}
                />
            </Card>

            <Drawer
                title={
                    editing
                        ? 'Edit Workflow'
                        : 'Create Workflow'
                }
                open={drawerOpen}
                onClose={() =>
                    setDrawerOpen(false)
                }
                width={860}
                destroyOnHidden
                extra={
                    <Space>
                        <Button
                            onClick={() =>
                                setDrawerOpen(
                                    false
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            loading={saving}
                            onClick={
                                handleSave
                            }
                        >
                            {editing
                                ? 'Update'
                                : 'Save'}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Workflow Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Workflow name is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Store Requisition" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Workflow Code"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Workflow code is required.',
                            },
                        ]}
                    >
                        <Input placeholder="STORE_REQUISITION" />
                    </Form.Item>

                    <Form.Item
                        name="module_key"
                        label="Module"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Module is required.',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            options={[
                                {
                                    label:
                                        'Store',
                                    value:
                                        'store',
                                },
                                {
                                    label:
                                        'Procurement',
                                    value:
                                        'procurement',
                                },
                                {
                                    label:
                                        'Finance',
                                    value:
                                        'finance',
                                },
                                {
                                    label:
                                        'Human Resources',
                                    value:
                                        'hr',
                                },
                                {
                                    label:
                                        'Other',
                                    value:
                                        'other',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="version"
                        label="Version"
                        rules={[
                            {
                                required:
                                    true,
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            style={{
                                width:
                                    '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_active"
                        label="Active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>

                <Card
    size="small"
    title="Workflow States"
    style={{
        marginTop: 20,
    }}
    extra={
        <Button
            type="primary"
            size="small"
            icon={
                <PlusOutlined />
            }
            onClick={
                openCreateState
            }
        >
            Add State
        </Button>
    }
>
                    {states.length === 0 ? (
                        <div>
                            No workflow states
                            configured yet.
                        </div>
                    ) : (
                        <Table
                            rowKey={(
                                record
                            ) =>
                                record.code
                            }
                            pagination={
                                false
                            }
                            dataSource={
                                states
                            }
                            columns={[
    {
        title: 'No.',
        dataIndex: 'sequence',
        width: 70,
    },
    {
        title: 'State',
        dataIndex: 'name',
    },
    {
        title: 'Code',
        dataIndex: 'code',
    },
    {
        title: 'Initial',
        render: (
            _,
            record: WorkflowState
        ) =>
            record.is_initial ? (
                <Tag color="green">
                    Initial
                </Tag>
            ) : (
                '-'
            ),
    },
    {
        title: 'Final',
        render: (
            _,
            record: WorkflowState
        ) =>
            record.is_final ? (
                <Tag color="blue">
                    Final
                </Tag>
            ) : (
                '-'
            ),
    },
    {
        title: 'Editable',
        render: (
            _,
            record: WorkflowState
        ) =>
            record.is_editable
                ? 'Yes'
                : 'No',
    },
    {
        title: 'Actions',
        render: (
            _,
            _record: WorkflowState,
            index: number
        ) => (
            <Space>
                <Button
                    size="small"
                    icon={
                        <EditOutlined />
                    }
                    onClick={() =>
                        openEditState(
                            index
                        )
                    }
                >
                    Edit
                </Button>

                <Button
                    size="small"
                    danger
                    icon={
                        <DeleteOutlined />
                    }
                    onClick={() =>
                        removeState(
                            index
                        )
                    }
                >
                    Remove
                </Button>
            </Space>
        ),
    },
]}
                        />
                    )}
                </Card>

                <Card
    size="small"
    title="Workflow Transitions"
    style={{
        marginTop: 20,
    }}
    extra={
        <Button
            type="primary"
            size="small"
            icon={
                <PlusOutlined />
            }
            onClick={
                openCreateTransition
            }
        >
            Add Transition
        </Button>
    }
>
                    {transitions.length ===
                    0 ? (
                        <div>
                            No workflow
                            transitions
                            configured yet.
                        </div>
                    ) : (
                        <Table
                            rowKey={(
                                record,
                                index
                            ) =>
                                record.id ??
                                `${record.from_state_code}-${record.action}-${index}`
                            }
                            pagination={
                                false
                            }
                            dataSource={
                                transitions
                            }
                            columns={[
    {
        title: 'No.',
        dataIndex: 'sequence',
        width: 70,
    },
    {
        title: 'From',
        dataIndex:
            'from_state_code',
    },
    {
        title: 'Action',
        dataIndex: 'name',
    },
    {
        title: 'To',
        dataIndex:
            'to_state_code',
    },
    {
        title: 'Permission',
        key: 'permission',
        render: (
            _,
            record: WorkflowTransition
        ) =>
            record.permission_name ||
            '-',
    },
    {
        title: 'Return',
        render: (
            _,
            record: WorkflowTransition
        ) =>
            record.is_return ? (
                <Tag color="orange">
                    Return
                </Tag>
            ) : (
                '-'
            ),
    },
    {
        title: 'Remarks',
        render: (
            _,
            record: WorkflowTransition
        ) =>
            record.requires_remarks
                ? 'Required'
                : 'Optional',
    },
    {
        title: 'Actions',
        render: (
            _,
            _record:
                WorkflowTransition,
            index: number
        ) => (
            <Space>
                <Button
                    size="small"
                    icon={
                        <EditOutlined />
                    }
                    onClick={() =>
                        openEditTransition(
                            index
                        )
                    }
                >
                    Edit
                </Button>

                <Button
                    size="small"
                    danger
                    icon={
                        <DeleteOutlined />
                    }
                    onClick={() =>
                        removeTransition(
                            index
                        )
                    }
                >
                    Remove
                </Button>
            </Space>
        ),
    },
]}
                        />
                    )}
                </Card>
            </Drawer>

            <Drawer
    title={
        editingStateIndex === null
            ? 'Add Workflow State'
            : 'Edit Workflow State'
    }
    open={stateDrawerOpen}
    onClose={() =>
        setStateDrawerOpen(false)
    }
    width={500}
    destroyOnHidden
    extra={
        <Space>
            <Button
                onClick={() =>
                    setStateDrawerOpen(
                        false
                    )
                }
            >
                Cancel
            </Button>

            <Button
                type="primary"
                onClick={
                    handleSaveState
                }
            >
                Save State
            </Button>
        </Space>
    }
>
    <Form
        form={stateForm}
        layout="vertical"
    >
        <Form.Item
            name="name"
            label="State Name"
            rules={[
                {
                    required: true,
                    message:
                        'State name is required.',
                },
            ]}
        >
            <Input placeholder="Submitted" />
        </Form.Item>

        <Form.Item
            name="code"
            label="State Code"
            rules={[
                {
                    required: true,
                    message:
                        'State code is required.',
                },
            ]}
        >
            <Input placeholder="submitted" />
        </Form.Item>

        <Form.Item
            name="sequence"
            label="Sequence"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <InputNumber
                min={1}
                style={{
                    width: '100%',
                }}
            />
        </Form.Item>

        <Form.Item
            name="is_initial"
            label="Initial State"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="is_final"
            label="Final State"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="is_editable"
            label="Record Editable in this State"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="color"
            label="Status Color"
            extra="Optional Ant Design color name, e.g. blue, green, orange, red."
        >
            <Input placeholder="blue" />
        </Form.Item>

        <Form.Item
            name="description"
            label="Description"
        >
            <Input.TextArea
                rows={3}
            />
        </Form.Item>
    </Form>
</Drawer>

<Drawer
    title={
        editingTransitionIndex ===
        null
            ? 'Add Workflow Transition'
            : 'Edit Workflow Transition'
    }
    open={
        transitionDrawerOpen
    }
    onClose={() =>
        setTransitionDrawerOpen(
            false
        )
    }
    width={540}
    destroyOnHidden
    extra={
        <Space>
            <Button
                onClick={() =>
                    setTransitionDrawerOpen(
                        false
                    )
                }
            >
                Cancel
            </Button>

            <Button
                type="primary"
                onClick={
                    handleSaveTransition
                }
            >
                Save Transition
            </Button>
        </Space>
    }
>
    <Form
        form={transitionForm}
        layout="vertical"
    >
        <Form.Item
            name="from_state_code"
            label="From State"
            rules={[
                {
                    required: true,
                    message:
                        'Source state is required.',
                },
            ]}
        >
            <Select
                showSearch
                optionFilterProp="label"
                options={states.map(
                    (state) => ({
                        label:
                            state.name,
                        value:
                            state.code,
                    })
                )}
            />
        </Form.Item>

        <Form.Item
            name="action"
            label="Action Code"
            rules={[
                {
                    required: true,
                    message:
                        'Action code is required.',
                },
            ]}
        >
            <Input placeholder="approve" />
        </Form.Item>

        <Form.Item
            name="name"
            label="Action Label"
            rules={[
                {
                    required: true,
                    message:
                        'Action label is required.',
                },
            ]}
        >
            <Input placeholder="Approve" />
        </Form.Item>

        <Form.Item
            name="to_state_code"
            label="To State"
            rules={[
                {
                    required: true,
                    message:
                        'Target state is required.',
                },
            ]}
        >
            <Select
                showSearch
                optionFilterProp="label"
                options={states.map(
                    (state) => ({
                        label:
                            state.name,
                        value:
                            state.code,
                    })
                )}
            />
        </Form.Item>

        <Form.Item
    name="permission_name"
    label="Required Permission"
    extra="Optional. Users must have this permission to execute the transition."
>
    <Select
        showSearch
        allowClear
        loading={
            permissionsLoading
        }
        placeholder="Select Permission"
        optionFilterProp="label"
        options={permissions.map(
            (permission) => ({
                label:
                    permission.name,
                value:
                    permission.name,
            })
        )}
    />
</Form.Item>

        <Form.Item
            name="is_return"
            label="Return / Send Back"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="requires_remarks"
            label="Remarks Required"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="sequence"
            label="Sequence"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <InputNumber
                min={1}
                style={{
                    width:
                        '100%',
                }}
            />
        </Form.Item>

        <Form.Item
            name="description"
            label="Description"
        >
            <Input.TextArea
                rows={3}
            />
        </Form.Item>
    </Form>

    <Card
    size="small"
    title="Workflow Routing"
    style={{
        marginTop: 20,
    }}
    extra={
        <Button
            type="primary"
            size="small"
            icon={
                <PlusOutlined />
            }
            disabled={!editing}
            onClick={
                openCreateRoutingRule
            }
        >
            Add Routing Rule
        </Button>
    }
>
    {!editing ? (
        <div>
            Save the workflow first,
            then reopen it to configure
            routing rules.
        </div>
    ) : (
        <Table
            rowKey="id"
            pagination={false}
            loading={
                routingLoading
            }
            dataSource={
                routingRules
            }
            columns={[
                {
                    title:
                        'Stage',
                    key:
                        'state',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) =>
                        record
                            .workflow_state
                            ?.name ||
                        record
                            .workflow_state_id,
                },
                {
                    title:
                        'Trigger',
                    key:
                        'transition',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) =>
                        record
                            .workflow_transition
                            ?.name ||
                        'Any',
                },
                {
                    title:
                        'Assigned By',
                    dataIndex:
                        'assignment_type',
                },
                {
                    title:
                        'Target',
                    key:
                        'target',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) => {
                        if (
                            record.assignment_type ===
                            'permission'
                        ) {
                            return (
                                record.assigned_to_key ||
                                '-'
                            );
                        }

                        return (
                            record.assigned_to_id ||
                            '-'
                        );
                    },
                },
                {
                    title:
                        'Mode',
                    dataIndex:
                        'assignment_mode',
                },
                {
                    title:
                        'SLA',
                    key:
                        'sla',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) =>
                        record.sla_minutes
                            ? `${record.sla_minutes} min`
                            : '-',
                },
                {
                    title:
                        'Status',
                    key:
                        'status',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) =>
                        record.is_active ? (
                            <Tag color="green">
                                Active
                            </Tag>
                        ) : (
                            <Tag color="red">
                                Inactive
                            </Tag>
                        ),
                },
                {
                    title:
                        'Actions',
                    render: (
                        _,
                        record:
                            WorkflowRoutingRule
                    ) => (
                        <Space>
                            <Button
                                size="small"
                                icon={
                                    <EditOutlined />
                                }
                                onClick={() =>
                                    openEditRoutingRule(
                                        record
                                    )
                                }
                            >
                                Edit
                            </Button>

                            <Button
                                size="small"
                                danger
                                icon={
                                    <DeleteOutlined />
                                }
                                onClick={() =>
                                    void handleDeleteRoutingRule(
                                        record
                                    )
                                }
                            >
                                Remove
                            </Button>
                        </Space>
                    ),
                },
            ]}
        />
    )}
</Card>
</Drawer>

<Drawer
    title={
        editingRoutingRule
            ? 'Edit Routing Rule'
            : 'Add Routing Rule'
    }
    open={
        routingDrawerOpen
    }
    onClose={() =>
        setRoutingDrawerOpen(
            false
        )
    }
    width={560}
    destroyOnHidden
    extra={
        <Space>
            <Button
                onClick={() =>
                    setRoutingDrawerOpen(
                        false
                    )
                }
            >
                Cancel
            </Button>

            <Button
                type="primary"
                loading={
                    routingSaving
                }
                onClick={
                    handleSaveRoutingRule
                }
            >
                Save Routing Rule
            </Button>
        </Space>
    }
>
    <Form
        form={routingForm}
        layout="vertical"
    >
        <Form.Item
            name="workflow_state_id"
            label="Responsible Stage"
            rules={[
                {
                    required: true,
                    message:
                        'Select the workflow stage.',
                },
            ]}
        >
            <Select
                showSearch
                optionFilterProp="label"
                options={states
                    .filter(
                        (state) =>
                            state.id
                    )
                    .map(
                        (state) => ({
                            label:
                                state.name,
                            value:
                                state.id!,
                        })
                    )}
            />
        </Form.Item>

        <Form.Item
            name="workflow_transition_id"
            label="Specific Transition"
            extra="Optional. Leave empty when this rule applies whenever the workflow enters the selected stage."
        >
            <Select
                showSearch
                allowClear
                optionFilterProp="label"
                options={transitions
                    .filter(
                        (transition) =>
                            transition.id
                    )
                    .map(
                        (
                            transition
                        ) => ({
                            label:
                                transition.name,
                            value:
                                transition.id!,
                        })
                    )}
            />
        </Form.Item>

        <Form.Item
            name="assignment_type"
            label="Assign By"
            rules={[
                {
                    required:
                        true,
                },
            ]}
        >
            <Select
                options={[
                    {
                        label:
                            'Department',
                        value:
                            'department',
                    },
                    {
                        label:
                            'Role',
                        value:
                            'role',
                    },
                    {
                        label:
                            'Permission / Task',
                        value:
                            'permission',
                    },
                    {
                        label:
                            'Specific User',
                        value:
                            'user',
                    },
                ]}
                onChange={() => {
                    routingForm.setFieldsValue({
                        assigned_to_id:
                            null,
                        assigned_to_key:
                            null,
                    });
                }}
            />
        </Form.Item>

        <Form.Item
            noStyle
            shouldUpdate={(
                previous,
                current
            ) =>
                previous.assignment_type !==
                current.assignment_type
            }
        >
            {({
                getFieldValue,
            }) => {
                const type =
                    getFieldValue(
                        'assignment_type'
                    );

                if (
                    type ===
                    'department'
                ) {
                    return (
                        <Form.Item
                            name="assigned_to_id"
                            label="Department"
                            rules={[
                                {
                                    required:
                                        true,
                                    message:
                                        'Select a department.',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                loading={
                                    routingOptionsLoading
                                }
                                optionFilterProp="label"
                                options={departmentOptions.map(
                                    (
                                        department
                                    ) => ({
                                        label:
                                            department.department_name,
                                        value:
                                            department.id,
                                    })
                                )}
                            />
                        </Form.Item>
                    );
                }

                if (
                    type ===
                    'role'
                ) {
                    return (
                        <Form.Item
                            name="assigned_to_id"
                            label="Role"
                            rules={[
                                {
                                    required:
                                        true,
                                    message:
                                        'Select a role.',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                loading={
                                    routingOptionsLoading
                                }
                                optionFilterProp="label"
                                options={roles.map(
                                    (
                                        role
                                    ) => ({
                                        label:
                                            role.name,
                                        value:
                                            role.id,
                                    })
                                )}
                            />
                        </Form.Item>
                    );
                }

                if (
                    type ===
                    'user'
                ) {
                    return (
                        <Form.Item
                            name="assigned_to_id"
                            label="User"
                            rules={[
                                {
                                    required:
                                        true,
                                    message:
                                        'Select a user.',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                loading={
                                    routingOptionsLoading
                                }
                                optionFilterProp="label"
                                options={users.map(
                                    (
                                        user
                                    ) => ({
                                        label:
                                            user.name,
                                        value:
                                            user.id,
                                    })
                                )}
                            />
                        </Form.Item>
                    );
                }

                if (
                    type ===
                    'permission'
                ) {
                    return (
                        <Form.Item
                            name="assigned_to_key"
                            label="Permission / Task"
                            rules={[
                                {
                                    required:
                                        true,
                                    message:
                                        'Select a permission.',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                loading={
                                    permissionsLoading
                                }
                                optionFilterProp="label"
                                options={permissions.map(
                                    (
                                        permission
                                    ) => ({
                                        label:
                                            permission.name,
                                        value:
                                            permission.name,
                                    })
                                )}
                            />
                        </Form.Item>
                    );
                }

                return null;
            }}
        </Form.Item>

        <Form.Item
            name="assignment_mode"
            label="Assignment Mode"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Select
                options={[
                    {
                        label:
                            'All Eligible Users',
                        value:
                            'all',
                    },
                    {
                        label:
                            'First Available',
                        value:
                            'first_available',
                    },
                    {
                        label:
                            'Manual Assignment',
                        value:
                            'manual',
                    },
                ]}
            />
        </Form.Item>

        <Form.Item
            name="sla_minutes"
            label="SLA (Minutes)"
            extra="Optional. Used for overdue tracking and stage aging."
        >
            <InputNumber
                min={1}
                style={{
                    width:
                        '100%',
                }}
                placeholder="Example: 480"
            />
        </Form.Item>

        <Form.Item
            name="priority"
            label="Priority"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <InputNumber
                min={1}
                style={{
                    width:
                        '100%',
                }}
            />
        </Form.Item>

        <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="remarks"
            label="Remarks"
        >
            <Input.TextArea
                rows={3}
            />
        </Form.Item>
    </Form>
</Drawer>
        </div>
    );
};

export default WorkflowSettingsPage;