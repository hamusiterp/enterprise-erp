import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    TeamOutlined,
} from '@ant-design/icons';

import {
    App,
    Button,
    Card,
    Checkbox,
    Col,
    Drawer,
    Empty,
    Form,
    Input,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
} from 'antd';

import type {
    ColumnsType,
    TablePaginationConfig,
} from 'antd/es/table';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    createRole,
    deleteRole,
    exportRoles,
    fetchPermissions,
    fetchRoles,
    updateRole,
} from '../../api/roles';

import type {
    PermissionGroup,
    Role,
    RoleForm,
} from '../../types/role';

import '../../styles/roles.css';

const { Title, Text } = Typography;

export default function RolesPage() {
    const { message } = App.useApp();
    const [form] = Form.useForm<RoleForm>();

    const selectedPermissions =
        Form.useWatch('permissions', form) ?? [];

    const [roles, setRoles] =
        useState<Role[]>([]);

    const [
        permissionGroups,
        setPermissionGroups,
    ] = useState<PermissionGroup[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [permissionsLoading, setPermissionsLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [exporting, setExporting] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editingRole, setEditingRole] =
        useState<Role | null>(null);

    const [searchInput, setSearchInput] =
        useState('');

    const [search, setSearch] =
        useState('');

    const [
        permissionSearch,
        setPermissionSearch,
    ] = useState('');

    const [page, setPage] =
        useState(1);

    const [perPage, setPerPage] =
        useState(10);

    const [total, setTotal] =
        useState(0);

    const loadRoles = async (): Promise<void> => {
        setLoading(true);

        try {
            const response =
                await fetchRoles(
                    page,
                    search,
                    perPage,
                );

            setRoles(response.data);
            setTotal(response.meta.total);
        } catch {
            message.error(
                'Unable to load roles.',
            );
        } finally {
            setLoading(false);
        }
    };

    const loadPermissions =
        async (): Promise<void> => {
            setPermissionsLoading(true);

            try {
                const response =
                    await fetchPermissions();

                setPermissionGroups(
                    response.data,
                );
            } catch {
                message.error(
                    'Unable to load permissions.',
                );
            } finally {
                setPermissionsLoading(false);
            }
        };

    useEffect(() => {
        void loadRoles();
    }, [page, perPage, search]);

    useEffect(() => {
        void loadPermissions();
    }, []);

    const totalPermissions = useMemo(
        () =>
            permissionGroups.reduce(
                (sum, group) =>
                    sum +
                    group.permissions.length,
                0,
            ),
        [permissionGroups],
    );

    const filteredPermissionGroups =
        useMemo(() => {
            const query =
                permissionSearch
                    .trim()
                    .toLowerCase();

            if (!query) {
                return permissionGroups;
            }

            return permissionGroups
                .map((group) => ({
                    ...group,

                    permissions:
                        group.permissions.filter(
                            (permission) =>
                                permission.name
                                    .toLowerCase()
                                    .includes(query) ||
                                permission.label
                                    .toLowerCase()
                                    .includes(query),
                        ),
                }))
                .filter(
                    (group) =>
                        group.label
                            .toLowerCase()
                            .includes(query) ||
                        group.permissions.length > 0,
                );
        }, [
            permissionGroups,
            permissionSearch,
        ]);

    const openCreate = (): void => {
        setEditingRole(null);
        setPermissionSearch('');

        form.resetFields();

        form.setFieldsValue({
            name: '',
            permissions: [],
        });

        setDrawerOpen(true);
    };

    const openEdit = (role: Role): void => {
        setEditingRole(role);
        setPermissionSearch('');

        form.setFieldsValue({
            name: role.name,
            permissions: role.permissions,
        });

        setDrawerOpen(true);
    };

    const closeDrawer = (): void => {
        setDrawerOpen(false);
        setEditingRole(null);
        setPermissionSearch('');
        form.resetFields();
    };

    const submitRole = async (): Promise<void> => {
        try {
            const values =
                await form.validateFields();

            setSaving(true);

            if (editingRole) {
                await updateRole(
                    editingRole.id,
                    values,
                );

                message.success(
                    'Role updated successfully.',
                );
            } else {
                await createRole(values);

                message.success(
                    'Role created successfully.',
                );
            }

            closeDrawer();

            await loadRoles();
        } catch (error) {
            const formError =
                typeof error === 'object' &&
                error !== null &&
                'errorFields' in error;

            if (!formError) {
                message.error(
                    'Unable to save the role.',
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const removeRole = async (
        role: Role,
    ): Promise<void> => {
        try {
            const response =
                await deleteRole(role.id);

            message.success(
                response.message,
            );

            if (
                roles.length === 1 &&
                page > 1
            ) {
                setPage(page - 1);
                return;
            }

            await loadRoles();
        } catch {
            message.error(
                'Unable to delete the role. It may be assigned to users.',
            );
        }
    };

    const handleSearch = (): void => {
        setPage(1);
        setSearch(searchInput.trim());
    };

    const clearSearch = (): void => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    const handleExport =
        async (): Promise<void> => {
            setExporting(true);

            try {
                await exportRoles(search);

                message.success(
                    'Roles exported successfully.',
                );
            } catch {
                message.error(
                    'Unable to export roles.',
                );
            } finally {
                setExporting(false);
            }
        };

    const togglePermission = (
        permissionName: string,
        checked: boolean,
    ): void => {
        const current =
            form.getFieldValue('permissions') ??
            [];

        const updated = checked
            ? Array.from(
                  new Set([
                      ...current,
                      permissionName,
                  ]),
              )
            : current.filter(
                  (name: string) =>
                      name !== permissionName,
              );

        form.setFieldValue(
            'permissions',
            updated,
        );

        form.validateFields([
            'permissions',
        ]).catch(() => undefined);
    };

    const togglePermissionGroup = (
        group: PermissionGroup,
        checked: boolean,
    ): void => {
        const current: string[] =
            form.getFieldValue('permissions') ??
            [];

        const groupPermissions =
            group.permissions.map(
                (permission) =>
                    permission.name,
            );

        let updated: string[];

        if (checked) {
            updated = Array.from(
                new Set([
                    ...current,
                    ...groupPermissions,
                ]),
            );
        } else {
            updated = current.filter(
                (permission) =>
                    !groupPermissions.includes(
                        permission,
                    ),
            );
        }

        form.setFieldValue(
            'permissions',
            updated,
        );

        form.validateFields([
            'permissions',
        ]).catch(() => undefined);
    };

    const columns: ColumnsType<Role> = [
        {
            title: 'Role',
            dataIndex: 'name',
            render: (_, role) => (
                <Space>
                    <span className="role-icon">
                        <SafetyCertificateOutlined />
                    </span>

                    <div>
                        <Space size={6}>
                            <Text strong>
                                {role.name}
                            </Text>

                            {role.is_system && (
                                <Tag color="gold">
                                    System
                                </Tag>
                            )}
                        </Space>

                        <div>
                            <Text
                                type="secondary"
                                className="role-guard"
                            >
                                Guard: {role.guard_name}
                            </Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions_count',
            width: 150,
            align: 'center',
            render: (count: number) => (
                <Tag color="blue">
                    {count}
                </Tag>
            ),
        },
        {
            title: 'Assigned Users',
            dataIndex: 'users_count',
            width: 160,
            align: 'center',
            render: (count: number) => (
                <Space>
                    <TeamOutlined />
                    <Text>{count}</Text>
                </Space>
            ),
        },
        {
            title: 'Actions',
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (_, role) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() =>
                            openEdit(role)
                        }
                        aria-label={`Edit ${role.name}`}
                    />

                    <Popconfirm
                        title="Delete role?"
                        description={
                            role.users_count > 0
                                ? 'This role is assigned to users and cannot be deleted.'
                                : `Delete ${role.name}?`
                        }
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{
                            danger: true,
                        }}
                        disabled={
                            role.is_system ||
                            role.users_count > 0
                        }
                        onConfirm={() =>
                            void removeRole(role)
                        }
                    >
                        <Button
                            danger
                            type="text"
                            disabled={
                                role.is_system ||
                                role.users_count > 0
                            }
                            icon={
                                <DeleteOutlined />
                            }
                            aria-label={`Delete ${role.name}`}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="roles-page">
            <div className="roles-header">
                <div>
                    <Text className="page-eyebrow">
                        Administration
                    </Text>

                    <Title level={2}>
                        Role Management
                    </Title>

                    <Text type="secondary">
                        Manage application roles and
                        permission assignments.
                    </Text>
                </div>

                <Space wrap>
                    <Button
                        icon={<DownloadOutlined />}
                        loading={exporting}
                        onClick={() =>
                            void handleExport()
                        }
                    >
                        Export Excel
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreate}
                    >
                        New Role
                    </Button>
                </Space>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card className="role-stat-card">
                        <Space size={16}>
                            <span className="role-stat-icon">
                                <SafetyCertificateOutlined />
                            </span>

                            <div>
                                <Text type="secondary">
                                    Total Roles
                                </Text>

                                <Title level={3}>
                                    {total}
                                </Title>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="role-stat-card">
                        <Space size={16}>
                            <span className="role-stat-icon">
                                <TeamOutlined />
                            </span>

                            <div>
                                <Text type="secondary">
                                    Total Permissions
                                </Text>

                                <Title level={3}>
                                    {totalPermissions}
                                </Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card className="roles-table-card">
                <div className="roles-toolbar">
                    <Input.Search
                        allowClear
                        placeholder="Search roles..."
                        prefix={<SearchOutlined />}
                        value={searchInput}
                        onChange={(event) => {
                            setSearchInput(
                                event.target.value,
                            );

                            if (
                                event.target.value === ''
                            ) {
                                clearSearch();
                            }
                        }}
                        onSearch={handleSearch}
                        className="roles-search"
                    />
                </div>

                <Table<Role>
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={roles}
                    scroll={{ x: 760 }}
                    pagination={{
                        current: page,
                        pageSize: perPage,
                        total,
                        showSizeChanger: true,
                        showTotal: (
                            count,
                            range,
                        ) =>
                            `${range[0]}-${range[1]} of ${count} roles`,
                        onChange: (
                            current,
                            size,
                        ) => {
                            setPage(current);
                            setPerPage(size);
                        },
                    } as TablePaginationConfig}
                />
            </Card>

            <Drawer
                open={drawerOpen}
                size="large"
                destroyOnClose={false}
                title={
                    editingRole
                        ? `Edit Role: ${editingRole.name}`
                        : 'Create Role'
                }
                onClose={closeDrawer}
                extra={
                    <Space>
                        <Button
                            onClick={closeDrawer}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            loading={saving}
                            onClick={() =>
                                void submitRole()
                            }
                        >
                            {editingRole
                                ? 'Update Role'
                                : 'Create Role'}
                        </Button>
                    </Space>
                }
            >
                <Form<RoleForm>
                    form={form}
                    layout="vertical"
                    initialValues={{
                        permissions: [],
                    }}
                >
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message:
                                    'Role name is required.',
                            },
                            {
                                max: 255,
                                message:
                                    'Role name cannot exceed 255 characters.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Example: Finance Manager"
                            disabled={
                                editingRole?.is_system
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="permissions"
                        hidden
                        rules={[
                            {
                                validator: async (
                                    _,
                                    value,
                                ) => {
                                    if (
                                        Array.isArray(
                                            value,
                                        ) &&
                                        value.length > 0
                                    ) {
                                        return;
                                    }

                                    throw new Error(
                                        'Select at least one permission.',
                                    );
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <div className="permission-section-header">
                        <div>
                            <Text strong>
                                Permissions
                            </Text>

                            <div>
                                <Text type="secondary">
                                    {
                                        selectedPermissions.length
                                    }{' '}
                                    permission(s) selected
                                </Text>
                            </div>
                        </div>

                        <Input
                            allowClear
                            prefix={
                                <SearchOutlined />
                            }
                            placeholder="Search permissions..."
                            value={permissionSearch}
                            onChange={(event) =>
                                setPermissionSearch(
                                    event.target.value,
                                )
                            }
                            className="permission-search"
                        />
                    </div>

                    <Spin
                        spinning={
                            permissionsLoading
                        }
                    >
                        <div className="permission-groups">
                            {filteredPermissionGroups.length ===
                            0 ? (
                                <Empty
                                    description="No permissions found"
                                    image={
                                        Empty.PRESENTED_IMAGE_SIMPLE
                                    }
                                />
                            ) : (
                                filteredPermissionGroups.map(
                                    (group) => {
                                        const names =
                                            group.permissions.map(
                                                (
                                                    permission,
                                                ) =>
                                                    permission.name,
                                            );

                                        const selectedCount =
                                            names.filter(
                                                (name) =>
                                                    selectedPermissions.includes(
                                                        name,
                                                    ),
                                            ).length;

                                        const allSelected =
                                            names.length >
                                                0 &&
                                            selectedCount ===
                                                names.length;

                                        const partiallySelected =
                                            selectedCount >
                                                0 &&
                                            selectedCount <
                                                names.length;

                                        return (
                                            <Card
                                                key={
                                                    group.module
                                                }
                                                size="small"
                                                className="permission-group-card"
                                                title={
                                                    <Checkbox
                                                        checked={
                                                            allSelected
                                                        }
                                                        indeterminate={
                                                            partiallySelected
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            togglePermissionGroup(
                                                                group,
                                                                event
                                                                    .target
                                                                    .checked,
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            strong
                                                        >
                                                            {
                                                                group.label
                                                            }
                                                        </Text>
                                                    </Checkbox>
                                                }
                                                extra={
                                                    <Text
                                                        type="secondary"
                                                    >
                                                        {
                                                            selectedCount
                                                        }
                                                        /
                                                        {
                                                            names.length
                                                        }
                                                    </Text>
                                                }
                                            >
                                                <Row
                                                    gutter={[
                                                        12,
                                                        12,
                                                    ]}
                                                >
                                                    {group.permissions.map(
                                                        (
                                                            permission,
                                                        ) => (
                                                            <Col
                                                                xs={
                                                                    24
                                                                }
                                                                sm={
                                                                    12
                                                                }
                                                                key={
                                                                    permission.id
                                                                }
                                                            >
                                                                <Checkbox
                                                                    checked={selectedPermissions.includes(
                                                                        permission.name,
                                                                    )}
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        togglePermission(
                                                                            permission.name,
                                                                            event
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        permission.label
                                                                    }
                                                                </Checkbox>
                                                            </Col>
                                                        ),
                                                    )}
                                                </Row>
                                            </Card>
                                        );
                                    },
                                )
                            )}
                        </div>
                    </Spin>
                </Form>
            </Drawer>
        </div>
    );
}