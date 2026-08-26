import {
  App,
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  CheckCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
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

/* =========================================================
 * TYPES
 * ======================================================= */

interface StockCheckTask {
  id: number;
  status: string;
  received_at?: string | null;
  assignment_type?: string | null;
}

interface StockCheckAction {
  action: string;
  name: string;
  is_return: boolean;
  requires_remarks: boolean;
}

interface StockCheckLine
  extends StoreRequisitionLine {
  id: number;

  system_available_qty?: number | null;

  available_qty?: number | null;

  stock_status?: string | null;

  stock_checked_by?: number | null;

  stock_checked_at?: string | null;

  stock_check_remark?: string | null;
}

interface StockCheckRequisition
  extends StoreRequisition {
  sr_received_date?: string | null;
  sr_received_by?: number | null;

  items: StockCheckLine[];
}

interface StockCheckRecord {
  task: StockCheckTask;

  actions: StockCheckAction[];

  stock_management_enabled: boolean;

  requisition: StockCheckRequisition;
}

interface StockCheckListResponse {
  success: boolean;

  data: StockCheckRecord[];

  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface CheckFormLine {
  line_id: number;

  available_qty?: number | null;

  stock_check_remark?: string | null;
}

interface CheckFormValues {
  items: CheckFormLine[];

  remarks?: string | null;
}


/* =========================================================
 * HELPERS
 * ======================================================= */

function calculateStockStatus(
  availableQty: number,
  srQty: number,
): string {
  if (availableQty <= 0) {
    return 'not_available';
  }

  if (availableQty < srQty) {
    return 'partial';
  }

  return 'available';
}


function renderStockStatus(
  status?: string | null,
) {
  if (status === 'available') {
    return (
      <Tag color="green">
        Available
      </Tag>
    );
  }

  if (status === 'partial') {
    return (
      <Tag color="orange">
        Partial
      </Tag>
    );
  }

  if (
    status === 'not_available'
  ) {
    return (
      <Tag color="red">
        Not Available
      </Tag>
    );
  }

  

  return (
    <Tag>
      Not Checked
    </Tag>
  );
}


function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.substring(0, 10);
  }

  return date.toLocaleDateString();
}

function formatLabel(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}


/* =========================================================
 * COMPONENT
 * ======================================================= */

function StoreRequisitionStockCheckPage() {
  const {
    message,
  } = App.useApp();

  const [
    checkForm,
  ] =
    Form.useForm<CheckFormValues>();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    records,
    setRecords,
  ] =
    useState<StockCheckRecord[]>([]);

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
    useState<StockCheckRecord | null>(
      null,
    );

  const selectedRequisition =
    selectedRecord
      ?.requisition ??
    null;

  const stockManagementEnabled =
    selectedRecord
      ?.stock_management_enabled ??
    false;

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    confirmModalOpen,
    setConfirmModalOpen,
  ] = useState(false);

  const [
    processing,
    setProcessing,
  ] = useState(false);


  /* =======================================================
   * LOAD
   * ===================================================== */

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(
            true,
          );

          const response =
            await apiClient.get<StockCheckListResponse>(
              '/api/store-requisitions/stock-check',
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
        } catch (
          error: unknown
        ) {
          console.error(
            'Stock Balance Check load error:',
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

          const errors =
            responseError
              .response
              ?.data
              ?.errors;

          if (errors) {
            const firstError =
              Object.values(
                errors,
              ).flat()[0];

            message.error(
              firstError ??
                'Unable to load Stock Balance Check.',
            );

            return;
          }

          message.error(
            responseError
              .response
              ?.data
              ?.message ??
              'Unable to load Stock Balance Check.',
          );
        } finally {
          setLoading(
            false,
          );
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


  /* =======================================================
   * OPEN REVIEW
   * ===================================================== */

  const openRecord = (
    record: StockCheckRecord,
  ) => {
    setSelectedRecord(
      record,
    );

    const formLines =
      record
        .requisition
        .items
        .map(
          (line) => ({
            line_id:
              line.id,

            available_qty:
              record
                .stock_management_enabled
                ? Number(
                    line
                      .system_available_qty ??
                      0,
                  )
                : (
                    line
                      .available_qty ??
                    null
                  ),

            stock_check_remark:
              line
                .stock_check_remark ??
              null,
          }),
        );

    checkForm.setFieldsValue({
      items:
        formLines,

      remarks:
        null,
    });

    setDrawerOpen(
      true,
    );
  };


  /* =======================================================
   * COMPLETE ACTION
   * ===================================================== */

  const completeAction =
    selectedRecord
      ?.actions
      ?.find(
        (action) =>
          !action.is_return,
      ) ??
    null;


  /* =======================================================
   * SUBMIT
   * ===================================================== */

  const submitStockCheck =
    async () => {
      if (
        !selectedRecord
      ) {
        return;
      }

      if (
        !completeAction
      ) {
        message.error(
          'No Stock Balance Check workflow transition is configured.',
        );

        return;
      }

      try {
        const values =
          await checkForm.validateFields();

        setProcessing(
          true,
        );

        const response =
          await apiClient.post(
            `/api/store-requisitions/stock-check/${selectedRecord.task.id}/check`,
            {
              action:
                completeAction.action,

              remarks:
                values.remarks
                  ?.trim() ||
                null,

              items:
                values.items.map(
                  (line) => ({
                    line_id:
                      line.line_id,

                    available_qty:
                      line.available_qty,

                    stock_check_remark:
                      line
                        .stock_check_remark
                        ?.trim() ||
                      null,
                  }),
                ),
            },
          );

        message.success(
          response.data
            ?.message ??
            'Stock Balance Check completed successfully.',
        );

        setConfirmModalOpen(
          false,
        );

        setDrawerOpen(
          false,
        );

        setSelectedRecord(
          null,
        );

        checkForm.resetFields();

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
          'Stock Check submit error:',
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

        const errors =
          responseError
            .response
            ?.data
            ?.errors;

        if (errors) {
          const firstError =
            Object.values(
              errors,
            ).flat()[0];

          message.error(
            firstError ??
              'Unable to complete Stock Balance Check.',
          );

          return;
        }

        message.error(
          responseError
            .response
            ?.data
            ?.message ??
            'Unable to complete Stock Balance Check.',
        );
      } finally {
        setProcessing(
          false,
        );
      }
    };


  /* =======================================================
   * ITEM TABLE
   * ===================================================== */

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
              StockCheckLine,

            index: number,
          ) =>
            index + 1,
        },

        {
          title:
            'Item',

          key:
            'item',

          width:
            260,

          render: (
            _: unknown,

            line:
              StockCheckLine,
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
          title:
            'Unit',

          key:
            'uom',

          width:
            100,

          render: (
            _: unknown,

            line:
              StockCheckLine,
          ) => {
            const uom =
              line
                .unit_of_measurement ??
              line.uom;

            return (
              uom?.symbol ||
              uom?.code ||
              uom?.name ||
              '-'
            );
          },
        },

        {
          title:
            'SR Qty',

          dataIndex:
            'sr_qty',

          key:
            'sr_qty',

          width:
            90,
        },

        {
          title:
            'Expected Delivery',

          key:
            'expected_delivery_date',

          width:
            145,

          render: (
            _: unknown,
            line: StockCheckLine,
          ) =>
            formatDate(
              line.expected_delivery_date,
            ),
        },

        {
          title:
            'Priority',

          key:
            'priority',

          width:
            105,

          render: (
            _: unknown,
            line: StockCheckLine,
          ) => (
            <Tag>
              {formatLabel(
                line.priority,
              )}
            </Tag>
          ),
        },

        {
          title:
            'Delivery Type',

          key:
            'delivery_type',

          width:
            145,

          render: (
            _: unknown,
            line: StockCheckLine,
          ) =>
            formatLabel(
              line.delivery_type,
            ),
        },

        {
          title:
            'SR Remark',

          key:
            'sr_remark',

          width:
            180,

          render: (
            _: unknown,
            line: StockCheckLine,
          ) =>
            line.remark || '-',
        },

        {
          title:
            'Available Qty',

          key:
            'available_qty',

          width:
            150,

          render: (
            _: unknown,

            line:
              StockCheckLine,

            index:
              number,
          ) => {
            const automatic =
              stockManagementEnabled;

            return (
              <>
                <Form.Item
                  name={[
                    'items',
                    index,
                    'line_id',
                  ]}
                  hidden
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name={[
                    'items',
                    index,
                    'available_qty',
                  ]}
                  style={{
                    marginBottom:
                      0,
                  }}
                  rules={[
                    {
                      required:
                        !automatic,

                      message:
                        'Enter available quantity.',
                    },
                    {
                      type:
                        'number',

                      min:
                        0,

                      message:
                        'Quantity cannot be negative.',
                    },
                  ]}
                >
                  <InputNumber
                    min={0}

                    precision={
                      4
                    }

                    style={{
                      width:
                        '100%',
                    }}

                    disabled={
                      automatic
                    }
                  />
                </Form.Item>
              </>
            );
          },
        },

        {
  title: 'Result',

  key: 'result',

  width: 130,

  render: (
    _: unknown,

    line: StockCheckLine,

    index: number,
  ) => (
    <Form.Item
      noStyle
      shouldUpdate
    >
      {() => {
        const availableQty =
          checkForm.getFieldValue([
            'items',
            index,
            'available_qty',
          ]);

        const status =
          calculateStockStatus(
            Number(
              availableQty ?? 0,
            ),
            Number(
              line.sr_qty,
            ),
          );

        return renderStockStatus(
          status,
        );
      }}
    </Form.Item>
  ),
},

        {
          title:
            'Remark',

          key:
            'remark',

          width:
            220,

          render: (
            _: unknown,

            __:
              StockCheckLine,

            index:
              number,
          ) => (
            <Form.Item
              name={[
                'items',
                index,
                'stock_check_remark',
              ]}
              style={{
                marginBottom:
                  0,
              }}
            >
              <Input
                placeholder="Optional"
                maxLength={
                  500
                }
              />
            </Form.Item>
          ),
        },
      ],
      [
        checkForm,
        stockManagementEnabled,
      ],
    );


  /* =======================================================
   * QUEUE TABLE
   * ===================================================== */

  const columns = [
    {
      title:
        'SR No.',

      key:
        'sr_no',

      width:
        180,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
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
      title:
        'Requested By',

      key:
        'requested_by',

      width:
        180,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
      ) =>
        record
          .requisition
          .requester
          ?.name ??
        '-',
    },

    {
      title:
        'From',

      key:
        'from',

      width:
        180,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
      ) =>
        record
          .requisition
          .from_department
          ?.department_name ??
        '-',
    },

    {
      title:
        'Items',

      key:
        'items',

      width:
        80,

      align:
        'center' as const,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
      ) =>
        record
          .requisition
          .items
          ?.length ??
        0,
    },

    {
      title:
        'Stock Mode',

      key:
        'stock_mode',

      width:
        150,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
      ) =>
        record
          .stock_management_enabled
          ? (
            <Tag color="blue">
              Registered Stock
            </Tag>
          )
          : (
            <Tag color="gold">
              Manual
            </Tag>
          ),
    },

    {
      title:
        'Action',

      key:
        'action',

      width:
        110,

      fixed:
        'right' as const,

      render: (
        _: unknown,

        record:
          StockCheckRecord,
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
          Check
        </Button>
      ),
    },
  ];




  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <>
      <Card>
        <div
          style={{
            display:
              'flex',

            justifyContent:
              'space-between',

            alignItems:
              'center',

            flexWrap:
              'wrap',

            gap:
              16,

            marginBottom:
              20,
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                margin:
                  0,
              }}
            >
              Stock Balance Check
            </Title>

            <Text
              type="secondary"
            >
              Check stock availability
              against approved Store
              Requisitions.
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
            marginBottom:
              20,
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
              width:
                330,
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
              setSearchInput(
                '',
              );

              setSearch(
                '',
              );

              setPage(
                1,
              );
            }}
          >
            Reset
          </Button>
        </Space>

        <Table
          rowKey={(
            record,
          ) =>
            record
              .task
              .id
          }

          loading={
            loading
          }

          dataSource={
            records
          }

          columns={
            columns
          }

          scroll={{
            x:
              1050,
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

            showTotal: (
              value,
            ) =>
              `Total ${value} Stock Balance Checks`,

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

                setPage(
                  1,
                );
              }
            },
          }}
        />
      </Card>


      {/* REVIEW DRAWER */}

      <Drawer
        title={
          selectedRequisition
            ? `Stock Check - ${selectedRequisition.sr_no}`
            : 'Stock Balance Check'
        }

        open={
          drawerOpen
        }

        width={
          1100
        }

        zIndex={
          1000
        }

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

          checkForm.resetFields();
        }}

        extra={
          selectedRecord
            ? (
              <Button
                type="primary"

                icon={
                  <CheckCircleOutlined />
                }

                onClick={() =>
                  setConfirmModalOpen(
                    true,
                  )
                }
              >
                Complete Check
              </Button>
            )
            : null
        }
      >
        {selectedRequisition && (
          <>
            <Descriptions
              bordered
              size="small"
              column={
                3
              }
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
                label="SR Date"
              >
                {formatDate(
                  selectedRequisition
                    .sr_date,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Request Type"
              >
                {formatLabel(
                  selectedRequisition
                    .request_type,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Used For"
              >
                {formatLabel(
                  selectedRequisition
                    .used_for,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  selectedRequisition
                    .used_for ===
                  'project'
                    ? 'Project'
                    : 'Department'
                }
              >
                {selectedRequisition
                  .used_for ===
                'project'
                  ? (
                    selectedRequisition
                      .project
                      ?.project_name ??
                    '-'
                  )
                  : (
                    selectedRequisition
                      .used_for_department
                      ?.department_name ??
                    '-'
                  )}
              </Descriptions.Item>

              <Descriptions.Item
                label="To"
              >
                {selectedRequisition
                  .to_location ||
                  '-'}
              </Descriptions.Item>

              <Descriptions.Item
                label="Stock Management"
              >
                {
                  stockManagementEnabled
                    ? (
                      <Tag color="blue">
                        Registered Stock
                      </Tag>
                    )
                    : (
                      <Tag color="gold">
                        Manual Balance Entry
                      </Tag>
                    )
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Received Date"
              >
                {formatDate(
                  selectedRequisition
                    .sr_received_date,
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label="Items"
              >
                {
                  selectedRequisition
                    .items
                    .length
                }
              </Descriptions.Item>
            </Descriptions>

            {!stockManagementEnabled && (
              <div
                style={{
                  marginTop:
                    16,

                  padding:
                    12,

                  border:
                    '1px solid #ffe58f',

                  borderRadius:
                    6,

                  background:
                    '#fffbe6',
                }}
              >
                This company does not
                maintain stock balances
                in the ERP. Enter the
                physically available
                quantity for each item.
              </div>
            )}

            <Form<CheckFormValues>
              form={
                checkForm
              }

              layout="vertical"
            >
              <Table
                rowKey="id"

                dataSource={
                  selectedRequisition
                    .items
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
                  x:
                    1500,
                }}

                style={{
                  marginTop:
                    20,
                }}
              />

              <Form.Item
                name="remarks"

                label="Overall Remarks"

                style={{
                  marginTop:
                    20,
                }}
              >
                <Input.TextArea
                  rows={3}

                  maxLength={
                    5000
                  }

                  showCount

                  placeholder="Optional overall stock-check remarks"
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>


      {/* CONFIRM MODAL */}

      <Modal
        title="Complete Stock Balance Check"

        open={
          confirmModalOpen
        }

        zIndex={
          2000
        }

        confirmLoading={
          processing
        }

        okText="Complete Check"

        okButtonProps={{
          icon:
            <CheckCircleOutlined />,
        }}

        onCancel={() => {
          if (
            processing
          ) {
            return;
          }

          setConfirmModalOpen(
            false,
          );
        }}

        onOk={() =>
          void submitStockCheck()
        }
      >
        <Text>
          Confirm that the available
          quantities have been checked
          for all items in this Store
          Requisition.
        </Text>
      </Modal>
    </>
  );
}

export default StoreRequisitionStockCheckPage;