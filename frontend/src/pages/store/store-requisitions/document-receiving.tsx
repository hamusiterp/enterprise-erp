import {
  App,
  Button,
  Card,
  DatePicker,
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
  CheckCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import dayjs, {
  Dayjs,
} from 'dayjs';

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

interface ReceivingTask {
  id: number;

  status: string;

  received_at?: string | null;

  started_at?: string | null;

  assignment_type?: string | null;
}

interface ReceivingAction {
  action: string;

  name: string;

  is_return: boolean;

  requires_remarks: boolean;
}

interface ReceivingRecord {
  task: ReceivingTask;

  actions: ReceivingAction[];

  requisition: StoreRequisition;
}

interface ReceivingListResponse {
  success: boolean;

  data: ReceivingRecord[];

  meta: {
    current_page: number;

    last_page: number;

    per_page: number;

    total: number;
  };
}

interface ReceiveFormValues {
  received_date: Dayjs;

  remarks?: string;
}


/* =========================================================
 * COMPONENT
 * ======================================================= */

function StoreRequisitionDocumentReceivingPage() {
  const {
    message,
  } = App.useApp();

  const [
    receiveForm,
  ] =
    Form.useForm<ReceiveFormValues>();


  /* =======================================================
   * STATE
   * ===================================================== */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    records,
    setRecords,
  ] =
    useState<ReceivingRecord[]>([]);

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
    useState<ReceivingRecord | null>(
      null,
    );

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    receiveModalOpen,
    setReceiveModalOpen,
  ] = useState(false);

  const [
    processing,
    setProcessing,
  ] = useState(false);


  /* =======================================================
   * HELPERS
   * ===================================================== */

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


  const getUsedFor = (
    requisition:
      StoreRequisition,
  ): string => {
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


  /* =======================================================
   * LOAD QUEUE
   * ===================================================== */

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await apiClient.get<ReceivingListResponse>(
              '/api/store-requisitions/document-receiving',
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
            'Document Receiving load error:',
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
                'Unable to load Document Receiving.',
            );

            return;
          }

          message.error(
            responseError
              .response
              ?.data
              ?.message ??
              'Unable to load Document Receiving.',
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


  /* =======================================================
   * REVIEW
   * ===================================================== */

  const openRecord = (
    record: ReceivingRecord,
  ) => {
    setSelectedRecord(
      record,
    );

    setDrawerOpen(
      true,
    );
  };


  /* =======================================================
   * OPEN RECEIVE MODAL
   * ===================================================== */

  const openReceiveModal =
    () => {
      receiveForm.resetFields();

      receiveForm.setFieldsValue({
        received_date:
          dayjs(),
      });

      setReceiveModalOpen(
        true,
      );
    };


  /* =======================================================
   * FIND RECEIVE ACTION
   * ===================================================== */

  const receiveAction =
    selectedRecord
      ?.actions
      ?.find(
        (action) =>
          !action.is_return,
      ) ??
    null;


  /* =======================================================
   * RECEIVE DOCUMENT
   * ===================================================== */

  const receiveDocument =
    async () => {
      if (
        !selectedRecord
      ) {
        return;
      }

      if (
        !receiveAction
      ) {
        message.error(
          'No Receive workflow transition is configured.',
        );

        return;
      }

      try {
        const values =
          await receiveForm.validateFields();

        setProcessing(
          true,
        );

        const response =
          await apiClient.post(
            `/api/store-requisitions/document-receiving/${selectedRecord.task.id}/receive`,
            {
              action:
                receiveAction.action,

              received_date:
                values
                  .received_date
                  .format(
                    'YYYY-MM-DD',
                  ),

              remarks:
                values
                  .remarks
                  ?.trim() ||
                null,
            },
          );

        message.success(
          response.data
            ?.message ??
            'Store Requisition document received successfully.',
        );

        setReceiveModalOpen(
          false,
        );

        setDrawerOpen(
          false,
        );

        setSelectedRecord(
          null,
        );

        receiveForm.resetFields();

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
          'Receive SR error:',
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
              'Unable to receive Store Requisition.',
          );

          return;
        }

        message.error(
          responseError
            .response
            ?.data
            ?.message ??
            'Unable to receive Store Requisition.',
        );
      } finally {
        setProcessing(
          false,
        );
      }
    };


  /* =======================================================
   * ITEM COLUMNS
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

          width: 110,

          render: (
            _: unknown,

            line:
              StoreRequisitionLine,
          ) => {
            const uom =
              line
                .unit_of_measurement ??
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
          title: 'MR No.',

          key: 'mr_no',

          width: 110,

          render: (
            _: unknown,

            line:
              StoreRequisitionLine,
          ) =>
            line.mr_no ||
            '-',
        },

        {
          title: 'MR Qty',

          key: 'mr_qty',

          width: 90,

          render: (
            _: unknown,

            line:
              StoreRequisitionLine,
          ) =>
            line.mr_qty ??
            '-',
        },

        {
          title: 'SR Qty',

          dataIndex:
            'sr_qty',

          key: 'sr_qty',

          width: 90,
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
            formatDate(
              value,
            ),
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
          title: 'Remark',

          dataIndex:
            'remark',

          key: 'remark',

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


  /* =======================================================
   * MAIN TABLE
   * ===================================================== */

  const columns = [
    {
      title: 'SR No.',

      key: 'sr_no',

      width: 180,

      render: (
        _: unknown,

        record:
          ReceivingRecord,
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
        _: unknown,

        record:
          ReceivingRecord,
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
        _: unknown,

        record:
          ReceivingRecord,
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
        _: unknown,

        record:
          ReceivingRecord,
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
        _: unknown,

        record:
          ReceivingRecord,
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
        _: unknown,

        record:
          ReceivingRecord,
      ) =>
        record
          .requisition
          .items
          ?.length ??
        0,
    },

    {
      title: 'Status',

      key: 'status',

      width: 120,

      render: () => (
        <Tag color="processing">
          Awaiting Receipt
        </Tag>
      ),
    },

    {
      title: 'Action',

      key: 'action',

      width: 110,

      fixed:
        'right' as const,

      render: (
        _: unknown,

        record:
          ReceivingRecord,
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


  /* =======================================================
   * SELECTED SR
   * ===================================================== */

  const selectedRequisition =
    selectedRecord
      ?.requisition ??
    null;


  /* =======================================================
   * RENDER
   * ===================================================== */

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
              Document Receiving
              for SR
            </Title>

            <Text
              type="secondary"
            >
              Receive approved
              Store Requisition
              documents.
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
              setSearchInput(
                '',
              );

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
            x: 1250,
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
              `Total ${value} SR documents`,
          }}
        />
      </Card>


      {/* ===================================================
          REVIEW DRAWER
      ==================================================== */}

      <Drawer
        title={
          selectedRequisition
            ? `Receive ${selectedRequisition.sr_no}`
            : 'Receive Store Requisition'
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
            <Button
              type="primary"

              icon={
                <CheckCircleOutlined />
              }

              onClick={
                openReceiveModal
              }
            >
              Receive
            </Button>
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
                x: 1050,
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


      {/* ===================================================
          RECEIVE MODAL
      ==================================================== */}

      <Modal
        title="Receive Store Requisition"

        open={
          receiveModalOpen
        }

        zIndex={2000}

        confirmLoading={
          processing
        }

        okText="Receive"

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

          setReceiveModalOpen(
            false,
          );

          receiveForm.resetFields();
        }}

        onOk={() =>
          void receiveDocument()
        }
      >
        <Form<ReceiveFormValues>
          form={
            receiveForm
          }

          layout="vertical"
        >
          <Form.Item
            name="received_date"

            label="Received Date"

            rules={[
              {
                required:
                  true,

                message:
                  'Received date is required.',
              },
            ]}
          >
            <DatePicker
              style={{
                width: '100%',
              }}

              format="YYYY-MM-DD"

              disabledDate={(
                current,
              ) =>
                current &&
                current >
                  dayjs().endOf(
                    'day',
                  )
              }
            />
          </Form.Item>

          <Form.Item
            name="remarks"

            label="Remarks"
          >
            <Input.TextArea
              rows={3}

              maxLength={
                5000
              }

              showCount

              placeholder="Optional receiving remarks"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StoreRequisitionDocumentReceivingPage;