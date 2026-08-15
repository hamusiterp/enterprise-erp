import {
    Descriptions,
    Form,
    Input,
    Select,
    Typography,
} from 'antd';

import type {
    TableProps,
} from 'antd';

import CrudPage, {
    CrudStatusTag,
} from '../../components/crud/CrudPage';

import {
    changeDepartmentStatus,
    createDepartment,
    deleteDepartment,
    exportDepartments,
    fetchDepartments,
    fetchDeletedDepartments,
    restoreDepartment,
    forceDeleteDepartment,
    updateDepartment,
} from '../../api/departments';

import type {
    Department,
    DepartmentFormValues,
} from '../../types/department';

const {
    Text,
} = Typography;

const columns:
    TableProps<Department>['columns'] =
    [
        {
            title: 'Department ID',
            dataIndex:
                'department_id',
            key: 'department_id',
            sorter: true,
            width: 150,
            render: (
                value: string,
            ) => (
                <Text strong>
                    {value}
                </Text>
            ),
        },
        {
            title:
                'Department Name',
            dataIndex:
                'department_name',
            key: 'department_name',
            sorter: true,
            render: (
                value: string,
            ) => (
                <Text strong>
                    {value}
                </Text>
            ),
        },
        {
            title: 'Description',
            dataIndex:
                'description',
            key: 'description',
            responsive: ['lg'],
            render: (
                value:
                    | string
                    | null,
            ) =>
                value || '—',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            width: 120,
            render: (
                status,
            ) => (
                <CrudStatusTag
                    status={status}
                />
            ),
        },
        {
            title:
                'Registered By',
            key: 'registered_by',
            responsive: ['xl'],
            render: (
                _value,
                record,
            ) =>
                record
                    .registered_by
                    ?.name ?? '—',
        },
        {
            title:
                'Date Registered',
            dataIndex:
                'created_at',
            key: 'created_at',
            sorter: true,
            responsive: ['xl'],
            render: (
                value: string,
            ) =>
                formatDate(value),
        },
    ];

const departmentApi = {
    fetch: fetchDepartments,
    create: createDepartment,
    update: updateDepartment,
    remove: deleteDepartment,
    changeStatus: changeDepartmentStatus,
    export: exportDepartments,

    fetchDeleted: fetchDeletedDepartments,
    restore: restoreDepartment,
    forceDelete: forceDeleteDepartment,
    //fetchStatistics: fetchDepartmentStatistics,
};

export default function DepartmentsPage() {
    return (
        <CrudPage<
            Department,
            DepartmentFormValues
        >
            title="Departments"
            description="Manage organizational departments and their status."
            createButtonText="New Department"
            api={departmentApi}
            columns={columns}
            searchPlaceholder="Search by ID, name or description"
            defaultSortBy="created_at"
            formInitialValues={{
                department_name:
                    '',
                description: '',
                status: 'active',
            }}
            getFormValues={(
                department,
            ) => ({
                department_name:
                    department.department_name,
                description:
                    department.description ??
                    '',
                status:
                    department.status,
            })}
            formFields={
                <>
                    <Form.Item
                        name="department_name"
                        label="Department Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Department name is required.',
                            },
                            {
                                max: 200,
                                message:
                                    'Department name cannot exceed 200 characters.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter department name"
                            maxLength={
                                200
                            }
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                max: 2000,
                                message:
                                    'Description cannot exceed 2,000 characters.',
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter department description"
                            rows={5}
                            maxLength={
                                2000
                            }
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Status is required.',
                            },
                        ]}
                    >
                        <Select
                            options={[
                                {
                                    value:
                                        'active',
                                    label:
                                        'Active',
                                },
                                {
                                    value:
                                        'inactive',
                                    label:
                                        'Inactive',
                                },
                            ]}
                        />
                    </Form.Item>
                </>
            }
            viewContent={(
                department,
            ) => (
                <Descriptions
                    bordered
                    column={1}
                >
                    <Descriptions.Item label="Department ID">
                        {
                            department.department_id
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="Department Name">
                        {
                            department.department_name
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="Description">
                        {department.description ??
                            '—'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <CrudStatusTag
                            status={
                                department.status
                            }
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Registered By">
                        {department
                            .registered_by
                            ?.name ??
                            '—'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Date Registered">
                        {formatDate(
                            department.created_at,
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Last Updated">
                        {formatDate(
                            department.updated_at,
                        )}
                    </Descriptions.Item>
                </Descriptions>
            )}
        />
    );
}

function formatDate(
    value: string,
): string {
    if (!value) {
        return '—';
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'en-US',
        {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
    ).format(date);
}