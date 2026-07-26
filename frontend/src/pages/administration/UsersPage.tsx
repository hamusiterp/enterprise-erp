import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  KeyOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Dropdown,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import type {
  MenuProps,
  TablePaginationConfig,
  TableProps,
} from 'antd';

import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  changeUserStatus,
  createUser,
  deleteUser,
  exportUsers,
  fetchRoles,
  fetchUsers,
  resetUserPassword,
  updateUser,
} from '../../api/users';

import type {
  Role,
  SystemUser,
  UserFilters,
  UserFormValues,
  UserStatus,
} from '../../types/user';

import '../../styles/users.css';

const { Title, Text } = Typography;

const DEFAULT_FILTERS: UserFilters = {
  page: 1,
  per_page: 10,
  search: '',
  status: undefined,
  role: undefined,
  sort_by: 'created_at',
  sort_direction: 'desc',
};

interface ApiValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiValidationError>(error)) {
    const responseData = error.response?.data;

    const firstValidationError = responseData?.errors
      ? Object.values(responseData.errors)[0]?.[0]
      : undefined;

    return (
      firstValidationError ??
      responseData?.message ??
      fallbackMessage
    );
  }

  return fallbackMessage;
}

function getStatusTag(status: UserStatus) {
  const statusSettings: Record<
    UserStatus,
    {
      color: string;
      label: string;
    }
  > = {
    active: {
      color: 'success',
      label: 'Active',
    },
    inactive: {
      color: 'default',
      label: 'Inactive',
    },
    locked: {
      color: 'error',
      label: 'Locked',
    },
  };

  const settings = statusSettings[status];

  return (
    <Tag
      color={settings.color}
      className="user-status-tag"
    >
      {settings.label}
    </Tag>
  );
}

function UsersPage() {
  const { message } = App.useApp();

  const [userForm] = Form.useForm<UserFormValues>();
  const [passwordForm] = Form.useForm<{
    password: string;
    password_confirmation: string;
  }>();

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [filters, setFilters] =
    useState<UserFilters>(DEFAULT_FILTERS);

  const [searchInput, setSearchInput] = useState('');

  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRolesLoading, setIsRolesLoading] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isExporting, setIsExporting] =
    useState(false);

  const [isUserDrawerOpen, setIsUserDrawerOpen] =
    useState(false);

  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<SystemUser | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetchUsers(filters);

      setUsers(response.data);
      setTotalUsers(response.meta.total);
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to load the user list.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, message]);

  const loadRoles = useCallback(async () => {
    setIsRolesLoading(true);

    try {
      const response = await fetchRoles();
      setRoles(response.data);
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to load available roles.',
        ),
      );
    } finally {
      setIsRolesLoading(false);
    }
  }, [message]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const openCreateDrawer = () => {
    setSelectedUser(null);

    userForm.resetFields();

    userForm.setFieldsValue({
      status: 'active',
      roles: [],
    });

    setIsUserDrawerOpen(true);
  };

  const openEditDrawer = (user: SystemUser) => {
    setSelectedUser(user);

    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      status: user.status,
      roles: user.roles,
      password: undefined,
      password_confirmation: undefined,
    });

    setIsUserDrawerOpen(true);
  };

  const closeUserDrawer = () => {
    setIsUserDrawerOpen(false);
    setSelectedUser(null);
    userForm.resetFields();
  };

  const handleUserSubmit = async (
    values: UserFormValues,
  ) => {
    setIsSubmitting(true);

    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, values);
        message.success('User updated successfully.');
      } else {
        await createUser(values);
        message.success('User created successfully.');
      }

      closeUserDrawer();
      await loadUsers();
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          selectedUser
            ? 'Unable to update the user.'
            : 'Unable to create the user.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: SystemUser) => {
    try {
      const response = await deleteUser(user.id);

      message.success(response.message);
      await loadUsers();
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to delete the user.',
        ),
      );
    }
  };

  const handleStatusChange = async (
    user: SystemUser,
    status: UserStatus,
  ) => {
    try {
      const response = await changeUserStatus(
        user.id,
        status,
      );

      message.success(response.message);
      await loadUsers();
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to change the user status.',
        ),
      );
    }
  };

  const openPasswordDrawer = (user: SystemUser) => {
    setSelectedUser(user);
    passwordForm.resetFields();
    setIsPasswordDrawerOpen(true);
  };

  const closePasswordDrawer = () => {
    setIsPasswordDrawerOpen(false);
    setSelectedUser(null);
    passwordForm.resetFields();
  };

  const handlePasswordReset = async (values: {
    password: string;
    password_confirmation: string;
  }) => {
    if (!selectedUser) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetUserPassword(
        selectedUser.id,
        values.password,
        values.password_confirmation,
      );

      message.success(response.message);
      closePasswordDrawer();
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to reset the password.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: 1,
      search: searchInput.trim(),
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await exportUsers({
        search: filters.search,
        status: filters.status,
        role: filters.role,
      });

      message.success('User list exported successfully.');
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          'Unable to export the user list.',
        ),
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleTableChange: TableProps<SystemUser>['onChange'] = (
    pagination,
    _tableFilters,
    sorter,
  ) => {
    const currentSorter = Array.isArray(sorter)
      ? sorter[0]
      : sorter;

    const allowedSortFields = [
      'name',
      'email',
      'status',
      'created_at',
    ] as const;

    const requestedSortField =
      typeof currentSorter?.field === 'string' &&
      allowedSortFields.includes(
        currentSorter.field as (typeof allowedSortFields)[number],
      )
        ? (currentSorter.field as UserFilters['sort_by'])
        : filters.sort_by;

    setFilters((currentFilters) => ({
      ...currentFilters,
      page: pagination.current ?? 1,
      per_page: pagination.pageSize ?? 10,
      sort_by: requestedSortField,
      sort_direction:
        currentSorter?.order === 'ascend'
          ? 'asc'
          : currentSorter?.order === 'descend'
            ? 'desc'
            : currentFilters.sort_direction,
    }));
  };

  const getStatusMenuItems = (
    user: SystemUser,
  ): MenuProps['items'] => [
    {
      key: 'active',
      icon: <UnlockOutlined />,
      label: 'Set as active',
      disabled: user.status === 'active',
      onClick: () => {
        void handleStatusChange(user, 'active');
      },
    },
    {
      key: 'inactive',
      icon: <LockOutlined />,
      label: 'Set as inactive',
      disabled: user.status === 'inactive',
      onClick: () => {
        void handleStatusChange(user, 'inactive');
      },
    },
    {
      key: 'locked',
      icon: <LockOutlined />,
      label: 'Lock account',
      danger: true,
      disabled: user.status === 'locked',
      onClick: () => {
        void handleStatusChange(user, 'locked');
      },
    },
  ];

  const columns = useMemo<TableProps<SystemUser>['columns']>(
    () => [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        width: 250,
        render: (_value, user) => (
          <div className="user-identity">
            <Avatar className="user-list-avatar">
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <div className="user-identity-text">
              <Text strong>{user.name}</Text>
              <Text type="secondary">{user.email}</Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        width: 250,
        responsive: ['lg'],
      },
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        width: 220,
        render: (userRoles: string[]) => (
          <Space size={[4, 6]} wrap>
            {userRoles.length > 0 ? (
              userRoles.map((roleName) => (
                <Tag key={roleName} color="blue">
                  {roleName}
                </Tag>
              ))
            ) : (
              <Tag>No role</Tag>
            )}
          </Space>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        width: 130,
        render: (status: UserStatus) =>
          getStatusTag(status),
      },
      {
        title: 'Created',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        width: 180,
        responsive: ['xl'],
        render: (createdAt: string | null) =>
          createdAt
            ? new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              }).format(new Date(createdAt))
            : '—',
      },
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        width: 190,
        render: (_value, user) => (
          <Space size={4}>
            <Tooltip title="Edit user">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEditDrawer(user)}
              />
            </Tooltip>

            <Tooltip title="Reset password">
              <Button
                type="text"
                icon={<KeyOutlined />}
                onClick={() => openPasswordDrawer(user)}
              />
            </Tooltip>

            <Dropdown
              menu={{
                items: getStatusMenuItems(user),
              }}
              trigger={['click']}
            >
              <Tooltip title="Change status">
                <Button
                  type="text"
                  icon={
                    user.status === 'active' ? (
                      <UnlockOutlined />
                    ) : (
                      <LockOutlined />
                    )
                  }
                />
              </Tooltip>
            </Dropdown>

            <Popconfirm
              title="Delete user"
              description={`Delete ${user.name}? This action cannot be undone.`}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
              }}
              onConfirm={() => {
                void handleDeleteUser(user);
              }}
            >
              <Tooltip title="Delete user">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  const pagination: TablePaginationConfig = {
    current: filters.page,
    pageSize: filters.per_page,
    total: totalUsers,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total, range) =>
      `${range[0]}–${range[1]} of ${total} users`,
  };

  return (
    <div className="users-page">
      <div className="users-page-header">
        <div>
          <Text className="users-page-eyebrow">
            Administration
          </Text>

          <Title level={2} className="users-page-title">
            User Management
          </Title>

          <Text type="secondary">
            Create accounts, assign roles and manage user
            access.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<DownloadOutlined />}
            loading={isExporting}
            onClick={() => {
              void handleExport();
            }}
          >
            Export Excel
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateDrawer}
          >
            New User
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="users-summary-row">
        <Col xs={24} sm={12} lg={8}>
          <Card className="users-summary-card">
            <div className="users-summary-content">
              <div className="users-summary-icon">
                <TeamOutlined />
              </div>

              <div>
                <Text type="secondary">Total users</Text>
                <Title level={3}>{totalUsers}</Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="users-summary-card">
            <div className="users-summary-content">
              <div className="users-summary-icon">
                <UnlockOutlined />
              </div>

              <div>
                <Text type="secondary">
                  Active on this page
                </Text>

                <Title level={3}>
                  {
                    users.filter(
                      (user) => user.status === 'active',
                    ).length
                  }
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="users-summary-card">
            <div className="users-summary-content">
              <div className="users-summary-icon">
                <LockOutlined />
              </div>

              <div>
                <Text type="secondary">
                  Locked on this page
                </Text>

                <Title level={3}>
                  {
                    users.filter(
                      (user) => user.status === 'locked',
                    ).length
                  }
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="users-table-card">
        <div className="users-filter-bar">
          <Input
            allowClear
            value={searchInput}
            prefix={<SearchOutlined />}
            placeholder="Search by name or email"
            className="users-search-input"
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
            onPressEnter={handleSearch}
          />

          <Select
            allowClear
            placeholder="All roles"
            className="users-filter-select"
            loading={isRolesLoading}
            value={filters.role}
            options={roles.map((role) => ({
              label: role.name,
              value: role.name,
            }))}
            onChange={(role) => {
              setFilters((currentFilters) => ({
                ...currentFilters,
                page: 1,
                role,
              }));
            }}
          />

          <Select
            allowClear
            placeholder="All statuses"
            className="users-filter-select"
            value={filters.status}
            options={[
              {
                label: 'Active',
                value: 'active',
              },
              {
                label: 'Inactive',
                value: 'inactive',
              },
              {
                label: 'Locked',
                value: 'locked',
              },
            ]}
            onChange={(status) => {
              setFilters((currentFilters) => ({
                ...currentFilters,
                page: 1,
                status,
              }));
            }}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleClearFilters}
          >
            Reset
          </Button>
        </div>

        <Table<SystemUser>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={users}
          pagination={pagination}
          scroll={{
            x: 1250,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Drawer
        title={
          selectedUser ? 'Edit User' : 'Create New User'
        }
        width={520}
        open={isUserDrawerOpen}
        destroyOnHidden
        onClose={closeUserDrawer}
        footer={
          <div className="users-drawer-footer">
            <Button onClick={closeUserDrawer}>
              Cancel
            </Button>

            <Button
              type="primary"
              loading={isSubmitting}
              onClick={() => {
                userForm.submit();
              }}
            >
              {selectedUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        }
      >
        <Form<UserFormValues>
          form={userForm}
          layout="vertical"
          requiredMark="optional"
          onFinish={(values) => {
            void handleUserSubmit(values);
          }}
        >
          <Form.Item
            name="name"
            label="Full name"
            rules={[
              {
                required: true,
                message: 'Enter the user’s full name.',
              },
              {
                max: 255,
                message:
                  'The name cannot exceed 255 characters.',
              },
            ]}
          >
            <Input placeholder="Example: Abebe Kebede" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email address"
            rules={[
              {
                required: true,
                message: 'Enter an email address.',
              },
              {
                type: 'email',
                message: 'Enter a valid email address.',
              },
            ]}
          >
            <Input placeholder="name@company.com" />
          </Form.Item>

          <Form.Item
            name="roles"
            label="Roles"
            rules={[
              {
                required: true,
                message: 'Select at least one role.',
              },
            ]}
          >
            <Select
              mode="multiple"
              loading={isRolesLoading}
              placeholder="Select user roles"
              options={roles.map((role) => ({
                label: role.name,
                value: role.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Account status"
            rules={[
              {
                required: true,
                message: 'Select an account status.',
              },
            ]}
          >
            <Select
              options={[
                {
                  label: 'Active',
                  value: 'active',
                },
                {
                  label: 'Inactive',
                  value: 'inactive',
                },
                {
                  label: 'Locked',
                  value: 'locked',
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              selectedUser
                ? 'New password'
                : 'Temporary password'
            }
            extra={
              selectedUser
                ? 'Leave blank to keep the current password.'
                : 'The user should change this temporary password later.'
            }
            rules={[
              {
                required: !selectedUser,
                message: 'Enter a temporary password.',
              },
              {
                min: 8,
                message:
                  'The password must contain at least 8 characters.',
              },
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm password"
            dependencies={['password']}
            rules={[
              {
                required:
                  !selectedUser ||
                  Boolean(userForm.getFieldValue('password')),
                message: 'Confirm the password.',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const password = getFieldValue('password');

                  if (!password && selectedUser) {
                    return Promise.resolve();
                  }

                  if (value === password) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'The password confirmation does not match.',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder="Re-enter password"
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Reset User Password"
        width={460}
        open={isPasswordDrawerOpen}
        destroyOnHidden
        onClose={closePasswordDrawer}
        footer={
          <div className="users-drawer-footer">
            <Button onClick={closePasswordDrawer}>
              Cancel
            </Button>

            <Button
              type="primary"
              loading={isSubmitting}
              onClick={() => {
                passwordForm.submit();
              }}
            >
              Reset Password
            </Button>
          </div>
        }
      >
        <Text type="secondary">
          Set a new password for{' '}
          <Text strong>
            {selectedUser?.name ?? 'this user'}
          </Text>
          .
        </Text>

        <Form
          form={passwordForm}
          layout="vertical"
          className="password-reset-form"
          onFinish={(values) => {
            void handlePasswordReset(values);
          }}
        >
          <Form.Item
            name="password"
            label="New password"
            rules={[
              {
                required: true,
                message: 'Enter the new password.',
              },
              {
                min: 8,
                message:
                  'The password must contain at least 8 characters.',
              },
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm new password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Confirm the new password.',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value === getFieldValue('password')
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'The password confirmation does not match.',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder="Re-enter new password"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default UsersPage;