import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createStoreRequisition,
} from '../../../api/storeRequisitions';

import {
  fetchDepartmentOptions,
} from '../../../api/departments';

import type {
  DepartmentOption,
} from '../../../api/departments';

import {
  projectsApi,
} from '../../../api/projects';

import type {
  Project,
} from '../../../types/project';

import SrItemDrawer from './item-drawer';

import type {
  FuelOilSource,
  SrUsedFor,
  SrVoucherType,
  StoreRequisitionLine,
  StoreRequisitionPayload,
} from './types';


const {
  Title,
  Text,
} = Typography;

interface PostFormValues {
  used_for: SrUsedFor;

  project_id?: number | null;

  used_for_department_id?:
    number | null;

  from_department_id: number;

  to_location: string;

  voucher_sr_type:
    SrVoucherType;

  fuel_oil_source?:
    FuelOilSource | null;
}

function StoreRequisitionCreatePage() {
  const {
    message,
  } = App.useApp();

  const [
    postForm,
  ] = Form.useForm<PostFormValues>();

  /*
   * MR choice belongs to the entire SR.
   */
  const [
    mrRequested,
    setMrRequested,
  ] = useState(false);

  const [
    lines,
    setLines,
  ] =
    useState<StoreRequisitionLine[]>(
      [],
    );

  const [
    itemDrawerOpen,
    setItemDrawerOpen,
  ] = useState(false);

  const [
    editingLine,
    setEditingLine,
  ] =
    useState<StoreRequisitionLine | null>(
      null,
    );

  const [
    postDrawerOpen,
    setPostDrawerOpen,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    departments,
    setDepartments,
  ] =
    useState<DepartmentOption[]>([]);

  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  const [
    optionsLoading,
    setOptionsLoading,
  ] = useState(false);

  const usedFor =
    Form.useWatch(
      'used_for',
      postForm,
    );

  const voucherType =
    Form.useWatch(
      'voucher_sr_type',
      postForm,
    );



  /*
   * Once at least one line exists,
   * MR Requested cannot be changed.
   */
  const mrLocked =
    lines.length > 0;

  useEffect(() => {
    const loadOptions =
      async () => {
        try {
          setOptionsLoading(
            true,
          );

          const [
            departmentResult,
            projectResult,
          ] =
            await Promise.all([
              fetchDepartmentOptions(),

              projectsApi.list({
                page: 1,
                per_page: 100,
                status: 'active',
                sort_by:
                  'project_name',
                sort_direction:
                  'asc',
              }),
            ]);

          setDepartments(
            departmentResult,
          );

          setProjects(
            projectResult.data ??
              [],
          );
        } catch (error) {
          console.error(
            error,
          );

          message.error(
            'Unable to load departments or projects.',
          );
        } finally {
          setOptionsLoading(
            false,
          );
        }
      };

    void loadOptions();
  }, [message]);

  /*
   * Clear conditional values whenever
   * Used For changes.
   */
  useEffect(() => {
    if (
      usedFor === 'project'
    ) {
      postForm.setFieldValue(
        'used_for_department_id',
        null,
      );
    }

    if (
      usedFor ===
      'department'
    ) {
      postForm.setFieldValue(
        'project_id',
        null,
      );
    }
  }, [
    usedFor,
    postForm,
  ]);

  /*
   * Fuel/Oil source only applies
   * to Fuel & Oil vouchers.
   */
  useEffect(() => {
    if (
      voucherType !==
      'fuel_oil'
    ) {
      postForm.setFieldValue(
        'fuel_oil_source',
        null,
      );
    }
  }, [
    voucherType,
    postForm,
  ]);

  const openAddItem = () => {
    setEditingLine(null);

    setItemDrawerOpen(true);
  };

  const openEditItem = (
    line: StoreRequisitionLine,
  ) => {
    setEditingLine(line);

    setItemDrawerOpen(true);
  };

  const saveLine = (
    line: StoreRequisitionLine,
  ) => {
    /*
     * Prevent the same Item from being
     * added twice accidentally.
     */
    const duplicate =
      lines.some(
        (existing) =>
          existing.item_id ===
            line.item_id &&
          existing.key !==
            line.key,
      );

    if (duplicate) {
      message.warning(
        'This item is already included in the Store Requisition.',
      );

      return;
    }

    setLines(
      (current) => {
        const exists =
          current.some(
            (record) =>
              record.key ===
              line.key,
          );

        if (exists) {
          return current.map(
            (record) =>
              record.key ===
              line.key
                ? line
                : record,
          );
        }

        return [
          ...current,
          line,
        ];
      },
    );

    setEditingLine(null);

    setItemDrawerOpen(false);
  };

  const removeLine = (
    key: string,
  ) => {
    setLines(
      (current) =>
        current.filter(
          (line) =>
            line.key !==
            key,
        ),
    );
  };

  const handleMrChange = (
    value: boolean,
  ) => {
    if (mrLocked) {
      message.warning(
        'Remove all added items before changing the MR Requested selection.',
      );

      return;
    }

    setMrRequested(value);
  };

  const openPostDrawer = () => {
    if (
      lines.length === 0
    ) {
      message.warning(
        'Add at least one item before posting the Store Requisition.',
      );

      return;
    }

    postForm.resetFields();

    postForm.setFieldsValue({
      used_for:
        'department',

      project_id:
        null,

      used_for_department_id:
        null,

      from_department_id:
        undefined,

      to_location:
        'Main Store',

      voucher_sr_type:
        'goods',

      fuel_oil_source:
        null,
    });

    setPostDrawerOpen(true);
  };

  const handleCreate =
    async () => {
      try {
        const values =
          await postForm
            .validateFields();

        setSubmitting(true);

        const payload:
          StoreRequisitionPayload =
          {
            /*
             * This page is specifically
             * Project / Department SR.
             */
            request_type:
              'general',

            mr_requested:
              mrRequested,

            used_for:
              values.used_for,

            project_id:
              values.used_for ===
              'project'
                ? values.project_id
                : null,

            used_for_department_id:
              values.used_for ===
              'department'
                ? values
                    .used_for_department_id
                : null,

            from_department_id:
              values
                .from_department_id,

            to_location:
              values.to_location,

            voucher_sr_type:
              values.voucher_sr_type,

            fuel_oil_source:
              values
                .voucher_sr_type ===
              'fuel_oil'
                ? values
                    .fuel_oil_source
                : null,

            items:
              lines.map(
                (line) => ({
                  item_id:
                    line.item_id,

                  uom_id:
                    line.uom_id,

                  mr_date:
                    mrRequested
                      ? line.mr_date ??
                        null
                      : null,

                  mr_no:
                    mrRequested
                      ? line.mr_no ??
                        null
                      : null,

                  mr_qty:
                    mrRequested
                      ? line.mr_qty ??
                        null
                      : null,

                  sr_qty:
                    line.sr_qty,

                  expected_delivery_date:
                    line
                      .expected_delivery_date,

                  delivery_type:
                    line.delivery_type,

                  priority:
                    line.priority,

                  urgency_reason:
                    line.priority ===
                    'urgent'
                      ? line
                          .urgency_reason ??
                        null
                      : null,

                  remark:
                    line.remark ??
                    null,
                }),
              ),
          };

        const response =
          await createStoreRequisition(
            payload,
          );

        const created =
          response.data;

        setPostDrawerOpen(
          false,
        );

        setLines([]);

        setMrRequested(false);

        postForm.resetFields();

        Modal.success({
  title:
    'Store Requisition Created',

  width: 520,

  okText:
    'View & Print SR',

  content: (
    <div
      style={{
        marginTop: 16,
      }}
    >
      <Descriptions
        bordered
        size="small"
        column={1}
      >
        <Descriptions.Item
          label="SR Number"
        >
          <Text strong>
            {created.sr_no}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item
          label="Items"
        >
          {created.items?.length ?? lines.length}
        </Descriptions.Item>

        <Descriptions.Item
          label="Current Stage"
        >
          {
            created
              .workflow_instance
              ?.current_state
              ?.name ??
            'Approve SR'
          }
        </Descriptions.Item>
      </Descriptions>
    </div>
  ),

  onOk: () => {
  window.location.href =
    `/store/store-requisitions/${created.id}/print`;
},
});
      } catch (
        error: unknown
      ) {
        if (
          typeof error ===
            'object' &&
          error !== null &&
          'errorFields' in
            error
        ) {
          return;
        }

        console.error(error);

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

        const errors =
          responseError
            .response
            ?.data
            ?.errors;

        if (
          responseError
            .response
            ?.status ===
            422 &&
          errors
        ) {
          const firstError =
            Object.values(
              errors,
            ).flat()[0];

          message.error(
            firstError ??
              'Please check the Store Requisition details.',
          );

          return;
        }

        message.error(
          responseError
            .response
            ?.data
            ?.message ??
            'Unable to create Store Requisition.',
        );
      } finally {
        setSubmitting(false);
      }
    };

  const totalQuantity =
    useMemo(
      () =>
        lines.reduce(
          (
            total,
            line,
          ) =>
            total +
            Number(
              line.sr_qty ??
                0,
            ),
          0,
        ),
      [lines],
    );

  const columns = [
    {
      title: '#',
      key: 'line_no',
      width: 55,

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
                ?.item_no
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

    ...(mrRequested
      ? [
          {
            title:
              'MR Number',
            dataIndex:
              'mr_no',
            key:
              'mr_no',
            width: 130,

            render: (
              value:
                string | null,
            ) =>
              value || '-',
          },

          {
            title:
              'MR Qty',
            dataIndex:
              'mr_qty',
            key:
              'mr_qty',
            width: 100,
          },
        ]
      : []),

    {
      title: 'Unit',
      key: 'uom',
      width: 130,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) =>
        line.uom
          ? `${line.uom.code} - ${line.uom.name}`
          : '-',
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
      width: 145,
    },

    {
      title:
        'Delivery Type',
      key:
        'delivery_type',
      width: 145,

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
      title:
        'Priority',
      key:
        'priority',
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

    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed:
        'right' as const,

      render: (
        _: unknown,
        line:
          StoreRequisitionLine,
      ) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={
              <EditOutlined />
            }
            onClick={() =>
              openEditItem(
                line,
              )
            }
          />

          <Popconfirm
            title="Remove item"
            description="Remove this item from the Store Requisition?"
            okText="Remove"
            cancelText="Cancel"
            onConfirm={() =>
              removeLine(
                line.key,
              )
            }
          >
            <Button
              danger
              type="text"
              size="small"
              icon={
                <DeleteOutlined />
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Row
          gutter={[
            16,
            16,
          ]}
          align="middle"
          justify="space-between"
        >
          <Col>
            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              New Store
              Requisition
            </Title>

            <Text
              type="secondary"
            >
              Project /
              Department Store
              Requisition
            </Text>
          </Col>

          <Col>
            <Space>
              <Button
                icon={
                  <PlusOutlined />
                }
                onClick={
                  openAddItem
                }
              >
                Add Item
              </Button>

              <Button
                type="primary"
                icon={
                  <SendOutlined />
                }
                disabled={
                  lines.length ===
                  0
                }
                onClick={
                  openPostDrawer
                }
              >
                Post Requisition
              </Button>
            </Space>
          </Col>
        </Row>

        <Card
          size="small"
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Row
            gutter={[
              24,
              16,
            ]}
            align="middle"
          >
            <Col>
              <Text strong>
                MR Requested?
              </Text>
            </Col>

            <Col>
              <Radio.Group
                value={
                  mrRequested
                }
                disabled={
                  mrLocked
                }
                onChange={(
                  event,
                ) =>
                  handleMrChange(
                    event.target
                      .value,
                  )
                }
              >
                <Radio
                  value={
                    false
                  }
                >
                  No
                </Radio>

                <Radio
                  value={
                    true
                  }
                >
                  Yes
                </Radio>
              </Radio.Group>
            </Col>

            {mrLocked && (
              <Col flex="auto">
                <Text
                  type="secondary"
                >
                  MR selection is
                  locked after the
                  first item is
                  added.
                </Text>
              </Col>
            )}
          </Row>
        </Card>

        {lines.length ===
        0 ? (
          <Empty
            description="No requisition items added yet."
          >
            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              onClick={
                openAddItem
              }
            >
              Add First Item
            </Button>
          </Empty>
        ) : (
          <>
            <Table
              rowKey="key"
              dataSource={
                lines
              }
              columns={
                columns
              }
              pagination={
                false
              }
              scroll={{
                x: 1450,
              }}
            />

            <Row
              justify="space-between"
              align="middle"
              style={{
                marginTop: 20,
              }}
            >
              <Col>
                <Button
                  icon={
                    <PlusOutlined />
                  }
                  onClick={
                    openAddItem
                  }
                >
                  Add Another
                  Item
                </Button>
              </Col>

              <Col>
                <Space
                  size="large"
                >
                  <Text>
                    Items:{' '}
                    <strong>
                      {
                        lines.length
                      }
                    </strong>
                  </Text>

                  <Text>
                    Total SR
                    Qty:{' '}
                    <strong>
                      {
                        totalQuantity
                      }
                    </strong>
                  </Text>

                  <Button
                    type="primary"
                    icon={
                      <SendOutlined />
                    }
                    onClick={
                      openPostDrawer
                    }
                  >
                    Post
                    Requisition
                  </Button>
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Card>

      <SrItemDrawer
        open={
          itemDrawerOpen
        }
        mrRequested={
          mrRequested
        }
        initialValue={
          editingLine
        }
        onClose={() => {
          setItemDrawerOpen(
            false,
          );

          setEditingLine(
            null,
          );
        }}
        onSave={
          saveLine
        }
      />

      {/* =============================
          POST / HEADER DETAILS DRAWER
      ============================== */}
      <Drawer
        title="Post Store Requisition"
        open={
          postDrawerOpen
        }
        width={620}
        destroyOnHidden
        onClose={() => {
          if (
            submitting
          ) {
            return;
          }

          setPostDrawerOpen(
            false,
          );
        }}
        extra={
          <Space>
            <Button
              disabled={
                submitting
              }
              onClick={() =>
                setPostDrawerOpen(
                  false,
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={
                submitting
              }
              onClick={() =>
                void handleCreate()
              }
            >
              Create
            </Button>
          </Space>
        }
      >
        <Form<PostFormValues>
          form={postForm}
          layout="vertical"
        >
          <Form.Item
            name="used_for"
            label="Used For"
            rules={[
              {
                required:
                  true,

                message:
                  'Used For is required.',
              },
            ]}
          >
            <Radio.Group>
              <Radio.Button
                value="project"
              >
                Project
              </Radio.Button>

              <Radio.Button
                value="department"
              >
                Department
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {usedFor ===
            'project' && (
            <Form.Item
              name="project_id"
              label="Project"
              rules={[
                {
                  required:
                    true,

                  message:
                    'Please select a project.',
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                loading={
                  optionsLoading
                }
                optionFilterProp="label"
                placeholder="Select project"
                options={projects.map(
                  (
                    project,
                  ) => ({
                    value:
                      project.id,

                    label:
                      `${project.project_no} - ${project.project_name}`,
                  }),
                )}
              />
            </Form.Item>
          )}

          {usedFor ===
            'department' && (
            <Form.Item
              name="used_for_department_id"
              label="Department"
              rules={[
                {
                  required:
                    true,

                  message:
                    'Please select a department.',
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                loading={
                  optionsLoading
                }
                optionFilterProp="label"
                placeholder="Select department"
                options={departments.map(
                  (
                    department,
                  ) => ({
                    value:
                      department.id,

                    label:
                      department
                        .department_name,
                  }),
                )}
              />
            </Form.Item>
          )}

          <Form.Item
            name="from_department_id"
            label="From"
            rules={[
              {
                required:
                  true,

                message:
                  'From department is required.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              loading={
                optionsLoading
              }
              optionFilterProp="label"
              placeholder="Select originating department"
              options={departments.map(
                (
                  department,
                ) => ({
                  value:
                    department.id,

                  label:
                    department
                      .department_name,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            name="to_location"
            label="To"
            rules={[
              {
                required:
                  true,
              },
            ]}
          >
            <Input
              disabled
            />
          </Form.Item>

          <Form.Item
            name="voucher_sr_type"
            label="Voucher SR Type"
            rules={[
              {
                required:
                  true,

                message:
                  'Voucher SR Type is required.',
              },
            ]}
          >
            <Radio.Group>
              <Radio.Button
                value="goods"
              >
                Goods
              </Radio.Button>

              <Radio.Button
                value="fuel_oil"
              >
                Fuel & Oil
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {voucherType ===
            'fuel_oil' && (
            <Form.Item
              name="fuel_oil_source"
              label="Fuel & Oil Source"
              rules={[
                {
                  required:
                    true,

                  message:
                    'Select Purchased or Stock.',
                },
              ]}
            >
              <Radio.Group>
                <Radio.Button
                  value="purchased"
                >
                  Purchased
                </Radio.Button>

                <Radio.Button
                  value="stock"
                >
                  Stock
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          )}

          <Card
            size="small"
            title="Requisition Summary"
          >
            <Descriptions
              size="small"
              column={1}
            >
              <Descriptions.Item
                label="MR Requested"
              >
                {mrRequested
                  ? 'Yes'
                  : 'No'}
              </Descriptions.Item>

              <Descriptions.Item
                label="Number of Items"
              >
                {
                  lines.length
                }
              </Descriptions.Item>

              <Descriptions.Item
                label="Total SR Quantity"
              >
                {
                  totalQuantity
                }
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Form>
      </Drawer>
    </>
  );
}

export default StoreRequisitionCreatePage;