import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  fetchStoreRequisition,
  updateStoreRequisition,
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
  StoreRequisition,
  StoreRequisitionLine,
  StoreRequisitionPayload,
} from './types';

const {
  Title,
  Text,
} = Typography;

interface HeaderFormValues {
  used_for: SrUsedFor;

  project_id?: number | null;

  used_for_department_id?: number | null;

  from_department_id: number;

  to_location: string;

  voucher_sr_type: SrVoucherType;

  fuel_oil_source?: FuelOilSource | null;
}

function getRequisitionId(): number | null {
  const match =
    window.location.pathname.match(
      /\/store\/store-requisitions\/(\d+)\/edit\/?$/
    );

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function StoreRequisitionEditPage() {
  const {
    message,
    modal,
  } = App.useApp();

  const id =
    getRequisitionId();

  const [
    form,
  ] =
    Form.useForm<HeaderFormValues>();

  const [
    requisition,
    setRequisition,
  ] =
    useState<StoreRequisition | null>(
      null,
    );

  const [
    lines,
    setLines,
  ] =
    useState<StoreRequisitionLine[]>(
      [],
    );

  const [
    mrRequested,
    setMrRequested,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
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

  const usedFor =
    Form.useWatch(
      'used_for',
      form,
    );

  const voucherType =
    Form.useWatch(
      'voucher_sr_type',
      form,
    );

  /*
   * Same MR rule as Create:
   * once item lines exist, MR selection
   * cannot be changed.
   */
  const mrLocked =
    lines.length > 0;

  const formatDate = (
    value?: string | null,
  ) => {
    if (!value) {
      return '-';
    }

    return value.substring(
      0,
      10,
    );
  };

  /*
   * ================================
   * LOAD SR
   * ================================
   */
  useEffect(() => {
    const load =
      async () => {
        if (!id) {
          message.error(
            'Invalid Store Requisition.',
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);

          const result =
            await fetchStoreRequisition(
              id,
            );

          /*
           * Only Submitted SRs may be edited.
           */
          if (
            result.status
              ?.toLowerCase() !==
            'submitted'
          ) {
            setRequisition(
              result,
            );

            message.warning(
              'Only submitted Store Requisitions can be edited.',
            );

            return;
          }

          setRequisition(
            result,
          );

          setMrRequested(
            result.mr_requested,
          );

          /*
           * Backend records do not have the
           * frontend-only key field.
           */
          const loadedLines =
            (result.items ?? []).map(
              (
                line,
                index,
              ) => ({
                ...line,

                key:
                  line.key ||
                  `existing-${index}-${line.item_id}`,

                /*
                 * Laravel returns:
                 * unit_of_measurement
                 *
                 * Item Drawer normally uses:
                 * uom
                 */
                uom:
                  line.unit_of_measurement ??
                  line.uom ??
                  null,

                mr_date:
                  line.mr_date
                    ? formatDate(
                        line.mr_date,
                      )
                    : null,

                expected_delivery_date:
                  formatDate(
                    line.expected_delivery_date,
                  ),
              }),
            );

          setLines(
            loadedLines,
          );

          form.setFieldsValue({
            used_for:
              result.used_for ??
              'department',

            project_id:
              result.project_id ??
              null,

            used_for_department_id:
              result
                .used_for_department_id ??
              null,

            from_department_id:
              result.from_department_id ??
              undefined,

            to_location:
              result.to_location ||
              'Main Store',

            voucher_sr_type:
              result.voucher_sr_type ??
              'goods',

            fuel_oil_source:
              result.fuel_oil_source ??
              null,
          });
        } catch (error) {
          console.error(
            error,
          );

          message.error(
            'Unable to load Store Requisition.',
          );
        } finally {
          setLoading(false);
        }
      };

    void load();
  }, [
    id,
    form,
    message,
  ]);

  /*
   * ================================
   * LOAD PROJECTS / DEPARTMENTS
   * ================================
   */
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
   * Clear project/department depending
   * on Used For.
   */
  useEffect(() => {
    if (
      usedFor === 'project'
    ) {
      form.setFieldValue(
        'used_for_department_id',
        null,
      );
    }

    if (
      usedFor ===
      'department'
    ) {
      form.setFieldValue(
        'project_id',
        null,
      );
    }
  }, [
    usedFor,
    form,
  ]);

  /*
   * Fuel source only belongs to Fuel & Oil.
   */
  useEffect(() => {
    if (
      voucherType !==
      'fuel_oil'
    ) {
      form.setFieldValue(
        'fuel_oil_source',
        null,
      );
    }
  }, [
    voucherType,
    form,
  ]);

  /*
   * ================================
   * ITEM LINE ACTIONS
   * ================================
   */
  const openAddItem = () => {
    setEditingLine(null);

    setItemDrawerOpen(true);
  };

  const openEditItem = (
    line: StoreRequisitionLine,
  ) => {
    setEditingLine(
      line,
    );

    setItemDrawerOpen(true);
  };

  const saveLine = (
    line: StoreRequisitionLine,
  ) => {
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
            (existing) =>
              existing.key ===
              line.key,
          );

        if (exists) {
          return current.map(
            (existing) =>
              existing.key ===
              line.key
                ? line
                : existing,
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
        'Remove all items before changing MR Requested.',
      );

      return;
    }

    setMrRequested(
      value,
    );
  };

  /*
   * ================================
   * SAVE UPDATE
   * ================================
   */
  const handleSave =
    async () => {
      if (
        !id ||
        !requisition
      ) {
        return;
      }

      if (
        requisition.status
          ?.toLowerCase() !==
        'submitted'
      ) {
        message.error(
          'This Store Requisition can no longer be edited.',
        );

        return;
      }

      if (
        lines.length === 0
      ) {
        message.warning(
          'Store Requisition must contain at least one item.',
        );

        return;
      }

      try {
        const values =
          await form.validateFields();

        setSaving(true);

        const payload:
          StoreRequisitionPayload =
          {
            request_type:
              requisition.request_type,

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
                    Number(
                      line.sr_qty,
                    ),

                  expected_delivery_date:
                    formatDate(
                      line
                        .expected_delivery_date,
                    ),

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
          await updateStoreRequisition(
            id,
            payload,
          );

        modal.success({
          title:
            'Store Requisition Updated',

          okText:
            'View & Print SR',

          content: (
            <Descriptions
              bordered
              size="small"
              column={1}
              style={{
                marginTop: 16,
              }}
            >
              <Descriptions.Item
                label="SR Number"
              >
                <Text strong>
                  {
                    response.data
                      .sr_no
                  }
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label="Status"
              >
                Submitted
              </Descriptions.Item>

              <Descriptions.Item
                label="Items"
              >
                {
                  response.data
                    .items?.length ??
                  lines.length
                }
              </Descriptions.Item>
            </Descriptions>
          ),

          onOk: () => {
            window.location.href =
              `/store/store-requisitions/${id}/print`;
          },
        });
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
            'Unable to update Store Requisition.',
        );
      } finally {
        setSaving(false);
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

  /*
   * ================================
   * TABLE
   * ================================
   */
  const columns = [
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
      width: 300,

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

    ...(mrRequested
      ? [
          {
            title:
              'MR No.',

            dataIndex:
              'mr_no',

            key:
              'mr_no',

            width: 120,
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
          : line
              .unit_of_measurement
            ? `${line.unit_of_measurement.code} - ${line.unit_of_measurement.name}`
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

      width: 140,

      render: (
        value: string,
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
            description="Remove this item from this Store Requisition?"
            okText="Remove"
            cancelText="Cancel"
            onConfirm={() =>
              removeLine(
                line.key,
              )
            }
          >
            <Button
              type="text"
              danger
              icon={
                <DeleteOutlined />
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: 300,

          display: 'flex',

          alignItems:
            'center',

          justifyContent:
            'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!requisition) {
    return (
      <Card>
        Store Requisition
        could not be loaded.
      </Card>
    );
  }

  const editable =
    requisition.status
      ?.toLowerCase() ===
    'submitted';

  return (
    <>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          gutter={[
            16,
            16,
          ]}
        >
          <Col>
            <Space
              direction="vertical"
              size={2}
            >
              <Title
                level={3}
                style={{
                  margin: 0,
                }}
              >
                Edit Store
                Requisition
              </Title>

              <Text strong>
                {
                  requisition.sr_no
                }
              </Text>

              <Text
                type="secondary"
              >
                SR Date:{' '}
                {formatDate(
                  requisition.sr_date,
                )}
              </Text>
            </Space>
          </Col>

          <Col>
            <Space>
              <Button
                icon={
                  <ArrowLeftOutlined />
                }
                onClick={() => {
                  window.location.href =
                    '/store/store-requisitions';
                }}
              >
                Back
              </Button>

              <Button
                type="primary"
                icon={
                  <SaveOutlined />
                }
                loading={
                  saving
                }
                disabled={
                  !editable
                }
                onClick={() =>
                  void handleSave()
                }
              >
                Save Changes
              </Button>
            </Space>
          </Col>
        </Row>

        {!editable && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              border:
                '1px solid #ffccc7',
              background:
                '#fff2f0',
              borderRadius: 6,
            }}
          >
            This Store
            Requisition is no
            longer editable
            because its status is{' '}
            <strong>
              {
                requisition.status
              }
            </strong>
            .
          </div>
        )}

        <Card
          size="small"
          title="Requisition Details"
          style={{
            marginTop: 20,
          }}
        >
          <Form<HeaderFormValues>
            form={form}
            layout="vertical"
            disabled={
              !editable
            }
          >
            <Row gutter={16}>
              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  label="MR Requested?"
                >
                  <Radio.Group
                    value={
                      mrRequested
                    }
                    disabled={
                      !editable ||
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
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="used_for"
                  label="Used For"
                  rules={[
                    {
                      required:
                        true,
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
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="from_department_id"
                  label="From"
                  rules={[
                    {
                      required:
                        true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    loading={
                      optionsLoading
                    }
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
              </Col>
            </Row>

            <Row gutter={16}>
              {usedFor ===
                'project' && (
                <Col
                  xs={24}
                  md={8}
                >
                  <Form.Item
                    name="project_id"
                    label="Project"
                    rules={[
                      {
                        required:
                          true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      loading={
                        optionsLoading
                      }
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
                </Col>
              )}

              {usedFor ===
                'department' && (
                <Col
                  xs={24}
                  md={8}
                >
                  <Form.Item
                    name="used_for_department_id"
                    label="Department"
                    rules={[
                      {
                        required:
                          true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      loading={
                        optionsLoading
                      }
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
                </Col>
              )}

              <Col
                xs={24}
                md={8}
              >
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
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                md={8}
              >
                <Form.Item
                  name="voucher_sr_type"
                  label="Voucher SR Type"
                  rules={[
                    {
                      required:
                        true,
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
              </Col>
            </Row>

            {voucherType ===
              'fuel_oil' && (
              <Row>
                <Col
                  xs={24}
                  md={8}
                >
                  <Form.Item
                    name="fuel_oil_source"
                    label="Fuel & Oil Source"
                    rules={[
                      {
                        required:
                          true,
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
                </Col>
              </Row>
            )}
          </Form>
        </Card>

        <Card
          size="small"
          title="Items"
          style={{
            marginTop: 16,
          }}
          extra={
            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              disabled={
                !editable
              }
              onClick={
                openAddItem
              }
            >
              Add Item
            </Button>
          }
        >
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
              x: 1250,
            }}
          />

          <div
            style={{
              marginTop: 16,

              display: 'flex',

              justifyContent:
                'flex-end',

              gap: 30,
            }}
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
              Total SR Qty:{' '}
              <strong>
                {
                  totalQuantity
                }
              </strong>
            </Text>
          </div>
        </Card>
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
    </>
  );
}

export default StoreRequisitionEditPage;