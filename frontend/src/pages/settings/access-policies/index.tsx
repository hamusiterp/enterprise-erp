import React, {
    useEffect,
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
    TimePicker,
    message,
} from 'antd';

import {
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';

import {
    createAccessPolicy,
    getAccessPolicies,
    updateAccessPolicy,
} from '../../../api/accessPolicies';

import type {
    AccessPolicy,
    AccessPolicyAssignment,
    AccessPolicyPayload,
    AccessPolicySchedule,
} from '../../../api/accessPolicies';

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

import {
    fetchPermissions,
} from '../../../api/permissions';

import type {
    Permission,
} from '../../../types/permission';

const days = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
];

const buildDefaultSchedules =
    (): AccessPolicySchedule[] =>
        days.map((day) => ({
            day_of_week: day.value,
            start_time: '08:00',
            end_time: '17:30',
            is_allowed_day:
                day.value <= 5,
            is_active: true,
        }));

const AccessPoliciesPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] =
        useState<AccessPolicy[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editing, setEditing] =
        useState<AccessPolicy | null>(null);

    const [schedules, setSchedules] =
        useState<AccessPolicySchedule[]>(
            buildDefaultSchedules()
        );

    const [assignments, setAssignments] =
        useState<AccessPolicyAssignment[]>([]);

    const [roles, setRoles] =
    useState<Role[]>([]);

const [users, setUsers] =
    useState<SystemUser[]>([]);

const [rolesLoading, setRolesLoading] =
    useState(false);

const [usersLoading, setUsersLoading] =
    useState(false);

const [permissions, setPermissions] =
    useState<Permission[]>([]);

const [permissionsLoading, setPermissionsLoading] =
    useState(false);

const loadPermissions = async () => {
    try {
        setPermissionsLoading(true);

        const response =
            await fetchPermissions(
                1,
                '',
                100
            );

        setPermissions(response.data);
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load permissions.'
        );
    } finally {
        setPermissionsLoading(false);
    }
};

const loadRoles = async () => {
    try {
        setRolesLoading(true);

        const response =
            await fetchRoleOptions(
                1,
                '',
                100
            );

        setRoles(response.data);
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load roles.'
        );
    } finally {
        setRolesLoading(false);
    }
};

const loadUsers = async () => {
    try {
        setUsersLoading(true);

        const response =
            await fetchUserOptions({
                page: 1,
                per_page: 100,
            });

        setUsers(response.data);
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to load users.'
        );
    } finally {
        setUsersLoading(false);
    }
};

    const loadData = async () => {
        try {
            setLoading(true);

            const result =
                await getAccessPolicies();

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load access policies.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    loadData();
    loadRoles();
    loadUsers();
    loadPermissions();
}, []);

const modules = Array.from(
    new Set(
        permissions
            .map((permission) => {
                const name =
                    permission.name || '';

                return name.includes('.')
                    ? name.split('.')[0]
                    : name;
            })
            .filter(Boolean)
    )
).sort();

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            policy_type: 'allow',
            priority: 100,
            is_active: true,
        });

        setSchedules(
            buildDefaultSchedules()
        );

        setAssignments([]);

        setDrawerOpen(true);
    };

    const openEdit = (
        record: AccessPolicy
    ) => {
        setEditing(record);

        form.setFieldsValue({
            name: record.name,
            code: record.code,
            description:
                record.description,
            policy_type:
                record.policy_type,
            priority:
                record.priority,
            is_active:
                record.is_active,
        });

        setSchedules(
            record.schedules.map(
                (item) => ({
                    ...item,
                })
            )
        );

        setAssignments(
            record.assignments.map(
                (item) => ({
                    ...item,
                })
            )
        );

        setDrawerOpen(true);
    };

    const updateSchedule = (
        day: number,
        changes: Partial<AccessPolicySchedule>
    ) => {
        setSchedules((current) =>
            current.map((item) =>
                item.day_of_week === day
                    ? {
                          ...item,
                          ...changes,
                      }
                    : item
            )
        );
    };

    const addAssignment = () => {
        setAssignments((current) => [
            ...current,
            {
                target_type: 'system',
                target_key: 'system',
                target_id: null,
                is_active: true,
                effective_from: null,
                effective_to: null,
                remarks: null,
            },
        ]);
    };

    const updateAssignment = (
        index: number,
        changes: Partial<AccessPolicyAssignment>
    ) => {
        setAssignments((current) =>
            current.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              ...changes,
                          }
                        : item
            )
        );
    };

    const removeAssignment = (
        index: number
    ) => {
        setAssignments((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const handleSave = async () => {
        try {
            const values =
                await form.validateFields();

            setSaving(true);

            const payload:
                AccessPolicyPayload = {
                name: values.name,
                code: values.code,
                description:
                    values.description ||
                    null,

                policy_type:
                    values.policy_type,

                priority:
                    values.priority,

                is_active:
                    values.is_active,

                schedules:
                    schedules.map(
                        (item) => ({
                            day_of_week:
                                item.day_of_week,

                            start_time:
                                item.is_allowed_day
                                    ? item.start_time
                                    : null,

                            end_time:
                                item.is_allowed_day
                                    ? item.end_time
                                    : null,

                            is_allowed_day:
                                item.is_allowed_day,

                            is_active:
                                item.is_active,
                        })
                    ),

                assignments:
                    assignments.map(
                        (item) => ({
                            target_type:
                                item.target_type,

                            target_key:
                                item.target_key ||
                                null,

                            target_id:
                                item.target_id ||
                                null,

                            is_active:
                                item.is_active,

                            effective_from:
                                item.effective_from ||
                                null,

                            effective_to:
                                item.effective_to ||
                                null,

                            remarks:
                                item.remarks ||
                                null,
                        })
                    ),
            };

            if (!editing) {
                await createAccessPolicy(
                    payload
                );

                message.success(
                    'Access policy created successfully.'
                );
            } else {
                await updateAccessPolicy(
                    editing.id,
                    payload
                );

                message.success(
                    'Access policy updated successfully.'
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
                    'Failed to save access policy.'
            );
        } finally {
            setSaving(false);
        }
    };

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
            title: 'Type',
            key: 'policy_type',
            render: (
                _: unknown,
                record: AccessPolicy
            ) =>
                record.policy_type ===
                'allow' ? (
                    <Tag color="green">
                        Allow
                    </Tag>
                ) : (
                    <Tag color="red">
                        Deny
                    </Tag>
                ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Assignments',
            key: 'assignments',
            render: (
                _: unknown,
                record: AccessPolicy
            ) =>
                record.assignments.length,
        },
        {
            title: 'Status',
            key: 'is_active',
            render: (
                _: unknown,
                record: AccessPolicy
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
                record: AccessPolicy
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

    const getPermissionsForAssignment = (
    assignment: AccessPolicyAssignment
) => {
    if (
        !assignment.target_key ||
        assignment.target_type !== 'permission'
    ) {
        return permissions;
    }

    return permissions;
};

    return (
        <div>
            <Card
                title="Access Time Policies"
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
                        New Access Policy
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                />
            </Card>

            <Drawer
                title={
                    editing
                        ? 'Edit Access Policy'
                        : 'Create Access Policy'
                }
                open={drawerOpen}
                onClose={() =>
                    setDrawerOpen(false)
                }
                width={760}
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
                        label="Policy Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Policy name is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Normal Working Hours" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Code"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Policy code is required.',
                            },
                        ]}
                    >
                        <Input placeholder="NORMAL_WORKING_HOURS" />
                    </Form.Item>

                    <Form.Item
                        name="policy_type"
                        label="Policy Type"
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
                                        'Allow During Schedule',
                                    value:
                                        'allow',
                                },
                                {
                                    label:
                                        'Deny During Schedule',
                                    value:
                                        'deny',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label="Priority"
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
                    title="Weekly Schedule"
                    style={{
                        marginTop: 20,
                    }}
                >
                    <Table
                        rowKey="day_of_week"
                        pagination={false}
                        dataSource={
                            schedules
                        }
                        columns={[
                            {
                                title:
                                    'Day',
                                key: 'day',
                                render: (
                                    _,
                                    record: AccessPolicySchedule
                                ) =>
                                    days.find(
                                        (
                                            item
                                        ) =>
                                            item.value ===
                                            record.day_of_week
                                    )
                                        ?.label,
                            },
                            {
                                title:
                                    'Allowed',
                                key: 'allowed',
                                render: (
                                    _,
                                    record: AccessPolicySchedule
                                ) => (
                                    <Switch
                                        checked={
                                            record.is_allowed_day
                                        }
                                        onChange={(
                                            checked
                                        ) =>
                                            updateSchedule(
                                                record.day_of_week,
                                                {
                                                    is_allowed_day:
                                                        checked,
                                                }
                                            )
                                        }
                                    />
                                ),
                            },
                            {
                                title:
                                    'Start',
                                key: 'start',
                                render: (
                                    _,
                                    record: AccessPolicySchedule
                                ) => (
                                    <TimePicker
                                        format="HH:mm"
                                        disabled={
                                            !record.is_allowed_day
                                        }
                                        value={
                                            record.start_time
                                                ? dayjs(
                                                      record.start_time,
                                                      'HH:mm'
                                                  )
                                                : null
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            updateSchedule(
                                                record.day_of_week,
                                                {
                                                    start_time:
                                                        value
                                                            ? value.format(
                                                                  'HH:mm'
                                                              )
                                                            : null,
                                                }
                                            )
                                        }
                                    />
                                ),
                            },
                            {
                                title:
                                    'End',
                                key: 'end',
                                render: (
                                    _,
                                    record: AccessPolicySchedule
                                ) => (
                                    <TimePicker
                                        format="HH:mm"
                                        disabled={
                                            !record.is_allowed_day
                                        }
                                        value={
                                            record.end_time
                                                ? dayjs(
                                                      record.end_time,
                                                      'HH:mm'
                                                  )
                                                : null
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            updateSchedule(
                                                record.day_of_week,
                                                {
                                                    end_time:
                                                        value
                                                            ? value.format(
                                                                  'HH:mm'
                                                              )
                                                            : null,
                                                }
                                            )
                                        }
                                    />
                                ),
                            },
                        ]}
                    />
                </Card>

                <Card
                    size="small"
                    title="Assignments"
                    style={{
                        marginTop: 20,
                    }}
                    extra={
                        <Button
                            size="small"
                            type="primary"
                            onClick={
                                addAssignment
                            }
                        >
                            Add Assignment
                        </Button>
                    }
                >
                    {assignments.map(
                        (
                            assignment,
                            index
                        ) => (
                            <Card
                                key={
                                    index
                                }
                                size="small"
                                style={{
                                    marginBottom: 12,
                                }}
                            >
                                <Space
                                    direction="vertical"
                                    style={{
                                        width:
                                            '100%',
                                    }}
                                >
                                    <Select
                                        value={
                                            assignment.target_type
                                        }
                                        style={{
                                            width:
                                                '100%',
                                        }}
                                        onChange={(
                                            value
                                        ) =>
                                            updateAssignment(
                                                index,
                                                {
                                                    target_type:
                                                        value,
                                                    target_key:
                                                        value ===
                                                        'system'
                                                            ? 'system'
                                                            : null,
                                                    target_id:
                                                        null,
                                                }
                                            )
                                        }
                                        options={[
                                            {
                                                label:
                                                    'Whole System',
                                                value:
                                                    'system',
                                            },
                                            {
                                                label:
                                                    'Module',
                                                value:
                                                    'module',
                                            },
                                            {
                                                label:
                                                    'Permission / Task',
                                                value:
                                                    'permission',
                                            },
                                            {
                                                label:
                                                    'Role',
                                                value:
                                                    'role',
                                            },
                                            {
                                                label:
                                                    'User',
                                                value:
                                                    'user',
                                            },
                                        ]}
                                    />

                                    {assignment.target_type === 'module' && (
    <Select
        showSearch
        allowClear
        placeholder="Select Module"
        loading={permissionsLoading}
        value={
            assignment.target_key ??
            undefined
        }
        style={{
            width: '100%',
        }}
        optionFilterProp="label"
        onChange={(value) =>
            updateAssignment(
                index,
                {
                    target_key:
                        value ??
                        null,
                }
            )
        }
        options={modules.map(
            (module) => ({
                label: module,
                value: module,
            })
        )}
    />
)}

{assignment.target_type === 'permission' && (
    <Select
        showSearch
        allowClear
        placeholder="Select Permission / Task"
        loading={permissionsLoading}
        value={
            assignment.target_key ??
            undefined
        }
        style={{
            width: '100%',
        }}
        optionFilterProp="label"
        onChange={(value) =>
            updateAssignment(
                index,
                {
                    target_key:
                        value ??
                        null,
                }
            )
        }
        options={permissions.map(
            (permission) => ({
                label:
                    permission.name,
                value:
                    permission.name,
            })
        )}
    />
)}

                                    {assignment.target_type === 'role' && (
    <Select
        showSearch
        allowClear
        placeholder="Select Role"
        loading={rolesLoading}
        value={
            assignment.target_id ??
            undefined
        }
        style={{
            width: '100%',
        }}
        optionFilterProp="label"
        onChange={(value) =>
            updateAssignment(
                index,
                {
                    target_id:
                        value ??
                        null,
                }
            )
        }
        options={roles.map(
            (role) => ({
                label:
                    role.name,
                value:
                    role.id,
            })
        )}
    />
)}

{assignment.target_type === 'user' && (
    <Select
        showSearch
        allowClear
        placeholder="Select User"
        loading={usersLoading}
        value={
            assignment.target_id ??
            undefined
        }
        style={{
            width: '100%',
        }}
        optionFilterProp="label"
        onChange={(value) =>
            updateAssignment(
                index,
                {
                    target_id:
                        value ??
                        null,
                }
            )
        }
        options={users.map(
            (user) => ({
                label:
                    user.name,
                value:
                    user.id,
            })
        )}
    />
)}

                                    <Input.TextArea
                                        placeholder="Remarks"
                                        rows={2}
                                        value={
                                            assignment.remarks ||
                                            ''
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAssignment(
                                                index,
                                                {
                                                    remarks:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                    />

                                    <Button
                                        danger
                                        onClick={() =>
                                            removeAssignment(
                                                index
                                            )
                                        }
                                    >
                                        Remove
                                    </Button>
                                </Space>
                            </Card>
                        )
                    )}
                </Card>
            </Drawer>
        </div>
    );
};

export default AccessPoliciesPage;