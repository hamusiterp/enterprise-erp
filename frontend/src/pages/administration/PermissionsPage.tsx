import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import {
    App,
    Button,
    Card,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Space,
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
    useState,
} from 'react';

import {
    createPermission,
    deletePermission,
    fetchPermissions,
    updatePermission,
} from '../../api/permissions';

import type {
    Permission,
    PermissionForm,
} from '../../types/permission';

const {
    Title,
    Text,
} = Typography;

export default function PermissionsPage() {
    const { message } = App.useApp();

    const [form] =
        Form.useForm<PermissionForm>();

    const [
        permissions,
        setPermissions,
    ] = useState<Permission[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);

    const [
        editingPermission,
        setEditingPermission,
    ] =
        useState<Permission | null>(
            null,
        );

    const [
        searchInput,
        setSearchInput,
    ] = useState('');

    const [
        search,
        setSearch,
    ] = useState('');

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        perPage,
        setPerPage,
    ] = useState(10);

    const [
        total,
        setTotal,
    ] = useState(0);

    const loadPermissions =
        async (): Promise<void> => {
            setLoading(true);

            try {
                const response =
                    await fetchPermissions(
                        page,
                        search,
                        perPage,
                    );

                setPermissions(
                    response.data,
                );

                setTotal(
                    response.meta.total,
                );
            } catch {
                message.error(
                    'Unable to load permissions.',
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        void loadPermissions();
    }, [
        page,
        perPage,
        search,
    ]);

    const openCreate =
        (): void => {
            setEditingPermission(
                null,
            );

            form.resetFields();

            form.setFieldsValue({
                module: '',
                action: '',
            });

            setDrawerOpen(true);
        };

    const openEdit = (
        permission: Permission,
    ): void => {
        setEditingPermission(
            permission,
        );

        form.setFieldsValue({
            module:
                permission.module,
            action:
                permission.action,
        });

        setDrawerOpen(true);
    };

    const closeDrawer =
        (): void => {
            setDrawerOpen(false);

            setEditingPermission(
                null,
            );

            form.resetFields();
        };

    const submitPermission =
        async (): Promise<void> => {
            try {
                const values =
                    await form.validateFields();

                setSaving(true);

                if (
                    editingPermission
                ) {
                    await updatePermission(
                        editingPermission.id,
                        values,
                    );

                    message.success(
                        'Permission updated successfully.',
                    );
                } else {
                    await createPermission(
                        values,
                    );

                    message.success(
                        'Permission created successfully.',
                    );
                }

                closeDrawer();

                await loadPermissions();
            } catch (error) {
                const formError =
                    typeof error ===
                        'object' &&
                    error !== null &&
                    'errorFields' in
                        error;

                if (!formError) {
                    message.error(
                        'Unable to save permission.',
                    );
                }
            } finally {
                setSaving(false);
            }
        };

    const removePermission =
        async (
            permission: Permission,
        ): Promise<void> => {
            try {
                const response =
                    await deletePermission(
                        permission.id,
                    );

                message.success(
                    response.message,
                );

                if (
                    permissions.length ===
                        1 &&
                    page > 1
                ) {
                    setPage(
                        page - 1,
                    );

                    return;
                }

                await loadPermissions();
            } catch {
                message.error(
                    'Unable to delete permission. It may already be assigned to a role.',
                );
            }
        };

    const handleSearch =
        (): void => {
            setPage(1);

            setSearch(
                searchInput.trim(),
            );
        };

    const resetSearch =
        (): void => {
            setSearchInput('');
            setSearch('');
            setPage(1);
        };

    const handleTableChange = (
        pagination:
            TablePaginationConfig,
    ): void => {
        setPage(
            pagination.current ??
                1,
        );

        setPerPage(
            pagination.pageSize ??
                10,
        );
    };

    const columns:
        ColumnsType<Permission> =
        [
            {
                title:
                    'Permission',
                dataIndex:
                    'name',
                key: 'name',
                render: (
                    name:
                        string,
                ) => (
                    <Space>
                        <SafetyCertificateOutlined
                            style={{
                                color:
                                    '#1677ff',
                            }}
                        />

                        <Text strong>
                            {name}
                        </Text>
                    </Space>
                ),
            },

            {
                title: 'Module',
                dataIndex:
                    'module',
                key: 'module',
                width: 180,
                render: (
                    module:
                        string,
                ) => (
                    <Tag color="blue">
                        {formatLabel(
                            module,
                        )}
                    </Tag>
                ),
            },

            {
                title: 'Action',
                dataIndex:
                    'action',
                key: 'action',
                width: 150,
                render: (
                    action:
                        string,
                ) => (
                    <Tag>
                        {formatLabel(
                            action,
                        )}
                    </Tag>
                ),
            },

            {
                title:
                    'Assigned Roles',
                dataIndex:
                    'roles_count',
                key:
                    'roles_count',
                width: 150,
                align:
                    'center',
                render: (
                    count:
                        number,
                ) => (
                    <Tag
                        color={
                            count > 0
                                ? 'green'
                                : 'default'
                        }
                    >
                        {count}
                    </Tag>
                ),
            },

            {
                title: 'Guard',
                dataIndex:
                    'guard_name',
                width: 100,
                render: (
                    guard:
                        string,
                ) => (
                    <Tag>
                        {guard}
                    </Tag>
                ),
            },

            {
                title:
                    'Actions',
                key: 'actions',
                width: 130,
                align:
                    'center',
                fixed: 'right',

                render: (
                    _,
                    permission,
                ) => (
                    <Space>
                        <Button
                            type="text"
                            icon={
                                <EditOutlined />
                            }
                            onClick={() =>
                                openEdit(
                                    permission,
                                )
                            }
                        />

                        <Popconfirm
                            title="Delete permission?"
                            description={
                                permission.roles_count >
                                0
                                    ? 'This permission is assigned to roles and cannot be deleted.'
                                    : `Delete ${permission.name}?`
                            }
                            okText="Delete"
                            cancelText="Cancel"
                            disabled={
                                permission.roles_count >
                                0
                            }
                            okButtonProps={{
                                danger:
                                    true,
                            }}
                            onConfirm={() =>
                                void removePermission(
                                    permission,
                                )
                            }
                        >
                            <Button
                                type="text"
                                danger
                                disabled={
                                    permission.roles_count >
                                    0
                                }
                                icon={
                                    <DeleteOutlined />
                                }
                            />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

    return (
        <div>
            <div
                style={{
                    display:
                        'flex',
                    justifyContent:
                        'space-between',
                    alignItems:
                        'flex-start',
                    marginBottom:
                        20,
                    gap: 16,
                    flexWrap:
                        'wrap',
                }}
            >
                <div>
                    <Text
                        type="secondary"
                    >
                        Administration
                    </Text>

                    <Title
                        level={2}
                        style={{
                            marginTop:
                                4,
                            marginBottom:
                                4,
                        }}
                    >
                        Permission Management
                    </Title>

                    <Text
                        type="secondary"
                    >
                        Manage system permissions used by application roles.
                    </Text>
                </div>

                <Button
                    type="primary"
                    icon={
                        <PlusOutlined />
                    }
                    onClick={
                        openCreate
                    }
                >
                    New Permission
                </Button>
            </div>

            <Card
                variant="borderless"
            >
                <Space
                    wrap
                    style={{
                        marginBottom:
                            16,
                    }}
                >
                    <Input
                        allowClear
                        prefix={
                            <SearchOutlined />
                        }
                        placeholder="Search permissions"
                        value={
                            searchInput
                        }
                        style={{
                            width: 300,
                        }}
                        onChange={(
                            event,
                        ) =>
                            setSearchInput(
                                event
                                    .target
                                    .value,
                            )
                        }
                        onPressEnter={
                            handleSearch
                        }
                    />

                    <Button
                        type="primary"
                        icon={
                            <SearchOutlined />
                        }
                        onClick={
                            handleSearch
                        }
                    >
                        Search
                    </Button>

                    <Button
                        onClick={
                            resetSearch
                        }
                    >
                        Reset
                    </Button>
                </Space>

                <Table<Permission>
                    rowKey="id"
                    columns={
                        columns
                    }
                    dataSource={
                        permissions
                    }
                    loading={
                        loading
                    }
                    scroll={{
                        x: 900,
                    }}
                    pagination={{
                        current:
                            page,
                        pageSize:
                            perPage,
                        total,
                        showSizeChanger:
                            true,
                        pageSizeOptions: [
                            5,
                            10,
                            20,
                            50,
                            100,
                        ],
                        showTotal: (
                            count,
                        ) =>
                            `${count} permissions`,
                    }}
                    onChange={
                        handleTableChange
                    }
                />
            </Card>

            <Drawer
                title={
                    editingPermission
                        ? 'Edit Permission'
                        : 'New Permission'
                }
                size="default"
                open={
                    drawerOpen
                }
                onClose={
                    closeDrawer
                }
                extra={
                    <Space>
                        <Button
                            onClick={
                                closeDrawer
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            loading={
                                saving
                            }
                            onClick={() =>
                                void submitPermission()
                            }
                        >
                            {editingPermission
                                ? 'Save Changes'
                                : 'Create'}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="module"
                        label="Module"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Module is required.',
                            },
                            {
                                pattern:
                                    /^[a-zA-Z0-9_-]+$/,
                                message:
                                    'Use letters, numbers, hyphens or underscores only.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Example: projects"
                        />
                    </Form.Item>

                    <Form.Item
                        name="action"
                        label="Action"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Action is required.',
                            },
                            {
                                pattern:
                                    /^[a-zA-Z0-9_-]+$/,
                                message:
                                    'Use letters, numbers, hyphens or underscores only.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Example: view"
                        />
                    </Form.Item>

                    <Text
                        type="secondary"
                    >
                        Permission will be stored in the format:
                        <strong>
                            {' '}
                            module.action
                        </strong>
                    </Text>
                </Form>
            </Drawer>
        </div>
    );
}

function formatLabel(
    value: string,
): string {
    return value
        .replace(
            /[-_]/g,
            ' ',
        )
        .replace(
            /\b\w/g,
            (character) =>
                character.toUpperCase(),
        );
}