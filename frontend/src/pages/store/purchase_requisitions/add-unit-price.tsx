import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Form,
InputNumber,
Divider,
Alert,
Select,
} from 'antd';
import {
  DollarOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import apiClient from '../../../api/client';

const { Title, Text } = Typography;

interface UnitPriceRequest {
  id: number;
  request_no: string;
  request_date: string;
  source_type: string;
  source_id: number | null;
  source_reference: string | null;
  status: string;
  remarks?: string | null;
  requester?: {
    id: number;
    name: string;
    email?: string;
  } | null;
}

interface Item {
  id: number;
  item_no: string;
  item_description: string;
  category?: string | null;
}

interface Uom {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
}

interface UnitPriceRequestItem {
  id: number;
  unit_price_request_id: number;
  quantity: string;
  previous_unit_price: string | null;
  unit_price: string | null;
  vat_percentage: string;
  status: string;
  supplier_name?: string | null;
  supplier_stock?: string | null;
  is_out_of_stock: boolean;

  request: UnitPriceRequest;
  item?: Item | null;
  uom?: Uom | null;
}

interface AddUnitPriceResponse {
  data: UnitPriceRequestItem[];

  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface Supplier {
  id: number;
  supplier_no: string;
  supplier_name: string;
  phone_number?: string | null;
  tin?: string | null;
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  return value.split('T')[0];
};

const AddUnitPricePage: React.FC = () => {
  const [rows, setRows] = useState<UnitPriceRequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
const [suppliers, setSuppliers] = useState<Supplier[]>([]);
const [supplierLoading, setSupplierLoading] = useState(false);

  const [selectedRow, setSelectedRow] =
    useState<UnitPriceRequestItem | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadQueue = useCallback(async () => {
    setLoading(true);

    try {
      const response =
        await apiClient.get<AddUnitPriceResponse>(
          '/api/store-requisitions/add-unit-price',
          {
            params: {
              page,
              per_page: pageSize,
              search: search || undefined,
            },
          },
        );

      setRows(response.data.data ?? []);
      setTotal(response.data.meta?.total ?? 0);
    } catch (error: any) {
      console.error('ADD UNIT PRICE ERROR:', error);

      message.error(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to load requested Unit Price items.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const openReview = (record: UnitPriceRequestItem) => {
  setSelectedRow(record);

  form.setFieldsValue({
    unit_price: null,
    vat_percentage: 15,
    supplier_id: null,
    supplier_stock: null,
    remarks: '',
  });

  loadSuppliers();

  setDrawerOpen(true);
};

const loadSuppliers = async (searchValue = '') => {
  setSupplierLoading(true);

  try {
    const response = await apiClient.get(
      '/api/store-requisitions/add-unit-price/suppliers',
      {
        params: {
          search: searchValue || undefined,
        },
      },
    );

    setSuppliers(response.data.data ?? []);
  } catch (error: any) {
    console.error('SUPPLIER LOAD ERROR:', error);

    message.error(
      error?.response?.data?.message ||
        'Unable to load suppliers.',
    );
  } finally {
    setSupplierLoading(false);
  }
};

const submitPrice = async () => {
  if (!selectedRow) {
    return;
  }

  try {
    const values = await form.validateFields();

    setSubmitting(true);

    await apiClient.post(
      `/api/store-requisitions/add-unit-price/${selectedRow.id}`,
      {
        unit_price: values.unit_price,
        vat_percentage: values.vat_percentage,
        supplier_id: values.supplier_id,
        supplier_stock: values.supplier_stock ?? null,
        remarks: values.remarks || null,
      },
    );

    message.success(
      'Unit Price added successfully and sent for confirmation.',
    );

    setDrawerOpen(false);
    setSelectedRow(null);
    form.resetFields();

    await loadQueue();
  } catch (error: any) {
    if (error?.errorFields) {
      return;
    }

    console.error('ADD PRICE ERROR:', error);

    message.error(
      error?.response?.data?.message ||
        error?.message ||
        'Unable to add Unit Price.',
    );
  } finally {
    setSubmitting(false);
  }
};

  const columns = [
    {
      title: 'Request No',
      key: 'request_no',
      render: (_: unknown, record: UnitPriceRequestItem) => (
        <Text strong>
          {record.request?.request_no || '-'}
        </Text>
      ),
    },
    {
      title: 'Request Date',
      key: 'request_date',
      render: (_: unknown, record: UnitPriceRequestItem) =>
        formatDate(record.request?.request_date),
    },
    {
      title: 'PR Number',
      key: 'pr_number',
      render: (_: unknown, record: UnitPriceRequestItem) =>
        record.request?.source_reference || '-',
    },
    {
      title: 'Item No',
      key: 'item_no',
      render: (_: unknown, record: UnitPriceRequestItem) =>
        record.item?.item_no || '-',
    },
    {
      title: 'Item Description',
      key: 'item_description',
      render: (_: unknown, record: UnitPriceRequestItem) =>
        record.item?.item_description || '-',
    },
    {
      title: 'UOM',
      key: 'uom',
      render: (_: unknown, record: UnitPriceRequestItem) =>
        record.uom?.code || record.uom?.name || '-',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
      render: (value: string) =>
        Number(value || 0).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="blue">
          {(status || '').replaceAll('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      render: (_: unknown, record: UnitPriceRequestItem) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => openReview(record)}
        >
          Add Price
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ margin: 0 }}>
              <DollarOutlined /> Add Unit Price
            </Title>

            <Text type="secondary">
              Enter supplier and pricing information for requested items.
            </Text>
          </Space>
        </Col>

        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadQueue}
            loading={loading}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            allowClear
            style={{ width: 320 }}
            placeholder="Search request, PR or item..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <Button
            onClick={() => {
              setSearch('');
              setPage(1);
            }}
          >
            Reset
          </Button>
        </Space>

        <Table<UnitPriceRequestItem>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rows}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (value) => `Total ${value} item(s)`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
        />
      </Card>

      <Drawer
        title="Add Unit Price"
        width={700}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRow(null);
        }}
      >
        {selectedRow && (
          <>
            <Descriptions
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Request No">
                {selectedRow.request?.request_no || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Request Date">
                {formatDate(selectedRow.request?.request_date)}
              </Descriptions.Item>

              <Descriptions.Item label="PR Number">
                {selectedRow.request?.source_reference || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Requested By">
                {selectedRow.request?.requester?.name || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Item No">
                {selectedRow.item?.item_no || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="UOM">
                {selectedRow.uom?.code ||
                  selectedRow.uom?.name ||
                  '-'}
              </Descriptions.Item>

              <Descriptions.Item
                label="Item Description"
                span={2}
              >
                {selectedRow.item?.item_description || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                {Number(
                  selectedRow.quantity || 0,
                ).toLocaleString()}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color="blue">
                  {selectedRow.status
                    .replaceAll('_', ' ')
                    .toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label="Request Remarks"
                span={2}
              >
                {selectedRow.request?.remarks || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Card
  size="small"
  title="Pricing Information"
  style={{ marginTop: 20 }}
>
  <Form
    form={form}
    layout="vertical"
  >
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Unit Price"
          name="unit_price"
          rules={[
            {
              required: true,
              message: 'Enter Unit Price',
            },
            {
              type: 'number',
              min: 0.01,
              message: 'Unit Price must be greater than zero',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            precision={2}
            placeholder="Enter Unit Price"
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="VAT %"
          name="vat_percentage"
          rules={[
            {
              required: true,
              message: 'Enter VAT percentage',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            precision={2}
            addonAfter="%"
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
  label="Supplier"
  name="supplier_id"
  rules={[
    {
      required: true,
      message: 'Select supplier',
    },
  ]}
>
  <Select
    showSearch
    allowClear
    placeholder="Search supplier..."
    loading={supplierLoading}
    filterOption={false}
    onSearch={(value) => {
      loadSuppliers(value);
    }}
    options={suppliers.map((supplier) => ({
      value: supplier.id,
      label: `${supplier.supplier_no} - ${supplier.supplier_name}`,
    }))}
    notFoundContent={
      supplierLoading ? 'Loading...' : 'No supplier found'
    }
  />
</Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Supplier Stock"
          name="supplier_stock"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={4}
            placeholder="Available quantity"
          />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item
      label="Remarks"
      name="remarks"
    >
      <Input.TextArea
        rows={3}
        maxLength={1000}
        showCount
        placeholder="Optional remarks"
      />
    </Form.Item>

    <Divider />

    <Alert
      type="info"
      showIcon
      message="After submission"
      description="The price will be sent back to Unit Price Update Request for confirmation. The procurement workflow will remain at the Unit Price stage until confirmation."
      style={{ marginBottom: 16 }}
    />

    <Space>
      <Button
        type="primary"
        icon={<DollarOutlined />}
        loading={submitting}
        onClick={submitPrice}
      >
        Submit Unit Price
      </Button>

      <Button
        disabled={submitting}
        onClick={() => {
          setDrawerOpen(false);
          setSelectedRow(null);
          form.resetFields();
        }}
      >
        Cancel
      </Button>
    </Space>
  </Form>
</Card>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default AddUnitPricePage;