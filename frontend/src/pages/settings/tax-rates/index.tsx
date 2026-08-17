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
    createTaxRate,
    getTaxRates,
    updateTaxRate,
} from '../../../api/taxRates';

import type {
    TaxRate,
    TaxRatePayload,
} from '../../../api/taxRates';

import {
    getFiscalYears,
} from '../../../api/fiscalYears';

import type {
    FiscalYear,
} from '../../../api/fiscalYears';

const TaxRatesPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] =
        useState<TaxRate[]>([]);

    const [fiscalYears, setFiscalYears] =
        useState<FiscalYear[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editing, setEditing] =
        useState<TaxRate | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const result =
                await getTaxRates();

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load tax rates.'
            );
        } finally {
            setLoading(false);
        }
    };

    const loadFiscalYears = async () => {
        try {
            const result =
                await getFiscalYears();

            setFiscalYears(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load fiscal years.'
            );
        }
    };

    useEffect(() => {
        loadData();
        loadFiscalYears();
    }, []);

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            calculation_method: 'add',
            is_active: true,
            is_default: false,
        });

        setDrawerOpen(true);
    };

    const openEdit = (
        record: TaxRate
    ) => {
        setEditing(record);

        form.setFieldsValue({
            code: record.code,
            name: record.name,
            type: record.type,
            rate: Number(record.rate),
            country_code:
                record.country_code,
            effective_from:
                dayjs(
                    record.effective_from
                ),
            effective_to:
                record.effective_to
                    ? dayjs(
                          record.effective_to
                      )
                    : null,
            fiscal_year_id:
                record.fiscal_year_id,
            calculation_method:
                record.calculation_method,
            is_active:
                record.is_active,
            is_default:
                record.is_default,
            description:
                record.description,
        });

        setDrawerOpen(true);
    };

    const handleSave = async () => {
        try {
            const values =
                await form.validateFields();

            setSaving(true);

            const payload:
                TaxRatePayload = {
                code:
                    values.code,
                name:
                    values.name,
                type:
                    values.type,
                rate:
                    Number(values.rate),

                country_code:
                    values.country_code ||
                    null,

                effective_from:
                    values.effective_from.format(
                        'YYYY-MM-DD'
                    ),

                effective_to:
                    values.effective_to
                        ? values.effective_to.format(
                              'YYYY-MM-DD'
                          )
                        : null,

                fiscal_year_id:
                    values.fiscal_year_id ||
                    null,

                calculation_method:
                    values.calculation_method,

                is_active:
                    values.is_active,

                is_default:
                    values.is_default,

                description:
                    values.description ||
                    null,
            };

            if (!editing) {
                await createTaxRate(
                    payload
                );

                message.success(
                    'Tax rate created successfully.'
                );
            } else {
                await updateTaxRate(
                    editing.id,
                    payload
                );

                message.success(
                    'Tax rate updated successfully.'
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
                    'Failed to save tax rate.'
            );
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Rate',
            key: 'rate',
            render: (
                _: unknown,
                record: TaxRate
            ) => (
                <strong>
                    {Number(
                        record.rate
                    ).toFixed(2)}
                    %
                </strong>
            ),
        },
        {
            title: 'Method',
            key: 'calculation_method',
            render: (
                _: unknown,
                record: TaxRate
            ) => {
                if (
                    record.calculation_method ===
                    'add'
                ) {
                    return (
                        <Tag color="green">
                            Add
                        </Tag>
                    );
                }

                if (
                    record.calculation_method ===
                    'deduct'
                ) {
                    return (
                        <Tag color="orange">
                            Deduct
                        </Tag>
                    );
                }

                return (
                    <Tag>
                        Information
                    </Tag>
                );
            },
        },
        {
            title: 'Effective From',
            dataIndex:
                'effective_from',
            key: 'effective_from',
        },
        {
            title: 'Effective To',
            key: 'effective_to',
            render: (
                _: unknown,
                record: TaxRate
            ) =>
                record.effective_to ||
                'Ongoing',
        },
        {
            title: 'Country',
            key: 'country_code',
            render: (
                _: unknown,
                record: TaxRate
            ) =>
                record.country_code ||
                'Global',
        },
        {
            title: 'Fiscal Year',
            key: 'fiscal_year',
            render: (
                _: unknown,
                record: TaxRate
            ) =>
                record.fiscal_year?.name ||
                'All',
        },
        {
            title: 'Default',
            key: 'is_default',
            render: (
                _: unknown,
                record: TaxRate
            ) =>
                record.is_default ? (
                    <Tag color="blue">
                        Default
                    </Tag>
                ) : (
                    <Tag>No</Tag>
                ),
        },
        {
            title: 'Status',
            key: 'is_active',
            render: (
                _: unknown,
                record: TaxRate
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
            fixed: 'right' as const,
            render: (
                _: unknown,
                record: TaxRate
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
                title="Tax & Statutory Rates"
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
                        New Tax Rate
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{
                        x: 1400,
                    }}
                />
            </Card>

            <Drawer
                title={
                    editing
                        ? 'Edit Tax Rate'
                        : 'Create Tax Rate'
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
                        <Input placeholder="VAT" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Name is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Value Added Tax" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Type is required.',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            options={[
                                {
                                    label:
                                        'VAT',
                                    value:
                                        'vat',
                                },
                                {
                                    label:
                                        'Withholding',
                                    value:
                                        'withholding',
                                },
                                {
                                    label:
                                        'Pension Employee',
                                    value:
                                        'pension_employee',
                                },
                                {
                                    label:
                                        'Pension Employer',
                                    value:
                                        'pension_employer',
                                },
                                {
                                    label:
                                        'Levy',
                                    value:
                                        'levy',
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
                        name="rate"
                        label="Rate (%)"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Rate is required.',
                            },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            precision={4}
                            style={{
                                width:
                                    '100%',
                            }}
                            addonAfter="%"
                        />
                    </Form.Item>

                    <Form.Item
                        name="calculation_method"
                        label="Calculation Method"
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
                                        'Add to Amount',
                                    value:
                                        'add',
                                },
                                {
                                    label:
                                        'Deduct from Amount',
                                    value:
                                        'deduct',
                                },
                                {
                                    label:
                                        'Information Only',
                                    value:
                                        'info',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="country_code"
                        label="Country Code"
                        extra="Leave empty if this rate applies globally."
                    >
                        <Input
                            placeholder="ET"
                            maxLength={10}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fiscal_year_id"
                        label="Fiscal Year"
                        extra="Leave empty if the rate is not restricted to one fiscal year."
                    >
                        <Select
                            allowClear
                            placeholder="All Fiscal Years"
                            options={fiscalYears.map(
                                (
                                    item
                                ) => ({
                                    label:
                                        item.name,
                                    value:
                                        item.id,
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="effective_from"
                        label="Effective From"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Effective date is required.',
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
                        name="effective_to"
                        label="Effective To"
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
                        name="is_default"
                        label="Default Rate"
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
                        name="description"
                        label="Description"
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

export default TaxRatesPage;