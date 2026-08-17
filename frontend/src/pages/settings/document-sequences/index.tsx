import React, { useEffect, useMemo, useState } from 'react';
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
    createDocumentSequence,
    getDocumentSequences,
    updateDocumentSequence,
} from '../../../api/documentSequences';

import type {
    DocumentSequence,
    DocumentSequencePayload,
} from '../../../api/documentSequences';

import {
    getFiscalYears,
} from '../../../api/fiscalYears';

import type {
    FiscalYear,
} from '../../../api/fiscalYears';

const DocumentSequencesPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] =
        useState<DocumentSequence[]>([]);

    const [fiscalYears, setFiscalYears] =
        useState<FiscalYear[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [editing, setEditing] =
        useState<DocumentSequence | null>(null);

    const [selectedFiscalYearId, setSelectedFiscalYearId] =
        useState<number | undefined>();

    const loadFiscalYears = async () => {
        try {
            const result = await getFiscalYears();

            setFiscalYears(result);

            const current = result.find(
                (item) => item.is_current
            );

            if (current) {
                setSelectedFiscalYearId(current.id);
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
                await getDocumentSequences(
                    fiscalYearId
                );

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load document sequences.'
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
            loadData(selectedFiscalYearId);
        }
    }, [selectedFiscalYearId]);

    const currentFiscalYear = useMemo(
        () =>
            fiscalYears.find(
                (item) =>
                    item.id ===
                    selectedFiscalYearId
            ),
        [
            fiscalYears,
            selectedFiscalYearId,
        ]
    );

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            fiscal_year_id:
                selectedFiscalYearId,
            current_number: 0,
            number_length: 6,
            format:
                '{PREFIX}/{FY}/{NUMBER}',
            reset_per_fiscal_year: true,
            is_active: true,
        });

        setDrawerOpen(true);
    };

    const openEdit = (
        record: DocumentSequence
    ) => {
        setEditing(record);

        form.setFieldsValue({
            document_type:
                record.document_type,
            name: record.name,
            prefix: record.prefix,
            fiscal_year_id:
                record.fiscal_year_id,
            current_number:
                record.current_number,
            number_length:
                record.number_length,
            format: record.format,
            reset_per_fiscal_year:
                record.reset_per_fiscal_year,
            is_active:
                record.is_active,
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
                DocumentSequencePayload = {
                document_type:
                    values.document_type,
                name:
                    values.name,
                prefix:
                    values.prefix,
                fiscal_year_id:
                    values.fiscal_year_id,
                number_length:
                    values.number_length,
                format:
                    values.format,
                reset_per_fiscal_year:
                    values.reset_per_fiscal_year,
                is_active:
                    values.is_active,
                remarks:
                    values.remarks || null,
            };

            if (!editing) {
                payload.current_number =
                    values.current_number ?? 0;

                await createDocumentSequence(
                    payload
                );

                message.success(
                    'Document sequence created successfully.'
                );
            } else {
                await updateDocumentSequence(
                    editing.id,
                    payload
                );

                message.success(
                    'Document sequence updated successfully.'
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
                    'Failed to save document sequence.'
            );
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Document',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'document_type',
            key: 'document_type',
        },
        {
            title: 'Prefix',
            dataIndex: 'prefix',
            key: 'prefix',
        },
        {
            title: 'Format',
            dataIndex: 'format',
            key: 'format',
        },
        {
            title: 'Current No.',
            dataIndex: 'current_number',
            key: 'current_number',
        },
        {
            title: 'Digits',
            dataIndex: 'number_length',
            key: 'number_length',
        },
        {
            title: 'Reset / FY',
            key: 'reset_per_fiscal_year',
            render: (
                _: unknown,
                record: DocumentSequence
            ) =>
                record.reset_per_fiscal_year ? (
                    <Tag color="green">
                        Yes
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
                record: DocumentSequence
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
                record: DocumentSequence
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
                title="Document Numbering & Sequences"
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
                            onClick={
                                openCreate
                            }
                            disabled={
                                !selectedFiscalYearId
                            }
                        >
                            New Sequence
                        </Button>
                    </Space>
                }
            >
                {currentFiscalYear && (
                    <div
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <Tag
                            color={
                                currentFiscalYear.is_current
                                    ? 'green'
                                    : 'blue'
                            }
                        >
                            {
                                currentFiscalYear.name
                            }
                        </Tag>
                    </div>
                )}

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{
                        x: 1100,
                    }}
                />
            </Card>

            <Drawer
                title={
                    editing
                        ? 'Edit Document Sequence'
                        : 'Create Document Sequence'
                }
                open={drawerOpen}
                onClose={() =>
                    setDrawerOpen(false)
                }
                width={520}
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
                        name="document_type"
                        label="Document Type"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Document type is required.',
                            },
                        ]}
                    >
                        <Input placeholder="store_requisition" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Document Name"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Document name is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Store Requisition" />
                    </Form.Item>

                    <Form.Item
                        name="prefix"
                        label="Prefix"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Prefix is required.',
                            },
                        ]}
                    >
                        <Input placeholder="SR" />
                    </Form.Item>

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

                    {!editing && (
                        <Form.Item
                            name="current_number"
                            label="Starting Counter"
                        >
                            <InputNumber
                                min={0}
                                style={{
                                    width:
                                        '100%',
                                }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="number_length"
                        label="Number Length"
                        rules={[
                            {
                                required:
                                    true,
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={20}
                            style={{
                                width:
                                    '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="format"
                        label="Number Format"
                        rules={[
                            {
                                required:
                                    true,
                                message:
                                    'Number format is required.',
                            },
                        ]}
                        extra="Available placeholders: {PREFIX}, {FY}, {NUMBER}"
                    >
                        <Input placeholder="{PREFIX}/{FY}/{NUMBER}" />
                    </Form.Item>

                    <Form.Item
                        name="reset_per_fiscal_year"
                        label="Reset Every Fiscal Year"
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

export default DocumentSequencesPage;