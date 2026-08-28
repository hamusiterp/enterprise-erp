import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import apiClient from '../../../api/client';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Item {
  id: number;
  item_no?: string | null;
  item_description?: string | null;
}

interface Uom {
  id: number;
  code?: string | null;
  name?: string | null;
}

interface PurchaseRequisitionItem {
  id: number;
  item_id: number | null;
  uom_id: number | null;
  sr_qty?: string | number;
  available_qty?: string | number;
  pr_qty?: string | number;
  expected_delivery_date?: string | null;
  priority?: string | null;
  delivery_type?: string | null;
  remark?: string | null;
  item?: Item | null;
  uom?: Uom | null;
}

interface StoreRequisition {
  id: number;
  sr_no?: string | null;
  sr_date?: string | null;
}

interface PurchaseRequisition {
  id: number;
  pr_no: string;
  pr_date?: string | null;
  used_for?: string | null;
  to_location?: string | null;
  remarks?: string | null;
  status?: string | null;
  store_requisition?: StoreRequisition | null;
  items?: PurchaseRequisitionItem[];
}

interface UnitPriceRequestItem {
  id: number;
  quantity: string;
  previous_unit_price: string | null;
  unit_price: string | null;
  vat_percentage: string;
  line_total: string;
  tax_amount: string;
  grand_total: string;
  supplier_id: number | null;
  supplier_name: string | null;
  supplier_stock: string | null;
  status: string;

  item?: {
    id: number;
    item_no?: string | null;
    item_description?: string | null;
  } | null;

  uom?: {
    id: number;
    code?: string | null;
    name?: string | null;
  } | null;

  price_updated_by?: {
    id: number;
    name: string;
  } | null;
}

interface UnitPriceRequest {
  id: number;
  request_no: string;
  request_date?: string | null;
  status?: string | null;
  requested_at?: string | null;
  remarks?: string | null;
  items?: UnitPriceRequestItem[];
}

interface WorkflowTask {
  id: number;
  status?: string | null;
}

interface WorkflowInfo {
  instance_id: number;
  state_code?: string | null;
  state_name?: string | null;
}

interface QueueRow {
  task: WorkflowTask;
  workflow: WorkflowInfo;
  purchase_requisition: PurchaseRequisition;
  unit_price_request?: UnitPriceRequest | null;
  pricing_status: string;
}

interface ApiResponse {
  data: QueueRow[];
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

const formatNumber = (value?: string | number | null) => {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0);
};

const getStatusColor = (status?: string | null) => {
  switch ((status ?? '').toLowerCase()) {
    case 'requested':
      return 'blue';

    case 'pending_confirmation':
      return 'orange';

    case 'confirmed':
      return 'green';

    case 'rejected':
      return 'red';

    case 'out_of_stock':
      return 'volcano';

    case 'not_requested':
      return 'default';

    default:
      return 'default';
  }
};

const readableStatus = (status?: string | null) => {
  if (!status) {
    return '-';
  }

  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const UnitPriceRequestPage: React.FC = () => {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');

  const [selectedRow, setSelectedRow] = useState<QueueRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestRemarks, setRequestRemarks] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const loadQueue = async () => {
  setLoading(true);

  try {
    const response =
  await apiClient.get<ApiResponse>(
    '/api/store-requisitions/unit-price',
    {
      params: {
        page: 1,
        per_page: 100,
        search:
          search ||
          undefined,
      },
    },
  );

setRows(response.data.data ?? []);

    console.log('UNIT PRICE API:', response.data);

    setRows(response.data.data ?? []);
  } catch (error: any) {
    console.error('UNIT PRICE ERROR:', error);

    message.error(
      error?.response?.data?.message ??
        'Unable to load Unit Price requests.',
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadQueue();
  }, []);

  const handleSearch = () => {
    loadQueue();
  };

  const handleReset = () => {
    setSearch('');

    setTimeout(() => {
      loadQueue();
    }, 0);
  };

  const openReview = (row: QueueRow) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const openRequestPrice = (row: QueueRow) => {
    setSelectedRow(row);
    setRequestRemarks(row.unit_price_request?.remarks ?? '');
    setRequestModalOpen(true);
  };

  const submitPriceRequest = async () => {
    if (!selectedRow) {
      return;
    }

    setRequestSubmitting(true);

    try {
      await apiClient.post(
        `/api/store-requisitions/unit-price/${selectedRow.task.id}/request-price`,
        {
            remarks: requestRemarks || null,
        },
        );

      message.success('Unit Price request sent successfully.');

      setRequestModalOpen(false);
      setRequestRemarks('');

      await loadQueue();
    } catch (error: any) {
      console.error(error);

      message.error(
        error?.response?.data?.message ??
          'Unable to send Unit Price request.',
      );
    } finally {
      setRequestSubmitting(false);
    }
  };

  const pendingCount = useMemo(
    () => rows.filter((row) => row.pricing_status === 'not_requested').length,
    [rows],
  );

  const requestedCount = useMemo(
    () => rows.filter((row) => row.pricing_status === 'requested').length,
    [rows],
  );

  const pendingConfirmationCount = useMemo(
    () =>
      rows.filter((row) => row.pricing_status === 'pending_confirmation')
        .length,
    [rows],
  );

  const confirmedCount = useMemo(
    () => rows.filter((row) => row.pricing_status === 'confirmed').length,
    [rows],
  );

  const queueColumns: ColumnsType<QueueRow> = [
    {
      title: '#',
      width: 65,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'PR Number',
      dataIndex: ['purchase_requisition', 'pr_no'],
      key: 'pr_no',
      width: 180,
      render: (value: string) => (
        <Text strong>{value || '-'}</Text>
      ),
    },
    {
      title: 'PR Date',
      dataIndex: ['purchase_requisition', 'pr_date'],
      key: 'pr_date',
      width: 130,
       render: (value: string) => value ? value.split('T')[0] : '-',
    },
    {
      title: 'SR Number',
      key: 'sr_no',
      width: 170,
      render: (_, row) =>
        row.purchase_requisition.store_requisition?.sr_no ?? '-',
    },
    {
      title: 'Items',
      key: 'items',
      width: 90,
      align: 'center',
      render: (_, row) =>
        row.purchase_requisition.items?.length ?? 0,
    },
    {
      title: 'Workflow',
      key: 'workflow',
      width: 150,
      render: (_, row) => (
        <Tag color="purple">
          {row.workflow.state_name ?? row.workflow.state_code ?? '-'}
        </Tag>
      ),
    },
    {
      title: 'Price Status',
      key: 'pricing_status',
      width: 180,
      render: (_, row) => (
        <Tag color={getStatusColor(row.pricing_status)}>
          {readableStatus(row.pricing_status)}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, row) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => openReview(row)}
          >
            Review
          </Button>

          {row.pricing_status === 'not_requested' && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => openRequestPrice(row)}
            >
              Request Price
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<PurchaseRequisitionItem> = [
    {
      title: '#',
      width: 55,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Item',
      key: 'item',
      render: (_, row) =>
        row.item?.item_description ??
        row.item?.item_no ??
        '-'
    },
    {
      title: 'Unit',
      key: 'uom',
      width: 120,
      render: (_, row) =>
        row.uom?.code ??
        row.uom?.name ??
        '-',
    },
    {
      title: 'SR Qty',
      dataIndex: 'sr_qty',
      width: 110,
      align: 'right',
      render: (value) => formatNumber(value),
    },
    {
      title: 'Available',
      dataIndex: 'available_qty',
      width: 120,
      align: 'right',
      render: (value) => formatNumber(value),
    },
    {
      title: 'PR Qty',
      dataIndex: 'pr_qty',
      width: 110,
      align: 'right',
      render: (value) => (
        <Text strong>{formatNumber(value)}</Text>
      ),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expected_delivery_date',
      width: 150,
       render: (value: string) => value ? value.split('T')[0] : '-',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 110,
      render: (value) =>
        value ? <Tag>{value}</Tag> : '-',
    },
    {
      title: 'Delivery Type',
      dataIndex: 'delivery_type',
      width: 140,
      render: (value) => value || '-',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Unit Price Update Request
        </Title>

        <Text type="secondary">
          Review Purchase Requisitions and send items for unit price update.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Pending Request</Text>
            <Title level={3} style={{ margin: 0 }}>
              {pendingCount}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Requested</Text>
            <Title level={3} style={{ margin: 0 }}>
              {requestedCount}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Pending Confirmation</Text>
            <Title level={3} style={{ margin: 0 }}>
              {pendingConfirmationCount}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">Confirmed</Text>
            <Title level={3} style={{ margin: 0 }}>
              {confirmedCount}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <Space
          wrap
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Space wrap>
            <Input
              allowClear
              value={search}
              placeholder="Search PR or SR number..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              onChange={(event) => setSearch(event.target.value)}
              onPressEnter={handleSearch}
            />

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Space>

          <Button
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={loadQueue}
          >
            Refresh
          </Button>
        </Space>

        <Table
          rowKey={(row) => row.task.id}
          loading={loading}
          columns={queueColumns}
          dataSource={rows}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} record(s)`,
          }}
          locale={{
            emptyText: (
              <Empty description="No Unit Price requests available" />
            ),
          }}
        />
      </Card>

      <Drawer
        title="Unit Price Request Review"
        open={drawerOpen}
        width={1000}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRow(null);
        }}
      >
        {selectedRow && (
          <>
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
              }}
              size="small"
              style={{ marginBottom: 20 }}
            >
              <Descriptions.Item label="PR Number">
                {selectedRow.purchase_requisition.pr_no}
              </Descriptions.Item>

              <Descriptions.Item label="PR Date">
                {selectedRow.purchase_requisition.pr_date ?? '-'}
              </Descriptions.Item>

              <Descriptions.Item label="SR Number">
                {selectedRow.purchase_requisition.store_requisition?.sr_no ??
                  '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Used For">
                {selectedRow.purchase_requisition.used_for ?? '-'}
              </Descriptions.Item>

              <Descriptions.Item label="To Location">
                {selectedRow.purchase_requisition.to_location ?? '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Workflow State">
                <Tag color="purple">
                  {selectedRow.workflow.state_name ??
                    selectedRow.workflow.state_code}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Price Status">
                <Tag
                  color={getStatusColor(
                    selectedRow.pricing_status,
                  )}
                >
                  {readableStatus(selectedRow.pricing_status)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Unit Price Request No">
                {selectedRow.unit_price_request?.request_no ?? '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Remarks" span={2}>
                {selectedRow.purchase_requisition.remarks ?? '-'}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5}>Purchase Requisition Items</Title>

            <Table
              rowKey="id"
              size="small"
              columns={itemColumns}
              dataSource={
                selectedRow.purchase_requisition.items ?? []
              }
              pagination={false}
              scroll={{ x: 1000 }}
            />

            {selectedRow.pricing_status === 'not_requested' && (
              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => {
                    setDrawerOpen(false);
                    openRequestPrice(selectedRow);
                  }}
                >
                  Request Price
                </Button>
              </div>
            )}
          </>
        )}

        <Title level={5} style={{ marginTop: 24 }}>
  Unit Price Details
</Title>

<Table
  rowKey="id"
  pagination={false}
  dataSource={selectedRow.unit_price_request?.items ?? []}
  scroll={{ x: 1300 }}
  columns={[
    {
      title: '#',
      width: 60,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Item',
      render: (_value, record) =>
        record.item?.item_description ||
        record.item?.item_no ||
        '-',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      align: 'right',
      render: (value) =>
        Number(value || 0).toLocaleString(),
    },
    {
      title: 'Previous Price',
      dataIndex: 'previous_unit_price',
      align: 'right',
      render: (value) =>
        value !== null && value !== undefined
          ? Number(value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      align: 'right',
      render: (value) =>
        value !== null && value !== undefined
          ? Number(value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      render: (value) => value || '-',
    },
    {
      title: 'VAT',
      dataIndex: 'vat_percentage',
      align: 'right',
      render: (value) =>
        `${Number(value || 0).toFixed(2)}%`,
    },
    {
      title: 'Line Total',
      dataIndex: 'line_total',
      align: 'right',
      render: (value) =>
        Number(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: 'Tax',
      dataIndex: 'tax_amount',
      align: 'right',
      render: (value) =>
        Number(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      align: 'right',
      render: (value) =>
        Number(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: 'Updated By',
      render: (_value, record) =>
        record.price_updated_by?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <Tag color="orange">
          {(value || '').replaceAll('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
  ]}
/>
      </Drawer>

      <Modal
        title="Request Unit Price"
        open={requestModalOpen}
        okText="Send Request"
        cancelText="Cancel"
        confirmLoading={requestSubmitting}
        onOk={submitPriceRequest}
        onCancel={() => {
          if (!requestSubmitting) {
            setRequestModalOpen(false);
            setRequestRemarks('');
          }
        }}
      >
        {selectedRow && (
          <>
            <Descriptions
              size="small"
              column={1}
              bordered
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="PR Number">
                {selectedRow.purchase_requisition.pr_no}
              </Descriptions.Item>

              <Descriptions.Item label="Items">
                {selectedRow.purchase_requisition.items?.length ?? 0}
              </Descriptions.Item>
            </Descriptions>

            <Text strong>Remarks</Text>

            <TextArea
              rows={4}
              maxLength={2000}
              showCount
              placeholder="Optional remarks for the pricing team..."
              value={requestRemarks}
              onChange={(event) =>
                setRequestRemarks(event.target.value)
              }
              style={{ marginTop: 8 }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default UnitPriceRequestPage;