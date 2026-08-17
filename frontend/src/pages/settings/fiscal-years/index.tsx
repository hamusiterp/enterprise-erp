import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    DatePicker,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    message,
} from 'antd';
import {
    EditOutlined,
    LockOutlined,
    PlusOutlined,
    StarOutlined,
    StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import {
    closeFiscalYear,
    createFiscalYear,
    getFiscalYears,
    lockFiscalYear,
    setCurrentFiscalYear,
    updateFiscalYear,
} from '../../../api/fiscalYears';

import type {
    FiscalYear,
    FiscalYearPayload,
} from '../../../api/fiscalYears';

import {
    copyFiscalYearSequences,
} from '../../../api/fiscalYears';

import {
    CopyOutlined,
} from '@ant-design/icons';

const FiscalYearsPage: React.FC = () => {
    const [form] = Form.useForm();

    const [data, setData] = useState<FiscalYear[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [copyDrawerOpen, setCopyDrawerOpen] =
    useState(false);

const [copyTarget, setCopyTarget] =
    useState<FiscalYear | null>(null);

const [sourceFiscalYearId, setSourceFiscalYearId] =
    useState<number | undefined>();

const [copying, setCopying] =
    useState(false);
    const [editing, setEditing] =
        useState<FiscalYear | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const result = await getFiscalYears();

            setData(result);
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to load fiscal years.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            is_active: true,
            is_current: false,
            status: 'open',
        });

        setDrawerOpen(true);
    };

    const openEdit = (record: FiscalYear) => {
        setEditing(record);

        form.setFieldsValue({
            name: record.name,
            code: record.code,
            start_date: dayjs(record.start_date),
            end_date: dayjs(record.end_date),
            is_active: record.is_active,
            status: record.status,
            remarks: record.remarks,
        });

        setDrawerOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            setSaving(true);

            const payload: FiscalYearPayload = {
                name: values.name,
                code: values.code,
                start_date:
                    values.start_date.format('YYYY-MM-DD'),
                end_date:
                    values.end_date.format('YYYY-MM-DD'),
                is_active: values.is_active,
                status: values.status,
                remarks: values.remarks || null,
            };

            if (!editing) {
                payload.is_current =
                    values.is_current ?? false;

                await createFiscalYear(payload);

                message.success(
                    'Fiscal year created successfully.'
                );
            } else {
                await updateFiscalYear(
                    editing.id,
                    payload
                );

                message.success(
                    'Fiscal year updated successfully.'
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
                    'Failed to save fiscal year.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSetCurrent = async (
        record: FiscalYear
    ) => {
        try {
            await setCurrentFiscalYear(record.id);

            message.success(
                'Current fiscal year updated successfully.'
            );

            await loadData();
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to set current fiscal year.'
            );
        }
    };

    const handleClose = async (
        record: FiscalYear
    ) => {
        try {
            await closeFiscalYear(record.id);

            message.success(
                'Fiscal year closed successfully.'
            );

            await loadData();
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to close fiscal year.'
            );
        }
    };

    const handleLock = async (
        record: FiscalYear
    ) => {
        try {
            await lockFiscalYear(record.id);

            message.success(
                'Fiscal year locked successfully.'
            );

            await loadData();
        } catch (error: any) {
            message.error(
                error?.response?.data?.message ||
                    'Failed to lock fiscal year.'
            );
        }
    };

    const openCopySequences = (
    record: FiscalYear
) => {
    setCopyTarget(record);

    const previous = data
        .filter(
            (item: FiscalYear) =>
                item.id !== record.id &&
                dayjs(item.end_date).isBefore(
                    dayjs(record.start_date)
                )
        )
        .sort(
            (a: FiscalYear, b: FiscalYear) =>
                dayjs(b.end_date).valueOf() -
                dayjs(a.end_date).valueOf()
        )[0];

    setSourceFiscalYearId(
        previous?.id
    );

    setCopyDrawerOpen(true);
};

const handleCopySequences = async () => {
    if (
        !copyTarget ||
        !sourceFiscalYearId
    ) {
        message.warning(
            'Please select the source fiscal year.'
        );

        return;
    }

    try {
        setCopying(true);

        const createdCount =
            await copyFiscalYearSequences(
                copyTarget.id,
                sourceFiscalYearId
            );

        if (createdCount > 0) {
            message.success(
                `${createdCount} document sequence(s) copied successfully.`
            );
        } else {
            message.info(
                'No new document sequences were copied.'
            );
        }

        setCopyDrawerOpen(false);
    } catch (error: any) {
        message.error(
            error?.response?.data?.message ||
                'Failed to copy document sequences.'
        );
    } finally {
        setCopying(false);
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
            title: 'Current',
            key: 'is_current',
            render: (_: unknown, record: FiscalYear) =>
                record.is_current ? (
                    <Tag color="green">Current</Tag>
                ) : (
                    <Tag>Not Current</Tag>
                ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: unknown, record: FiscalYear) =>
                record.status === 'open' ? (
                    <Tag color="blue">Open</Tag>
                ) : (
                    <Tag color="default">Closed</Tag>
                ),
        },
        {
            title: 'Locked',
            key: 'is_locked',
            render: (_: unknown, record: FiscalYear) =>
                record.is_locked ? (
                    <Tag color="red">Locked</Tag>
                ) : (
                    <Tag>Unlocked</Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: FiscalYear) => (
                <Space wrap>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        disabled={record.is_locked}
                        onClick={() => openEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() =>
                            openCopySequences(record)
                        }
                    >
                        Copy Sequences
                    </Button>

                    {!record.is_current &&
                        record.status === 'open' &&
                        record.is_active &&
                        !record.is_locked && (
                            <Popconfirm
                                title="Set as current fiscal year?"
                                onConfirm={() =>
                                    handleSetCurrent(
                                        record
                                    )
                                }
                            >
                                <Button
                                    size="small"
                                    icon={
                                        <StarOutlined />
                                    }
                                >
                                    Set Current
                                </Button>
                            </Popconfirm>
                        )}

                    {record.status === 'open' &&
                        !record.is_locked && (
                            <Popconfirm
                                title="Close this fiscal year?"
                                description="It will no longer be the current fiscal year."
                                onConfirm={() =>
                                    handleClose(
                                        record
                                    )
                                }
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={
                                        <StopOutlined />
                                    }
                                >
                                    Close
                                </Button>
                            </Popconfirm>
                        )}

                    {record.status === 'closed' &&
                        !record.is_locked && (
                            <Popconfirm
                                title="Lock this fiscal year?"
                                description="Locked fiscal years cannot be edited."
                                onConfirm={() =>
                                    handleLock(
                                        record
                                    )
                                }
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={
                                        <LockOutlined />
                                    }
                                >
                                    Lock
                                </Button>
                            </Popconfirm>
                        )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="Fiscal Year Management"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreate}
                    >
                        New Fiscal Year
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Drawer
    title={
        editing
            ? 'Edit Fiscal Year'
            : 'Create Fiscal Year'
    }
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    width={520}
    destroyOnHidden
    extra={
        <Space>
            <Button
                onClick={() => setDrawerOpen(false)}
            >
                Cancel
            </Button>

            <Button
                type="primary"
                loading={saving}
                onClick={handleSave}
            >
                {editing ? 'Update' : 'Save'}
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
            label="Fiscal Year Name"
            rules={[
                {
                    required: true,
                    message:
                        'Fiscal year name is required.',
                },
            ]}
        >
            <Input placeholder="FY 2026/27" />
        </Form.Item>

        <Form.Item
            name="code"
            label="Code"
            rules={[
                {
                    required: true,
                    message:
                        'Fiscal year code is required.',
                },
            ]}
        >
            <Input placeholder="2026-27" />
        </Form.Item>

        <Form.Item
            name="start_date"
            label="Start Date"
            rules={[
                {
                    required: true,
                    message:
                        'Start date is required.',
                },
            ]}
        >
            <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
            />
        </Form.Item>

        <Form.Item
            name="end_date"
            label="End Date"
            rules={[
                {
                    required: true,
                    message:
                        'End date is required.',
                },
            ]}
        >
            <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
            />
        </Form.Item>

        {!editing && (
            <Form.Item
                name="is_current"
                label="Set as Current Fiscal Year"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
        )}

        <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>

        <Form.Item
            name="status"
            label="Status"
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Select
                options={[
                    {
                        label: 'Open',
                        value: 'open',
                    },
                    {
                        label: 'Closed',
                        value: 'closed',
                    },
                ]}
            />
        </Form.Item>

        <Form.Item
            name="remarks"
            label="Remarks"
        >
            <Input.TextArea rows={4} />
        </Form.Item>
    </Form>
</Drawer>
<Drawer
    title="Copy Document Sequences"
    open={copyDrawerOpen}
    onClose={() =>
        setCopyDrawerOpen(false)
    }
    width={480}
    extra={
        <Space>
            <Button
                onClick={() =>
                    setCopyDrawerOpen(false)
                }
            >
                Cancel
            </Button>

            <Button
                type="primary"
                loading={copying}
                onClick={
                    handleCopySequences
                }
            >
                Copy Sequences
            </Button>
        </Space>
    }
>
    <Form layout="vertical">
        <Form.Item
            label="Target Fiscal Year"
        >
            <Input
                value={
                    copyTarget?.name || ''
                }
                disabled
            />
        </Form.Item>

        <Form.Item
            label="Copy From Fiscal Year"
            required
        >
            <Select
                value={
                    sourceFiscalYearId
                }
                placeholder="Select source fiscal year"
                onChange={
                    setSourceFiscalYearId
                }
                options={data
    .filter(
        (item: FiscalYear) =>
            item.id !==
            copyTarget?.id
    )
    .map(
        (item: FiscalYear) => ({
            label: item.name,
            value: item.id,
        })
    )}
            />
        </Form.Item>

        <div
            style={{
                padding: 12,
                background: '#fafafa',
                borderRadius: 8,
            }}
        >
            Only sequences configured to reset per fiscal year will be copied.
            Existing sequences in the target year will not be overwritten.
            Counters will start from 0.
        </div>
    </Form>
</Drawer>
        </div>
    );
};

export default FiscalYearsPage;