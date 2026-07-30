import {
    Descriptions,
    Form,
    Input,
    InputNumber,
    Select,
    Typography,
} from 'antd';

import type {
    TableProps,
} from 'antd';

import {
    useEffect,
    useState,
} from 'react';

import CrudPage, {
    CrudStatusTag,
} from '../../components/crud/CrudPage';

import {
    changeDesignationStatus,
    createDesignation,
    deleteDesignation,
    exportDesignations,
    fetchDeletedDesignations,
    fetchDesignations,
    forceDeleteDesignation,
    restoreDesignation,
    updateDesignation,
} from '../../api/designations';

import {
    fetchDepartmentOptions,
} from '../../api/departments';

import type {
    DepartmentOption,
} from '../../api/departments';

import type {
    Designation,
    DesignationFormValues,
} from '../../types/designation';

const {
    Text,
} = Typography;

const columns:
    TableProps<Designation>['columns'] =
    [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            width: 130,
            render: (
                value: string,
            ) => (
                <Text strong>
                    {value}
                </Text>
            ),
        },
        {
            title: 'Designation Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            width: 220,
            render: (
                value: string,
            ) => (
                <Text strong>
                    {value}
                </Text>
            ),
        },
        {
    title: 'Department',
    key: 'department',
    width: 220,
    render: (_value, record) =>
        record.department?.department_name ?? '—',
},
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            sorter: true,
            width: 100,
            render: (
                value:
                    | number
                    | null,
            ) =>
                value ?? '—',
        },
        {
            title: 'Description',
            dataIndex: 'description',
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
            title: 'Date Registered',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: true,
            responsive: ['xl'],
            width: 190,
            render: (
                value: string,
            ) =>
                formatDate(value),
        },
    ];

const designationApi = {
    fetch: fetchDesignations,
    create: createDesignation,
    update: updateDesignation,
    remove: deleteDesignation,
    changeStatus:
        changeDesignationStatus,
    export: exportDesignations,
    fetchDeleted:
        fetchDeletedDesignations,
    restore:
        restoreDesignation,
    forceDelete:
        forceDeleteDesignation,
};

export default function DesignationsPage() {
    const [
        departmentOptions,
        setDepartmentOptions,
    ] =
        useState<DepartmentOption[]>(
            [],
        );

    const [
        departmentsLoading,
        setDepartmentsLoading,
    ] =
        useState(false);

    useEffect(() => {
        const loadDepartmentOptions =
            async () => {
                setDepartmentsLoading(
                    true,
                );

                try {
                    const options =
                        await fetchDepartmentOptions();

                    setDepartmentOptions(
                        options,
                    );
                } catch {
                    setDepartmentOptions(
                        [],
                    );
                } finally {
                    setDepartmentsLoading(
                        false,
                    );
                }
            };

        void loadDepartmentOptions();
    }, []);

    return (
        <CrudPage<
            Designation,
            DesignationFormValues
        >
            title="Designations"
            description="Manage employee designations, levels and department assignments."
            createButtonText="New Designation"
            api={designationApi}
            columns={columns}
            searchPlaceholder="Search by code, name or description"
            defaultSortBy="created_at"
            formInitialValues={{
                code: '',
                name: '',
                department_id: null,
                level: null,
                description: '',
                status: 'active',
            }}
            getFormValues={(
                designation,
            ) => ({
                code:
                    designation.code,
                name:
                    designation.name,
                department_id:
                    designation.department_id,
                level:
                    designation.level,
                description:
                    designation.description ??
                    '',
                status:
                    designation.status,
            })}
            formFields={
                <>
                    <Form.Item
                        name="code"
                        label="Designation Code"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Designation code is required.',
                            },
                            {
                                max: 50,
                                message:
                                    'Designation code cannot exceed 50 characters.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Example: MGR"
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Designation Name"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Designation name is required.',
                            },
                            {
                                max: 150,
                                message:
                                    'Designation name cannot exceed 150 characters.',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Example: Manager"
                            maxLength={150}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="department_id"
                        label="Department"
                    >
                        <Select
                            allowClear
                            showSearch
                            loading={
                                departmentsLoading
                            }
                            placeholder="Select department"
                            optionFilterProp="label"
                            options={departmentOptions.map((department) => ({
    value: department.id,
    label: department.department_name,
}))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[
                            {
                                type: 'number',
                                min: 1,
                                message:
                                    'Level must be at least 1.',
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            precision={0}
                            placeholder="Enter designation level"
                            style={{
                                width: '100%',
                            }}
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
                            placeholder="Enter designation description"
                            rows={5}
                            maxLength={2000}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[
                            {
                                required: true,
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
                designation,
            ) => (
                <Descriptions
                    bordered
                    column={1}
                >
                    <Descriptions.Item label="Code">
                        {designation.code}
                    </Descriptions.Item>

                    <Descriptions.Item label="Designation Name">
                        {designation.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Department">
    {designation
        .department
        ?.department_name ??
        '—'}
</Descriptions.Item>

                    <Descriptions.Item label="Level">
                        {designation.level ??
                            '—'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Description">
                        {designation.description ??
                            '—'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        <CrudStatusTag
                            status={
                                designation.status
                            }
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Date Registered">
                        {formatDate(
                            designation.created_at,
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Last Updated">
                        {formatDate(
                            designation.updated_at,
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