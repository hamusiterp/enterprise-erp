import {
  App,
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  CheckOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import apiClient from '../../../api/client';

import type {
  StoreRequisition,
  StoreRequisitionLine,
} from './types';

const {
  Title,
  Text,
} = Typography;

interface ApprovalTask {
  id: number;
  status: string;
  received_at?: string | null;
  started_at?: string | null;
  due_at?: string | null;
  assignment_type?: string | null;
}

interface ApprovalAction {
  action: string;
  name: string;
  is_return: boolean;
  requires_remarks: boolean;
}

interface ApprovalRecord {
  task: ApprovalTask;

  actions: ApprovalAction[];

  requisition: StoreRequisition;
}

interface ApprovalListResponse {
  success: boolean;

  data: ApprovalRecord[];

  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ApprovalActionResponse {
  success: boolean;
  message: string;
  data: StoreRequisition;
}

interface ActionFormValues {
  remarks?: string;
}

function StoreRequisitionApprovalsPage() {
  const {
    message,
  } = App.useApp();

  const [
    actionForm,
  ] = Form.useForm<ActionFormValues>();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    records,
    setRecords,
  ] = useState<ApprovalRecord[]>([]);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(10);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    searchInput,
    setSearchInput,
  ] = useState('');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    selectedRecord,
    setSelectedRecord,
  ] =
    useState<ApprovalRecord | null>(
      null,
    );

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    actionModalOpen,
    setActionModalOpen,
  ] = useState(false);

  const [
    selectedAction,
    setSelectedAction,
  ] =
    useState<ApprovalAction | null>(
      null,
    );

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const formatDate = (
    value?: string | null,
  ): string => {
    if (!value) {
      return '-';
    }

    return value.substring(
      0,
      10,
    );
  };

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await apiClient.get<ApprovalListResponse>(
              '/api/store-requisitions/approvals',
              {
                params: {
                  page,
                  per_page:
                    pageSize,

                  search:
                    search ||
                    undefined,
                },
              },
            );

          setRecords(
            response.data.data ??
              [],
          );

          setTotal(
            response.data.meta
              ?.total ??
              0,
          );
        } catch (error: unknown) {
  console.error(
    'Approve SR load error:',
    error,
  );

  const responseError =
    error as {
      response?: {
        status?: number;

        data?: {
          message?: string;

          errors?: Record<
            string,
            string[]
          >;
        };
      };
    };

  const backendMessage =
    responseError
      .response
      ?.data
      ?.message;

  const backendErrors =
    responseError
      .response
      ?.data
      ?.errors;

  if (backendErrors) {
    const firstError =
      Object.values(
        backendErrors,
      ).flat()[0];

    message.error(
      firstError ??
        backendMessage ??
        'Unable to load Store Requisition approvals.',
    );

    return;
  }

  message.error(
    backendMessage ??
      `Unable to load Store Requisition approvals. ${
        responseError.response?.status
          ? `(HTTP ${responseError.response.status})`
          : ''
      }`,
  );
} finally {
          setLoading(false);
        }
      },
      [
        page,
        pageSize,
        search,
        message,
      ],
    );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openRecord = (
    record: ApprovalRecord,
  ) => {
    setSelectedRecord(
      record,
    );

    setDrawerOpen(
      true,
    );
  };

  const openAction = (
    action: ApprovalAction,
  ) => {
    actionForm.resetFields();

    setSelectedAction(
      action,
    );

    setActionModalOpen(
      true,
    );
  };

  const executeAction =
    async () => {
      if (
        !selectedRecord ||
        !selectedAction
      ) {
        return;
      }

      try {
        let values:
          ActionFormValues = {};

        if (
          selectedAction
            .requires_remarks
        ) {
          values =
            await actionForm.validateFields();
        } else {
          values =
            actionForm.getFieldsValue();
        }

        setProcessing(
          true,
        );

        const response =
          await apiClient.post<ApprovalActionResponse>(
            `/api/store-requisitions/approvals/${selectedRecord.task.id}/action`,
            {
              action:
                selectedAction.action,

              remarks:
                values.remarks
                  ?.trim() ||
                null,
            },
          );

        message.success(
          response.data.message,
        );

        setActionModalOpen(
          false,
        );

        setDrawerOpen(
          false,
        );

        setSelectedAction(
          null,
        );

        setSelectedRecord(
          null,
        );

        await loadData();
      } catch (
        error: unknown
      ) {
        if (
          typeof error ===
            'object' &&
          error !== null &&
          'errorFields' in error
        ) {
          return;
        }

        console.error(
          error,
        );

        const responseError =
          error as {
            response?: {
              data?: {
                message?: string;

                errors?: Record<
                  string,
                  string[]
                >;
              };
            };
          };

        const validationErrors =
          responseError
            .response
            ?.data
            ?.errors;

        if (
          validationErrors
        ) {
          const firstError =
            Object.values(
              validationErrors,
            ).flat()[0];

          message.error(
            firstError ??
              'Unable to perform workflow action.',
          );

          return;
        }

        message.error(
          responseError
            .response
            ?.data
            ?.message ??
            'Unable to perform workflow action.',
        );
      } finally {
        setProcessing(
          false,
        );
      }
    };

  const getUsedFor = (
    requisition:
      StoreRequisition,
  ) => {
    if (
      requisition.used_for ===
      'project'
    ) {
      return requisition.project
        ? `${requisition.project.project_no} - ${requisition.project.project_name}`
        : '-';
    }

    if (
      requisition.used_for ===
      'department'
    ) {
      return (
        requisition
          .used_for_department
          ?.department_name ??
        '-'
      );
    }

    return '-';
  };

  const selectedRequisition =
    selectedRecord
      ?.requisition ??
    null;

  const itemColumns =
    useMemo(
      () => [
        {
          title: '#',
          key: 'line_no',
          width: 50,

          render: (
            _: unknown,
            __:
              StoreRequisitionLine,
            index: number,
          ) =>
            index + 1,
        },

        {
          title: 'Item',
          key: 'item',
          width: 280,

          render: (
            _: unknown,
            line:
              StoreRequisitionLine,
          ) => (
            <div>
              <Text strong>
                {
                  line.item
                    ?.item_no ??
                  '-'
                }
              </Text>

              <div>
                {
                  line.item
                    ?.item_description ??
                  '-'
                }
              </div>
            </div>
          ),
        },

        {
          title: 'Unit',
          key: 'uom',
          width: 120,

          render: (
            _: unknown,
            line:
              StoreRequisitionLine,
          ) => {
            const uom =
              line.unit_of_measurement ??
              line.uom;

            if (!uom) {
              return '-';
            }

            return (
              uom.symbol ||
              uom.code ||
              uom.name
            );
          },
        },

        {
          title: 'SR Qty',
          dataIndex:
            'sr_qty',
          key:
            'sr_qty',
          width: 100,
        },

        {
          title:
            'Expected Delivery',

          dataIndex:
            'expected_delivery_date',

          key:
            'expected_delivery_date',

          width: 140,

          render: (
            value:
              string | null,
          ) =>
            formatDate(value),
        },

        {
          title: 'Priority',
          key: 'priority',
          width: 100,

          render: (
            _: unknown,
            line:
              StoreRequisitionLine,
          ) => {
            const label =
              line.priority
                .charAt(0)
                .toUpperCase() +
              line.priority.slice(
                1,
              );

            if (
              line.priority ===
              'urgent'
            ) {
              return (
                <Tag color="red">
                  {label}
                </Tag>
              );
            }

            if (
              line.priority ===
              'high'
            ) {
              return (
                <Tag color="orange">
                  {label}
                </Tag>
              );
            }

            return (
              <Tag>
                {label}
              </Tag>
            );
          },
        },

        {
          title:
            'Delivery Type',

          key:
            'delivery_type',

          width: 140,

          render: (
            _: unknown,
            line:
              StoreRequisitionLine,
          ) =>
            line.delivery_type ===
            'over_qty_based'
              ? 'Over Qty Based'
              : 'At Any Time',
        },

        {
          title: 'Remark',

          dataIndex:
            'remark',

          key:
            'remark',

          width: 180,

          render: (
            value:
              string | null,
          ) =>
            value || '-',
        },
      ],
      [],
    );

  const columns = [
    {
      title: 'SR No.',
      key: 'sr_no',
      width: 180,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) => (
        <Text strong>
          {
            record
              .requisition
              .sr_no
          }
        </Text>
      ),
    },

    {
      title: 'SR Date',
      key: 'sr_date',
      width: 120,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        formatDate(
          record
            .requisition
            .sr_date,
        ),
    },

    {
      title:
        'Requested By',

      key:
        'requested_by',

      width: 170,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        record
          .requisition
          .requester
          ?.name ??
        '-',
    },

    {
      title: 'From',
      key:
        'from_department',
      width: 180,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        record
          .requisition
          .from_department
          ?.department_name ??
        '-',
    },

    {
      title:
        'Used For',

      key:
        'used_for',

      width: 220,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        getUsedFor(
          record.requisition,
        ),
    },

    {
      title: 'Items',
      key: 'items',
      width: 80,
      align:
        'center' as const,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        record
          .requisition
          .items
          ?.length ??
        0,
    },

    {
      title:
        'Task Status',

      key:
        'task_status',

      width: 120,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) => (
        <Tag
          color={
            record.task.status ===
            'in_progress'
              ? 'processing'
              : 'blue'
          }
        >
          {
            record.task.status ===
            'in_progress'
              ? 'In Progress'
              : 'Pending'
          }
        </Tag>
      ),
    },

    {
      title:
        'Received',

      key:
        'received',

      width: 150,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) =>
        formatDate(
          record.task
            .received_at,
        ),
    },

    {
      title: 'Action',
      key: 'action',
      width: 110,
      fixed:
        'right' as const,

      render: (
        _:
          unknown,

        record:
          ApprovalRecord,
      ) => (
        <Button
          type="primary"
          size="small"
          icon={
            <EyeOutlined />
          }
          onClick={() =>
            openRecord(
              record,
            )
          }
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap: 16,
            flexWrap:
              'wrap',
            marginBottom: 20,
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              Approve Store
              Requisitions
            </Title>

            <Text
              type="secondary"
            >
              Store
              Requisitions
              assigned to you
              for approval.
            </Text>
          </div>

          <Button
            icon={
              <ReloadOutlined />
            }
            onClick={() =>
              void loadData()
            }
          >
            Refresh
          </Button>
        </div>

        <Space
          wrap
          style={{
            marginBottom: 20,
          }}
        >
          <Input
            allowClear
            value={
              searchInput
            }
            prefix={
              <SearchOutlined />
            }
            placeholder="Search SR number or requester"
            style={{
              width: 330,
            }}
            onChange={(
              event,
            ) =>
              setSearchInput(
                event.target
                  .value,
              )
            }
            onPressEnter={() => {
              setPage(1);

              setSearch(
                searchInput
                  .trim(),
              );
            }}
          />

          <Button
            type="primary"
            icon={
              <SearchOutlined />
            }
            onClick={() => {
              setPage(1);

              setSearch(
                searchInput
                  .trim(),
              );
            }}
          >
            Search
          </Button>

          <Button
            onClick={() => {
              setSearchInput('');
              setSearch('');
              setPage(1);
            }}
          >
            Reset
          </Button>
        </Space>

        <Table
          rowKey={(
            record,
          ) =>
            record.task.id
          }
          loading={loading}
          dataSource={
            records
          }
          columns={
            columns
          }
          scroll={{
            x: 1350,
          }}
          pagination={{
            current:
              page,

            pageSize,

            total,

            showSizeChanger:
              true,

            pageSizeOptions: [
              '10',
              '20',
              '50',
              '100',
            ],

            onChange: (
              nextPage,
              nextPageSize,
            ) => {
              setPage(
                nextPage,
              );

              if (
                nextPageSize !==
                pageSize
              ) {
                setPageSize(
                  nextPageSize,
                );

                setPage(1);
              }
            },

            showTotal: (
              value,
            ) =>
              `Total ${value} approval tasks`,
          }}
        />
      </Card>

      {/* =========================
          REVIEW DRAWER
      ========================== */}

      <Drawer
        title={
          selectedRequisition
            ? `Review ${selectedRequisition.sr_no}`
            : 'Review Store Requisition'
        }
        open={
          drawerOpen
        }
        width={1000}
        zIndex={1000}
        destroyOnHidden
        onClose={() => {
          if (
            processing
          ) {
            return;
          }

          setDrawerOpen(
            false,
          );

          setSelectedRecord(
            null,
          );
        }}
        extra={
          selectedRecord ? (
            <Space>
              {selectedRecord.actions.map(
                (
                  action,
                ) => (
                  <Button
                    key={
                      action.action
                    }
                    type={
                      action.is_return
                        ? 'default'
                        : 'primary'
                    }
                    danger={
                      action.is_return
                    }
                    icon={
                      action.is_return
                        ? <UndoOutlined />
                        : <CheckOutlined />
                    }
                    onClick={() =>
                      openAction(
                        action,
                      )
                    }
                  >
                    {action.name}
                  </Button>
                ),
              )}
            </Space>
          ) : null
        }
      >
        {selectedRequisition && (
          <>
            <Descriptions
              bordered
              size="small"
              column={3}
            >
              <Descriptions.Item
                label="SR No."
              >
                <Text strong>
                  {
                    selectedRequisition
                      .sr_no
                  }
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label="SR Date"
              >
                {formatDate(
                  selectedRequisition
                    .sr_date,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="MR Requested"
              >
                {
                  selectedRequisition
                    .mr_requested
                    ? 'Yes'
                    : 'No'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Requested By"
              >
                {
                  selectedRequisition
                    .requester
                    ?.name ??
                  '-'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="From"
              >
                {
                  selectedRequisition
                    .from_department
                    ?.department_name ??
                  '-'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="To"
              >
                {
                  selectedRequisition
                    .to_location
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Used For"
                span={2}
              >
                {getUsedFor(
                  selectedRequisition,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Voucher Type"
              >
                {
                  selectedRequisition
                    .voucher_sr_type ===
                  'fuel_oil'
                    ? 'Fuel & Oil'
                    : 'Goods'
                }
              </Descriptions.Item>
            </Descriptions>

            <Table
              rowKey={(
                record,
              ) =>
                record.key ??
                `${record.item_id}`
              }
              dataSource={
                selectedRequisition
                  .items ??
                []
              }
              columns={
                itemColumns
              }
              pagination={
                false
              }
              bordered
              size="small"
              scroll={{
                x: 1100,
              }}
              style={{
                marginTop: 20,
              }}
            />

            <div
              style={{
                marginTop: 20,
                textAlign:
                  'right',
              }}
            >
              <Button
                onClick={() => {
                  window.open(
                    `/store/store-requisitions/${selectedRequisition.id}/print`,
                    '_blank',
                  );
                }}
              >
                Print SR
              </Button>
            </div>
          </>
        )}
      </Drawer>

      {/* =========================
          APPROVE / RETURN MODAL
      ========================== */}

      <Modal
        title={
          selectedAction?.name ??
          'Workflow Action'
        }
        open={
          actionModalOpen
        }
        zIndex={2000}
        confirmLoading={
          processing
        }
        okText={
          selectedAction
            ?.name ??
          'Confirm'
        }
        okButtonProps={{
          danger:
            selectedAction
              ?.is_return ??
            false,
        }}
        onCancel={() => {
          if (
            processing
          ) {
            return;
          }

          setActionModalOpen(
            false,
          );

          setSelectedAction(
            null,
          );

          actionForm.resetFields();
        }}
        onOk={() =>
          void executeAction()
        }
      >
        <Form<ActionFormValues>
          form={
            actionForm
          }
          layout="vertical"
        >
          <Form.Item
            name="remarks"
            label={
              selectedAction
                ?.is_return
                ? 'Return Reason'
                : 'Remarks'
            }
            rules={[
              {
                required:
                  selectedAction
                    ?.requires_remarks ??
                  false,

                whitespace:
                  true,

                message:
                  selectedAction
                    ?.is_return
                    ? 'Return reason is required.'
                    : 'Remarks are required.',
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={
                5000
              }
              showCount
              placeholder={
                selectedAction
                  ?.is_return
                  ? 'Explain why this Store Requisition is being returned'
                  : 'Optional approval remarks'
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StoreRequisitionApprovalsPage;