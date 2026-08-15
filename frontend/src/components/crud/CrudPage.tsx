import {
    CheckCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    RestOutlined,
    SearchOutlined,
    StopOutlined,
    UndoOutlined,
} from '@ant-design/icons';

import {
    App,
    Button,
    Card,
    Drawer,
    Empty,
    Form,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd';

import type {
    FormInstance,
    TablePaginationConfig,
    TableProps,
} from 'antd';

import axios from 'axios';

import {
    
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import CrudStatusTag from './CrudStatusTag';

import type {
    CrudPageProps,
    CrudRecord,
    CrudStatus,
    CrudStatisticsData,
} from './crudTypes';

import '../../styles/crud.css';

import CrudStatistics from './CrudStatistics';





const {
    Title,
    Text,
} = Typography;

type DrawerMode =
    | 'create'
    | 'edit'
    | 'view';

interface ValidationErrorResponse {
    message?: string;
    errors?: Record<
        string,
        string[]
    >;
}

interface CrudListResponse<TRecord> {
    data: TRecord[];
    meta?: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
}

interface CrudActionResponse {
    message: string;
}

interface RecycleBinApi<TRecord> {
    fetchDeleted?: (params?: {
        page?: number;
        per_page?: number;
        search?: string;
    }) => Promise<CrudListResponse<TRecord>>;

    restore?: (
        id: number,
    ) => Promise<CrudActionResponse>;

    forceDelete?: (
        id: number,
    ) => Promise<CrudActionResponse>;
}

interface DeletedRecordFields {
    deleted_at?: string | null;
}

export default function CrudPage<
    TRecord extends CrudRecord,
    TFormValues extends object,
>({
    title,
    description,
    createButtonText,
    api,
    columns,
    formFields,
    formInitialValues,
    getFormValues,
    viewContent,
    searchPlaceholder = 'Search...',
    defaultSortBy = 'created_at',
    canChangeStatus = true,
}: CrudPageProps<
    TRecord,
    TFormValues
>) {
    const [form] =
        Form.useForm<TFormValues>();

        const { message } = App.useApp();

        const [
    statistics,
    setStatistics,
] = useState<CrudStatisticsData | null>(null);

const [
    statisticsLoading,
    setStatisticsLoading,
] = useState(false);

    const recycleApi =
        api as typeof api & RecycleBinApi<TRecord>;

    const [records, setRecords] =
        useState<TRecord[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [exporting, setExporting] =
        useState(false);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [drawerMode, setDrawerMode] =
        useState<DrawerMode>('create');

    const [
        selectedRecord,
        setSelectedRecord,
    ] =
        useState<TRecord | null>(null);

    const [searchInput, setSearchInput] =
        useState('');

    const [search, setSearch] =
        useState('');

    const [status, setStatus] =
        useState<CrudStatus | ''>('');

    const [page, setPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [total, setTotal] =
        useState(0);

    const [sortBy, setSortBy] =
        useState(defaultSortBy);

    const [sortOrder, setSortOrder] =
        useState<'asc' | 'desc'>(
            'desc',
        );

    const [deletedDrawerOpen, setDeletedDrawerOpen] =
        useState(false);

    const [deletedRecords, setDeletedRecords] =
        useState<TRecord[]>([]);

    const [deletedLoading, setDeletedLoading] =
        useState(false);

    const [deletedSearchInput, setDeletedSearchInput] =
        useState('');

    const [deletedSearch, setDeletedSearch] =
        useState('');

    const [deletedPage, setDeletedPage] =
        useState(1);

    const [deletedPageSize, setDeletedPageSize] =
        useState(10);

    const [deletedTotal, setDeletedTotal] =
        useState(0);

   

    const loadRecords =
        useCallback(async () => {
            setLoading(true);

            try {
                const response =
                    await api.fetch({
                        page,
                        per_page:
                            pageSize,
                        search:
                            search ||
                            undefined,
                        status:
                            status ||
                            undefined,
                        sort_by:
                            sortBy,
                        sort_order:
                            sortOrder,
                    });

                setRecords(
                    response.data,
                );

                setTotal(
                    response.meta
                        .total,
                );
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        `Unable to load ${title.toLowerCase()}.`,
                    ),
                );
            } finally {
                setLoading(false);
            }
        }, [
            api,
            page,
            pageSize,
            search,
            status,
            sortBy,
            sortOrder,
            title,
        ]);

    const loadDeletedRecords =
        useCallback(async () => {
            if (!recycleApi.fetchDeleted) {
                return;
            }

            setDeletedLoading(true);

            try {
                const response =
                    await recycleApi.fetchDeleted({
                        page: deletedPage,
                        per_page: deletedPageSize,
                        search:
                            deletedSearch ||
                            undefined,
                    });

                setDeletedRecords(
                    response.data,
                );

                setDeletedTotal(
                    response.meta?.total ??
                        response.data.length,
                );
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        `Unable to load deleted ${title.toLowerCase()}.`,
                    ),
                );
            } finally {
                setDeletedLoading(false);
            }
        }, [
            deletedPage,
            deletedPageSize,
            deletedSearch,
            message,
            recycleApi,
            title,
        ]);

    useEffect(() => {
        void loadRecords();
    }, [loadRecords]);

    useEffect(() => {
        if (deletedDrawerOpen) {
            void loadDeletedRecords();
        }
    }, [
        deletedDrawerOpen,
        loadDeletedRecords,
    ]);

    const openCreateDrawer = () => {
        setDrawerMode('create');
        setSelectedRecord(null);

        form.resetFields();
        form.setFieldsValue(
            formInitialValues,
        );

        setDrawerOpen(true);
    };

    const openEditDrawer = (
        record: TRecord,
    ) => {
        setDrawerMode('edit');
        setSelectedRecord(record);

        form.resetFields();

        form.setFieldsValue(
            getFormValues(
                record,
            ),
        );

        setDrawerOpen(true);
    };

    const openViewDrawer = (
        record: TRecord,
    ) => {
        setDrawerMode('view');
        setSelectedRecord(record);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        if (saving) {
            return;
        }

        setDrawerOpen(false);
        setSelectedRecord(null);
        form.resetFields();

    };

    const openDeletedDrawer = () => {
        if (!recycleApi.fetchDeleted) {
            return;
        }

        setDeletedPage(1);
        setDeletedDrawerOpen(true);
    };

    const closeDeletedDrawer = () => {
        setDeletedDrawerOpen(false);
    };

    const handleSubmit =
        async () => {
            try {
                const values =
                    await form.validateFields();

                setSaving(true);

                if (
                    drawerMode ===
                        'edit' &&
                    selectedRecord
                ) {
                    await api.update(
                        selectedRecord.id,
                        values,
                    );

                    message.success(
                        `${title.slice(
                            0,
                            -1,
                        )} updated successfully.`,
                    );
                } else {
                    await api.create(
                        values,
                    );

                    message.success(
                        `${title.slice(
                            0,
                            -1,
                        )} created successfully.`,
                    );
                }

                setDrawerOpen(false);
        setSelectedRecord(null);
        form.resetFields();

        

                if (
                    drawerMode ===
                    'create'
                ) {
                    setPage(1);
                }

                await loadRecords();
                await loadStatistics();
            } catch (error) {
                if (
                    isAntDesignValidationError(
                        error,
                    )
                ) {
                    return;
                }

                applyBackendErrors(
                    form,
                    error,
                );

                message.error(
                    getErrorMessage(
                        error,
                        `Unable to save ${title
                            .slice(
                                0,
                                -1,
                            )
                            .toLowerCase()}.`,
                    ),
                );
            } finally {
                setSaving(false);
            }
        };

    const handleDelete =
        async (
            record: TRecord,
        ) => {
            try {
                const response =
                    await api.remove(
                        record.id,
                    );

                message.success(
                    response.message,
                );

                if (
                    records.length ===
                        1 &&
                    page > 1
                ) {
                    setPage(
                        page - 1,
                    );
                } else {
                    await loadRecords();
                    await loadStatistics();
                }
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        `Unable to delete ${title
                            .slice(
                                0,
                                -1,
                            )
                            .toLowerCase()}.`,
                    ),
                );
            }
        };

    const handleStatusChange =
        async (
            record: TRecord,
        ) => {
            if (
                !api.changeStatus ||
                !record.status
            ) {
                return;
            }

            const nextStatus:
                CrudStatus =
                record.status ===
                'active'
                    ? 'inactive'
                    : 'active';

            try {
                await api.changeStatus(
                    record.id,
                    nextStatus,
                );

                message.success(
                    'Status updated successfully.',
                );

                await loadRecords();
                await loadStatistics();
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        'Unable to update status.',
                    ),
                );
            }
        };

        const loadStatistics =
    useCallback(async () => {
        if (!api.fetchStatistics) {
            return;
        }

        setStatisticsLoading(true);

        try {
            const response =
                await api.fetchStatistics();

            setStatistics(response);
        } catch (error) {
            message.error(
                getErrorMessage(
                    error,
                    `Unable to load ${title.toLowerCase()} statistics.`,
                ),
            );
        } finally {
            setStatisticsLoading(false);
        }
    }, [
        api,
        message,
        title,
    ]);

    useEffect(() => {
    void loadStatistics();
}, [loadStatistics]);

    const handleRestore =
        async (
            record: TRecord,
        ) => {
            if (!recycleApi.restore) {
                return;
            }

            try {
                const response =
                    await recycleApi.restore(
                        record.id,
                    );

                message.success(
                    response.message ||
                        'Record restored successfully.',
                );

                if (
                    deletedRecords.length === 1 &&
                    deletedPage > 1
                ) {
                    setDeletedPage(
                        deletedPage - 1,
                    );
                } else {
                    await loadDeletedRecords();
                }

                await loadRecords();
                await loadStatistics();
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        'Unable to restore record.',
                    ),
                );
            }
        };

    const handleForceDelete =
        async (
            record: TRecord,
        ) => {
            if (!recycleApi.forceDelete) {
                return;
            }

            try {
                const response =
                    await recycleApi.forceDelete(
                        record.id,
                    );

                message.success(
                    response.message ||
                        'Record permanently deleted.',
                );

                if (
                    deletedRecords.length === 1 &&
                    deletedPage > 1
                ) {
                    setDeletedPage(
                        deletedPage - 1,
                    );
                } else {
                    await loadDeletedRecords();
                    await loadStatistics();
                }
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        'Unable to permanently delete record.',
                    ),
                );
            }
        };

    const handleExport =
        async () => {
            if (!api.export) {
                return;
            }

            setExporting(true);

            try {
                await api.export({
                    search:
                        search ||
                        undefined,
                    status:
                        status ||
                        undefined,
                });

                message.success(
                    `${title} exported successfully.`,
                );
            } catch (error) {
                message.error(
                    getErrorMessage(
                        error,
                        `Unable to export ${title.toLowerCase()}.`,
                    ),
                );
            } finally {
                setExporting(
                    false,
                );
            }
        };

    const handleSearch = () => {
        setPage(1);
        setSearch(
            searchInput.trim(),
        );
    };

    const handleDeletedSearch = () => {
        setDeletedPage(1);
        setDeletedSearch(
            deletedSearchInput.trim(),
        );
    };

    const handleDeletedReset = () => {
        setDeletedSearchInput('');
        setDeletedSearch('');
        setDeletedPage(1);
    };

    const handleReset = () => {
        setSearchInput('');
        setSearch('');
        setStatus('');
        setPage(1);
        setSortBy(
            defaultSortBy,
        );
        setSortOrder('desc');
    };

    const handleTableChange:
        TableProps<TRecord>['onChange'] =
        (
            pagination,
            _filters,
            sorter,
        ) => {
            const tablePagination =
                pagination as TablePaginationConfig;

            setPage(
                tablePagination.current ??
                    1,
            );

            setPageSize(
                tablePagination.pageSize ??
                    10,
            );

            if (
                !Array.isArray(
                    sorter,
                ) &&
                sorter.field
            ) {
                setSortBy(
                    String(
                        sorter.field,
                    ),
                );

                setSortOrder(
                    sorter.order ===
                        'ascend'
                        ? 'asc'
                        : 'desc',
                );
            }
        };

    const handleDeletedTableChange:
        TableProps<TRecord>['onChange'] =
        (pagination) => {
            const tablePagination =
                pagination as TablePaginationConfig;

            setDeletedPage(
                tablePagination.current ?? 1,
            );

            setDeletedPageSize(
                tablePagination.pageSize ?? 10,
            );
        };

    const actionColumn =
        useMemo<
            NonNullable<
                TableProps<TRecord>['columns']
            >[number]
        >(
            () => ({
                title: 'Actions',
                key: 'actions',
                width: 180,
                fixed: 'right',
                render: (
                    _value,
                    record,
                ) => (
                    <Space size={2}>
                        {viewContent && (
                            <Tooltip title="View">
                                <Button
                                    type="text"
                                    icon={
                                        <EyeOutlined />
                                    }
                                    onClick={() =>
                                        openViewDrawer(
                                            record,
                                        )
                                    }
                                />
                            </Tooltip>
                        )}

                        <Tooltip title="Edit">
                            <Button
                                type="text"
                                icon={
                                    <EditOutlined />
                                }
                                onClick={() =>
                                    openEditDrawer(
                                        record,
                                    )
                                }
                            />
                        </Tooltip>

                        {canChangeStatus &&
                            api.changeStatus &&
                            record.status && (
                                <Popconfirm
                                    title={
                                        record.status ===
                                        'active'
                                            ? 'Deactivate this record?'
                                            : 'Activate this record?'
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={() =>
                                        void handleStatusChange(
                                            record,
                                        )
                                    }
                                >
                                    <Tooltip
                                        title={
                                            record.status ===
                                            'active'
                                                ? 'Deactivate'
                                                : 'Activate'
                                        }
                                    >
                                        <Button
                                            type="text"
                                            icon={
                                                record.status ===
                                                'active' ? (
                                                    <StopOutlined />
                                                ) : (
                                                    <CheckCircleOutlined />
                                                )
                                            }
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            )}

                        <Popconfirm
                            title="Delete this record?"
                            description="The record will be moved to deleted records."
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{
                                danger: true,
                            }}
                            onConfirm={() =>
                                void handleDelete(
                                    record,
                                )
                            }
                        >
                            <Tooltip title="Delete">
                                <Button
                                    type="text"
                                    danger
                                    icon={
                                        <DeleteOutlined />
                                    }
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                ),
            }),
            [
                api.changeStatus,
                canChangeStatus,
                viewContent,
            ],
        );

    const deletedActionColumn =
        useMemo<
            NonNullable<
                TableProps<TRecord>['columns']
            >[number]
        >(
            () => ({
                title: 'Actions',
                key: 'deleted_actions',
                width: 210,
                fixed: 'right',
                render: (
                    _value,
                    record,
                ) => (
                    <Space size={2}>
                        {recycleApi.restore && (
                            <Popconfirm
                                title="Restore this record?"
                                description="The record will return to the active list."
                                okText="Restore"
                                cancelText="Cancel"
                                onConfirm={() =>
                                    void handleRestore(
                                        record,
                                    )
                                }
                            >
                                <Tooltip title="Restore">
                                    <Button
                                        type="text"
                                        icon={
                                            <UndoOutlined />
                                        }
                                    />
                                </Tooltip>
                            </Popconfirm>
                        )}

                        {recycleApi.forceDelete && (
                            <Popconfirm
                                title="Permanently delete this record?"
                                description="This action cannot be undone."
                                okText="Delete Permanently"
                                cancelText="Cancel"
                                okButtonProps={{
                                    danger: true,
                                }}
                                onConfirm={() =>
                                    void handleForceDelete(
                                        record,
                                    )
                                }
                            >
                                <Tooltip title="Delete Permanently">
                                    <Button
                                        type="text"
                                        danger
                                        icon={
                                            <DeleteOutlined />
                                        }
                                    />
                                </Tooltip>
                            </Popconfirm>
                        )}
                    </Space>
                ),
            }),
            [
                recycleApi.forceDelete,
                recycleApi.restore,
            ],
        );

    const finalColumns =
        useMemo(() => {
            return [
                ...(columns ?? []),
                actionColumn,
            ];
        }, [
            columns,
            actionColumn,
        ]);

    const deletedColumns =
        useMemo<
            TableProps<TRecord>['columns']
        >(() => {
            return [
                ...(columns ?? []),
                {
                    title: 'Deleted At',
                    key: 'deleted_at',
                    width: 180,
                    render: (
                        _value,
                        record,
                    ) =>
                        formatDateTime(
                            (
                                record as TRecord &
                                    DeletedRecordFields
                            ).deleted_at,
                        ),
                },
                deletedActionColumn,
            ];
        }, [
            columns,
            deletedActionColumn,
        ]);

    const hasRecycleBin =
        Boolean(
            recycleApi.fetchDeleted,
        );

    return (
        <div className="crud-page">
            <div className="crud-header">
                <div>
                    <Title
                        level={2}
                        className="crud-title"
                    >
                        {title}
                    </Title>

                    {description && (
                        <Text type="secondary">
                            {description}
                        </Text>
                    )}
                </div>

                <Space wrap>
                    <Button
                        icon={
                            <ReloadOutlined />
                        }
                        loading={loading}
                        onClick={() => {
                            void loadRecords();
                            void loadStatistics();
                        }}
                    >
                        Refresh
                    </Button>

                    {hasRecycleBin && (
                        <Button
                            icon={
                                <RestOutlined />
                            }
                            onClick={
                                openDeletedDrawer
                            }
                        >
                            Deleted Records
                        </Button>
                    )}

                    {api.export && (
                        <Button
                            icon={
                                <DownloadOutlined />
                            }
                            loading={
                                exporting
                            }
                            onClick={() =>
                                void handleExport()
                            }
                        >
                            Export Excel
                        </Button>
                    )}

                    <Button
                        type="primary"
                        icon={
                            <PlusOutlined />
                        }
                        onClick={
                            openCreateDrawer
                        }
                    >
                        {createButtonText}
                    </Button>
                </Space>
            </div>

            {api.fetchStatistics && (
                <CrudStatistics
                    data={statistics}
                    loading={statisticsLoading}
                />
            )}

            <Card
                variant="borderless"
                className="crud-card"
            >
                <div className="crud-toolbar">
                    <Input
                        allowClear
                        value={
                            searchInput
                        }
                        prefix={
                            <SearchOutlined />
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        onChange={(
                            event,
                        ) =>
                            setSearchInput(
                                event.target
                                    .value,
                            )
                        }
                        onPressEnter={
                            handleSearch
                        }
                    />

                    <Select
                        value={status}
                        onChange={(
                            value:
                                | CrudStatus
                                | '',
                        ) => {
                            setStatus(
                                value,
                            );
                            setPage(1);
                        }}
                        options={[
                            {
                                value: '',
                                label:
                                    'All Statuses',
                            },
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
                            handleReset
                        }
                    >
                        Reset
                    </Button>
                </div>

                <Table<TRecord>
                    rowKey="id"
                    columns={
                        finalColumns
                    }
                    dataSource={
                        records
                    }
                    loading={loading}
                    scroll={{
                        x: 1000,
                    }}
                    pagination={{
                        current: page,
                        pageSize,
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
                            range,
                        ) =>
                            `${range[0]}-${range[1]} of ${count}`,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description={`No ${title.toLowerCase()} found`}
                            />
                        ),
                    }}
                    onChange={
                        handleTableChange
                    }
                />
            </Card>

            <Drawer
                title={
                    drawerMode ===
                    'create'
                        ? `Create ${title.slice(
                              0,
                              -1,
                          )}`
                        : drawerMode ===
                            'edit'
                          ? `Edit ${title.slice(
                                0,
                                -1,
                            )}`
                          : `${title.slice(
                                0,
                                -1,
                            )} Details`
                }
                size="large"
                open={drawerOpen}
                onClose={
                    closeDrawer
                }
                extra={
                    drawerMode ===
                    'view' ? (
                        <Button
                            onClick={
                                closeDrawer
                            }
                        >
                            Close
                        </Button>
                    ) : (
                        <Space>
                            <Button
                                disabled={
                                    saving
                                }
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
                                    void handleSubmit()
                                }
                            >
                                {drawerMode ===
                                'create'
                                    ? 'Create'
                                    : 'Save Changes'}
                            </Button>
                        </Space>
                    )
                }
            >
                {drawerMode ===
                    'view' &&
                selectedRecord &&
                viewContent ? (
                    viewContent(
                        selectedRecord,
                    )
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={
                            formInitialValues
                        }
                    >
                        {formFields}
                    </Form>
                )}
            </Drawer>

            <Drawer
                title={`Deleted ${title}`}
                size="large"
                open={deletedDrawerOpen}
                onClose={closeDeletedDrawer}
                extra={
                    <Button
                        icon={
                            <ReloadOutlined />
                        }
                        loading={deletedLoading}
                        onClick={() =>
                            void loadDeletedRecords()
                        }
                    >
                        Refresh
                    </Button>
                }
            >
                <div className="crud-toolbar">
                    <Input
                        allowClear
                        value={deletedSearchInput}
                        prefix={
                            <SearchOutlined />
                        }
                        placeholder={`Search deleted ${title.toLowerCase()}`}
                        onChange={(event) =>
                            setDeletedSearchInput(
                                event.target.value,
                            )
                        }
                        onPressEnter={
                            handleDeletedSearch
                        }
                    />

                    <Button
                        type="primary"
                        icon={
                            <SearchOutlined />
                        }
                        onClick={
                            handleDeletedSearch
                        }
                    >
                        Search
                    </Button>

                    <Button
                        onClick={
                            handleDeletedReset
                        }
                    >
                        Reset
                    </Button>
                </div>

                <Table<TRecord>
                    rowKey="id"
                    columns={deletedColumns}
                    dataSource={deletedRecords}
                    loading={deletedLoading}
                    scroll={{ x: 1100 }}
                    pagination={{
                        current: deletedPage,
                        pageSize: deletedPageSize,
                        total: deletedTotal,
                        showSizeChanger: true,
                        pageSizeOptions: [
                            5,
                            10,
                            20,
                            50,
                            100,
                        ],
                        showTotal: (
                            count,
                            range,
                        ) =>
                            `${range[0]}-${range[1]} of ${count}`,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description={`No deleted ${title.toLowerCase()} found`}
                            />
                        ),
                    }}
                    onChange={
                        handleDeletedTableChange
                    }
                />
            </Drawer>
        </div>
    );
}

function formatDateTime(
    value?: string | null,
): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
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

function isAntDesignValidationError(
    error: unknown,
): boolean {
    return (
        typeof error ===
            'object' &&
        error !== null &&
        'errorFields' in error
    );
}

function applyBackendErrors<
    TFormValues extends object,
>(
    form: FormInstance<TFormValues>,
    error: unknown,
): void {
    if (
        !axios.isAxiosError(
            error,
        )
    ) {
        return;
    }

    const response =
        error.response
            ?.data as
            | ValidationErrorResponse
            | undefined;

    if (!response?.errors) {
        return;
    }

    form.setFields(
    Object.entries(
        response.errors,
    ).map(([name, errors]) => ({
        name: [name] as any,
        errors,
    })),
);
}

function getErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (
        !axios.isAxiosError(
            error,
        )
    ) {
        return fallback;
    }

    const response =
        error.response
            ?.data as
            | ValidationErrorResponse
            | undefined;

    if (response?.message) {
        return response.message;
    }

    const firstError =
        response?.errors
            ? Object.values(
                  response.errors,
              )[0]?.[0]
            : null;

    return (
        firstError ??
        fallback
    );
}

export {
    CrudStatusTag,
};