import React, {
    useEffect,
    useState,
} from 'react';

import {
    Button,
    Card,
    DatePicker,
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

import dayjs from 'dayjs';

import {
    createReportingPeriod,
    getReportingPeriods,
    updateReportingPeriod,
} from '../../../api/reportingPeriods';

import type {
    ReportingPeriod,
    ReportingPeriodPayload,
} from '../../../api/reportingPeriods';

import {
    getFiscalYears,
} from '../../../api/fiscalYears';

import type {
    FiscalYear,
} from '../../../api/fiscalYears';

const ReportingPeriodsPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] =
        useState<ReportingPeriod[]>([]);

    const [fiscalYears, setFiscalYears] =
        useState<FiscalYear[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editing, setEditing] =
        useState<ReportingPeriod | null>(null);

    const [selectedFiscalYearId, setSelectedFiscalYearId] =
        useState<number | undefined>();

    const loadFiscalYears = async () => {
        try {
            const result =
                await getFiscalYears();

            setFiscalYears(result);

            const current = result.find(
                (item) => item.is_current
            );

            if (current) {
                setSelectedFiscalYearId(
                    current.id
                );
            }
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load fiscal years.'
            );
        }
    };

    const loadData = async (
        fiscalYearId?: number
    ) => {
        try {
            setLoading(true);

            const result =
                await getReportingPeriods(
                    fiscalYearId
                );

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load reporting periods.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiscalYears();
    }, []);

    useEffect(() => {
        if (selectedFiscalYearId) {
            loadData(
                selectedFiscalYearId
            );
        }
    }, [selectedFiscalYearId]);

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            fiscal_year_id:
                selectedFiscalYearId,
            calendar_type:
                'gregorian',
            is_active: true,
            is_closed: false,
        });

        setDrawerOpen(true);
    };

    const openEdit = (
        record: ReportingPeriod
    ) => {
        setEditing(record);

        form.setFieldsValue({
            fiscal_year_id:
                record.fiscal_year_id,
            name:
                record.name,
            code:
                record.code,
            period_number:
                record.period_number,
            start_date:
                dayjs(
                    record.start_date
                ),
            end_date:
                dayjs(
                    record.end_date
                ),
            calendar_type:
                record.calendar_type,
            display_start_date:
                record.display_start_date,
            display_end_date:
                record.display_end_date,
            is_active:
                record.is_active,
            is_closed:
                record.is_closed,
            remarks:
                record.remarks,
        });

        setDrawerOpen(true);
    };

    const handleSave = async () => {
        try {
            const values =
                await form.validateFields();

            setSaving(true);

            const payload:
                ReportingPeriodPayload = {
                fiscal_year_id:
                    values.fiscal_year_id,

                name:
                    values.name,

                code:
                    values.code,

                period_number:
                    values.period_number,

                start_date:
                    values.start_date.format(
                        'YYYY-MM-DD'
                    ),

                end_date:
                    values.end_date.format(
                        'YYYY-MM-DD'
                    ),

                calendar_type:
                    values.calendar_type,

                display_start_date:
                    values.display_start_date ||
                    null,

                display_end_date:
                    values.display_end_date ||
                    null,

                is_active:
                    values.is_active,

                is_closed:
                    values.is_closed,

                remarks:
                    values.remarks ||
                    null,
            };

            if (!editing) {
                await createReportingPeriod(
                    payload
                );

                message.success(
                    'Reporting period created successfully.'
                );
            } else {
                await updateReportingPeriod(
                    editing.id,
                    payload
                );

                message.success(
                    'Reporting period updated successfully.'
                );
            }

            setDrawerOpen(false);

            await loadData(
                selectedFiscalYearId
            );
        } catch (error: any) {
            if (error?.errorFields) {
                return;
            }

            message.error(
                error?.response?.data?.message ||
                    'Failed to save reporting period.'
            );
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: 'period_number',
            key: 'period_number',
            width: 80,
        },
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
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
        },
        {
            title: 'Calendar',
            key: 'calendar_type',
            render: (
                _: unknown,
                record: ReportingPeriod
            ) => {
                if (
                    record.calendar_type ===
                    'ethiopian'
                ) {
                    return (
                        <Tag color="green">
                            Ethiopian
                        </Tag>
                    );
                }

                if (
                    record.calendar_type ===
                    'custom'
                ) {
                    return (
                        <Tag color="orange">
                            Custom
                        </Tag>
                    );
                }

                return (
                    <Tag color="blue">
                        Gregorian
                    </Tag>
                );
            },
        },
        {
            title: 'Display Range',
            key: 'display_range',
            render: (
                _: unknown,
                record: ReportingPeriod
            ) => {
                if (
                    !record.display_start_date &&
                    !record.display_end_date
                ) {
                    return '-';
                }

                return `${
                    record.display_start_date ||
                    ''
                } - ${
                    record.display_end_date ||
                    ''
                }`;
            },
        },
        {
            title: 'Status',
            key: 'is_active',
            render: (
                _: unknown,
                record: ReportingPeriod
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
            title: 'Closed',
            key: 'is_closed',
            render: (
                _: unknown,
                record: ReportingPeriod
            ) =>
                record.is_closed ? (
                    <Tag color="red">
                        Closed
                    </Tag>
                ) : (
                    <Tag>
                        Open
                    </Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (
                _: unknown,
                record: ReportingPeriod
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
                title="Reporting Periods"
                extra={
                    <Space>
                        <Select
                            style={{
                                width: 220,
                            }}
                            value={
                                selectedFiscalYearId
                            }
                            placeholder="Select Fiscal Year"
                            onChange={
                                setSelectedFiscalYearId
                            }
                            options={fiscalYears.map(
                                (item) => ({
                                    label:
                                        item.is_current
                                            ? `${item.name} (Current)`
                                            : item.name,
                                    value:
                                        item.id,
                                })
                            )}
                        />

                        <Button
                            type="primary"
                            icon={
                                <PlusOutlined />
                            }
                            disabled={
                                !selectedFiscalYearId
                            }
                            onClick={
                                openCreate
                            }
                        >
                            New Period
                        </Button>
                    </Space>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{
                        x: 1200,
                    }}
                />
            </Card>

            <Drawer
                title={
                    editing
                        ? 'Edit Reporting Period'
                        : 'Create Reporting Period'
                }
                open={drawerOpen}
                onClose={() =>
                    setDrawerOpen(false)
                }
                width={540}
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
                        name="fiscal_year_id"
                        label="Fiscal Year"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Fiscal year is required.',
                            },
                        ]}
                    >
                        <Select
                            options={fiscalYears.map(
                                (item) => ({
                                    label:
                                        item.name,
                                    value:
                                        item.id,
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="period_number"
                        label="Period Number"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Period number is required.',
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
                        name="name"
                        label="Period Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Period name is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Meskerem" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Code"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Code is required.',
                            },
                        ]}
                    >
                        <Input placeholder="MES" />
                    </Form.Item>

                    <Form.Item
                        name="calendar_type"
                        label="Calendar Type"
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
                                        'Gregorian',
                                    value:
                                        'gregorian',
                                },
                                {
                                    label:
                                        'Ethiopian',
                                    value:
                                        'ethiopian',
                                },
                                {
                                    label:
                                        'Custom',
                                    value:
                                        'custom',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="Start Date (Gregorian)"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Start date is required.',
                            },
                        ]}
                    >
                        <DatePicker
                            style={{
                                width:
                                    '100%',
                            }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item
                        name="end_date"
                        label="End Date (Gregorian)"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'End date is required.',
                            },
                        ]}
                    >
                        <DatePicker
                            style={{
                                width:
                                    '100%',
                            }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item
                        name="display_start_date"
                        label="Display Start Date"
                        extra="Optional local-calendar display, for example 01/01/2019 E.C."
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="display_end_date"
                        label="Display End Date"
                        extra="Optional local-calendar display."
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="is_active"
                        label="Active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="is_closed"
                        label="Closed"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="remarks"
                        label="Remarks"
                    >
                        <Input.TextArea
                            rows={4}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default ReportingPeriodsPage;