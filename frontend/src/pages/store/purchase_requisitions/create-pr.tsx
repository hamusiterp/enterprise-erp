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
  EyeOutlined,
  FileAddOutlined,
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



const {
  Title,
  Text,
} = Typography;

interface PrUser {
  id?: number;
  name?: string | null;
}

interface PrDepartment {
  id?: number;
  department_name?: string | null;
  name?: string | null;
}

interface PrProject {
  id?: number;
  project_no?: string | null;
  project_name?: string | null;
  name?: string | null;
}

interface PrItemMaster {
  id?: number;
  item_no?: string | null;
  item_description?: string | null;
  name?: string | null;
}

interface PrUom {
  id?: number;
  symbol?: string | null;
  code?: string | null;
  name?: string | null;
}

type PrRequestType = string;

type PrUsedFor = string;

/* =========================================================
 * TYPES
 * ======================================================= */

interface CreatePrTask {
  id: number;
  status: string;
  received_at?: string | null;
  assignment_type?: string | null;
}

interface CreatePrAction {
  action: string;
  name: string;
  is_return: boolean;
  requires_remarks: boolean;
}

interface CreatePrLine {
  id: number;

  item_id?: number | null;

  item?: PrItemMaster | null;

  uom_id?: number | null;

  uom?: PrUom | null;

  unit_of_measurement?: PrUom | null;

  sr_qty: number | string;

  available_qty?: number | string | null;

  pr_qty?: number | string | null;

  expected_delivery_date?: string | null;

  priority?: string | null;

  delivery_type?: string | null;

  remark?: string | null;
}

interface CreatePrRequisition {
  id: number;

  sr_no: string;

  sr_date?: string | null;

  request_type?: PrRequestType | null;

  used_for?: PrUsedFor | null;

  to_location?: string | null;

  requester?: PrUser | null;

  from_department?: PrDepartment | null;

  used_for_department?: PrDepartment | null;

  project?: PrProject | null;

  items: CreatePrLine[];
}

interface ExistingPr {
  id: number;
  pr_no: string;
  status: string;
}

interface CreatePrRecord {
  task: CreatePrTask;

  actions: CreatePrAction[];

  requisition: CreatePrRequisition;

  pr_items: CreatePrLine[];

  existing_pr?: ExistingPr | null;
}

interface CreatePrListResponse {
  success: boolean;

  data: CreatePrRecord[];

  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface SubmitFormValues {
  remarks?: string | null;
}


/* =========================================================
 * HELPERS
 * ======================================================= */

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  return value.substring(
    0,
    10,
  );
}


function toNumber(
  value?: number | string | null,
): number {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


function formatLabel(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  return value
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}


/* =========================================================
 * COMPONENT
 * ======================================================= */

function StoreRequisitionCreatePrPage() {
  const {
    message,
  } = App.useApp();

  const [
    submitForm,
  ] =
    Form.useForm<SubmitFormValues>();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    records,
    setRecords,
  ] =
    useState<CreatePrRecord[]>([]);

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
    useState<CreatePrRecord | null>(
      null,
    );

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    submitModalOpen,
    setSubmitModalOpen,
  ] = useState(false);

  const [
    processing,
    setProcessing,
  ] = useState(false);


  /* =======================================================
   * SELECTED VALUES
   * ===================================================== */

  const selectedRequisition =
    selectedRecord
      ?.requisition ??
    null;

  const selectedPrItems =
    selectedRecord
      ?.pr_items ??
    [];


  /* =======================================================
   * WORKFLOW ACTION
   * ===================================================== */

  const submitAction =
    selectedRecord
      ?.actions
      ?.find(
        (
          action,
        ) =>
          !action.is_return,
      )
    ?? null;


  /* =======================================================
   * LOAD QUEUE
   * ===================================================== */

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(
            true,
          );

          const response =
            await apiClient.get<CreatePrListResponse>(
              '/api/store-requisitions/create-pr',
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
            response
              .data
              .data ??
              [],
          );

          setTotal(
            response
              .data
              .meta
              ?.total ??
              0,
          );
        } catch (
          error: unknown
        ) {
          console.error(
            'Create PR load error:',
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
              Object
                .values(
                  errors,
                )
                .flat()[0];

            message.error(
              firstError ??
                'Unable to load Create PR queue.',
            );

            return;
          }

          message.error(
            responseError
              .response
              ?.data
              ?.message ??
              'Unable to load Create PR queue.',
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


  useEffect(
    () => {
      void loadData();
    },
    [
      loadData,
    ],
  );


  /* =======================================================
   * OPEN RECORD
   * ===================================================== */

  const openRecord = (
    record: CreatePrRecord,
  ) => {
    setSelectedRecord(
      record,
    );

    submitForm.resetFields();

    setDrawerOpen(
      true,
    );
  };


  /* =======================================================
   * CREATE & SUBMIT PR
   * ===================================================== */

  const createPr =
    async () => {
      if (
        !selectedRecord
      ) {
        return;
      }

      if (
        selectedRecord
          .existing_pr
      ) {
        message.warning(
          `PR ${selectedRecord.existing_pr.pr_no} already exists for this SR.`,
        );

        return;
      }

      if (
        !submitAction
      ) {
        message.error(
          'No Submit PR workflow transition is configured.',
        );

        return;
      }

      try {
        const values =
          await submitForm
            .validateFields();

        setProcessing(
          true,
        );

        const response =
          await apiClient.post(
            `/api/store-requisitions/create-pr/${selectedRecord.task.id}`,
            {
              action:
                submitAction.action,

              remarks:
                values
                  .remarks
                  ?.trim() ||
                null,
            },
          );

        const prNo =
          response
            .data
            ?.data
            ?.pr_no;

        message.success(
          prNo
            ? `Purchase Requisition ${prNo} created successfully.`
            : (
              response
                .data
                ?.message ??
              'Purchase Requisition created successfully.'
            ),
        );

        setSubmitModalOpen(
          false,
        );

        setDrawerOpen(
          false,
        );

        setSelectedRecord(
          null,
        );

        submitForm
          .resetFields();

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
          'Create PR error:',
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
            Object
              .values(
                errors,
              )
              .flat()[0];

          message.error(
            firstError ??
              'Unable to create Purchase Requisition.',
          );

          return;
        }

        message.error(
          responseError
            .response
            ?.data
            ?.message ??
            'Unable to create Purchase Requisition.',
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

          key:
            'line_no',

          width:
            50,

          render: (
            _: unknown,

            __:
              CreatePrLine,

            index:
              number,
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
              CreatePrLine,
          ) => (
            <div>
              <Text strong>
                {
                  line
                    .item
                    ?.item_no ??
                  '-'
                }
              </Text>

              <div>
                {
                  line
                    .item
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
              CreatePrLine,
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
            'Available Qty',

          key:
            'available_qty',

          width:
            120,

          render: (
            _: unknown,

            line:
              CreatePrLine,
          ) =>
            toNumber(
              line.available_qty,
            ),
        },

        {
          title:
            'PR Qty',

          key:
            'pr_qty',

          width:
            100,

          render: (
            _: unknown,

            line:
              CreatePrLine,
          ) => (
            <Text strong>
              {
                toNumber(
                  line.pr_qty,
                )
              }
            </Text>
          ),
        },

        {
          title:
            'Expected Delivery',

          key:
            'expected_delivery_date',

          width:
            140,

          render: (
            _: unknown,

            line:
              CreatePrLine,
          ) =>
            formatDate(
              line
                .expected_delivery_date,
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

            line:
              CreatePrLine,
          ) => {
            if (
              line.priority ===
              'urgent'
            ) {
              return (
                <Tag color="red">
                  Urgent
                </Tag>
              );
            }

            if (
              line.priority ===
              'high'
            ) {
              return (
                <Tag color="orange">
                  High
                </Tag>
              );
            }

            return (
              <Tag>
                {formatLabel(
                  line.priority,
                )}
              </Tag>
            );
          },
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

            line:
              CreatePrLine,
          ) =>
            formatLabel(
              line
                .delivery_type,
            ),
        },

        {
          title:
            'Remark',

          key:
            'remark',

          width:
            180,

          render: (
            _: unknown,

            line:
              CreatePrLine,
          ) =>
            line.remark ||
            '-',
        },
      ],
      [],
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
          CreatePrRecord,
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
        'SR Date',

      key:
        'sr_date',

      width:
        120,

      render: (
        _: unknown,

        record:
          CreatePrRecord,
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

      width:
        180,

      render: (
        _: unknown,

        record:
          CreatePrRecord,
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
          CreatePrRecord,
      ) =>
        
          record.requisition.from_department?.department_name ??
record.requisition.from_department?.name ??
'-'
    },

    {
      title:
        'Used For',

      key:
        'used_for',

      width:
        130,

      render: (
        _: unknown,

        record:
          CreatePrRecord,
      ) =>
        formatLabel(
          record
            .requisition
            .used_for,
        ),
    },

    {
      title:
        'PR Items',

      key:
        'pr_items',

      width:
        90,

      align:
        'center' as const,

      render: (
        _: unknown,

        record:
          CreatePrRecord,
      ) =>
        record
          .pr_items
          .length,
    },

    {
      title:
        'Status',

      key:
        'status',

      width:
        140,

      render: (
        _: unknown,

        record:
          CreatePrRecord,
      ) =>
        record
          .existing_pr
          ? (
            <Tag color="green">
              {
                record
                  .existing_pr
                  .pr_no
              }
            </Tag>
          )
          : (
            <Tag color="processing">
              Ready for PR
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
          CreatePrRecord,
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
   * USED FOR VALUE
   * ===================================================== */

  const usedForValue =
    selectedRequisition
      ?.used_for ===
    'project'
      ? (
        selectedRequisition
          ?.project
          ? [
              selectedRequisition
                .project
                .project_no,

              selectedRequisition
                .project
                .project_name,
            ]
              .filter(Boolean)
              .join(' - ') || '-'
          : '-'
      )
      : (
        selectedRequisition
          ?.used_for_department
          ?.department_name ??
        '-'
      );


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
              Create Purchase
              Requisition
            </Title>

            <Text
              type="secondary"
            >
              Create PRs from
              Store Requisition
              shortage items.
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
              setPage(
                1,
              );

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
              setPage(
                1,
              );

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
              1150,
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
              `Total ${value} PR requests`,

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


      {/* ================================================
          REVIEW DRAWER
      ================================================= */}

      <Drawer
        title={
          selectedRequisition
            ? `Create PR - ${selectedRequisition.sr_no}`
            : 'Create Purchase Requisition'
        }

        open={
          drawerOpen
        }

        width={
          1200
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

          setSubmitModalOpen(
            false,
          );

          setSelectedRecord(
            null,
          );

          submitForm
            .resetFields();
        }}

        extra={
          selectedRecord
            ? (
              <Button
                type="primary"

                icon={
                  <FileAddOutlined />
                }

                disabled={
                  !!selectedRecord
                    .existing_pr
                }

                onClick={() => {
                  submitForm
                    .resetFields();

                  setSubmitModalOpen(
                    true,
                  );
                }}
              >
                Create & Submit PR
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
                    .to_location ||
                  '-'
                }
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

                span={
                  2
                }
              >
                {
                  usedForValue
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="PR Number"
              >
                {
                  selectedRecord
                    ?.existing_pr
                    ?.pr_no ??
                  'Generated on Create'
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="PR Lines"
              >
                {
                  selectedPrItems
                    .length
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Workflow"
              >
                <Tag color="processing">
                  Create PR
                </Tag>
              </Descriptions.Item>
            </Descriptions>


            <div
              style={{
                marginTop:
                  18,

                marginBottom:
                  10,
              }}
            >
              <Title
                level={
                  5
                }

                style={{
                  margin:
                    0,
                }}
              >
                Shortage Items
              </Title>

              <Text
                type="secondary"
              >
                Only quantities not
                available in stock
                are included in the
                Purchase Requisition.
              </Text>
            </div>


            <Table
              rowKey="id"

              dataSource={
                selectedPrItems
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
                  1450,
              }}
            />
          </>
        )}
      </Drawer>


      {/* ================================================
          CREATE PR CONFIRMATION
      ================================================= */}

      <Modal
        title="Create & Submit Purchase Requisition"

        open={
          submitModalOpen
        }

        zIndex={
          2000
        }

        confirmLoading={
          processing
        }

        okText="Create & Submit"

        okButtonProps={{
          icon:
            <FileAddOutlined />,
        }}

        onCancel={() => {
          if (
            processing
          ) {
            return;
          }

          setSubmitModalOpen(
            false,
          );

          submitForm
            .resetFields();
        }}

        onOk={() =>
          void createPr()
        }
      >
        <Form<SubmitFormValues>
          form={
            submitForm
          }

          layout="vertical"
        >
          <div
            style={{
              marginBottom:
                16,
            }}
          >
            <Text>
              The PR number will be
              generated automatically
              from Document Numbering
              when you confirm.
            </Text>
          </div>

          <Form.Item
            name="remarks"

            label="PR Remarks"
          >
            <Input.TextArea
              rows={
                4
              }

              maxLength={
                5000
              }

              showCount

              placeholder="Optional Purchase Requisition remarks"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StoreRequisitionCreatePrPage;