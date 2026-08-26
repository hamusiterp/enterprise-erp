import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';

import {
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import {
  createUnitOfMeasurement,
  fetchUnitsOfMeasurement,
  updateUnitOfMeasurement,
} from '../../../api/unitsOfMeasurement';

import type {
  UnitOfMeasurement,
  UnitOfMeasurementPayload,
} from '../../../api/unitsOfMeasurement';

const UnitsOfMeasurementPage: React.FC = () => {
  const [form] = Form.useForm();

  const [data, setData] =
    useState<UnitOfMeasurement[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<UnitOfMeasurement | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const result =
        await fetchUnitsOfMeasurement();

      setData(result);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          'Failed to load units of measurement.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);

    form.resetFields();

    form.setFieldsValue({
      decimal_places: 0,
      is_active: true,
    });

    setDrawerOpen(true);
  };

  const openEdit = (
    record: UnitOfMeasurement,
  ) => {
    setEditing(record);

    form.setFieldsValue({
      code: record.code,
      name: record.name,
      symbol: record.symbol,
      category: record.category,
      decimal_places:
        record.decimal_places,
      is_active:
        record.is_active,
      description:
        record.description,
    });

    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const payload:
        UnitOfMeasurementPayload = {
        code:
          values.code
            .trim()
            .toUpperCase(),

        name:
          values.name.trim(),

        symbol:
          values.symbol?.trim() ||
          null,

        category:
          values.category ||
          null,

        decimal_places:
          Number(
            values.decimal_places,
          ),

        is_active:
          values.is_active,

        description:
          values.description ||
          null,
      };

      if (!editing) {
        await createUnitOfMeasurement(
          payload,
        );

        message.success(
          'Unit of measurement created successfully.',
        );
      } else {
        await updateUnitOfMeasurement(
          editing.id,
          payload,
        );

        message.success(
          'Unit of measurement updated successfully.',
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
          'Failed to save unit of measurement.',
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (
        value: string | null,
      ) => value || '-',
    },
    {
      title: 'Category',
      key: 'category',
      render: (
        _: unknown,
        record: UnitOfMeasurement,
      ) =>
        record.category ? (
          <Tag>
            {record.category}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Decimals',
      dataIndex:
        'decimal_places',
      key:
        'decimal_places',
      width: 100,
    },
    {
      title: 'Status',
      key: 'status',
      render: (
        _: unknown,
        record: UnitOfMeasurement,
      ) =>
        record.is_active ? (
          <Tag color="green">
            Active
          </Tag>
        ) : (
          <Tag color="red">
            Inactive
          </Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (
        _: unknown,
        record: UnitOfMeasurement,
      ) => (
        <Button
          size="small"
          icon={
            <EditOutlined />
          }
          onClick={() =>
            openEdit(record)
          }
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Units of Measurement"
        extra={
          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={
              openCreate
            }
          >
            New Unit
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
        />
      </Card>

      <Drawer
        title={
          editing
            ? 'Edit Unit of Measurement'
            : 'Create Unit of Measurement'
        }
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
        width={520}
        destroyOnHidden
        extra={
          <Space>
            <Button
              onClick={() =>
                setDrawerOpen(
                  false,
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="primary"
              loading={saving}
              onClick={
                handleSave
              }
            >
              {editing
                ? 'Update'
                : 'Save'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required:
                  true,
                message:
                  'Code is required.',
              },
            ]}
          >
            <Input placeholder="PCS" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required:
                  true,
                message:
                  'Name is required.',
              },
            ]}
          >
            <Input placeholder="Pieces" />
          </Form.Item>

          <Form.Item
            name="symbol"
            label="Symbol"
          >
            <Input placeholder="pcs" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
          >
            <Select
              allowClear
              options={[
                {
                  label:
                    'Quantity',
                  value:
                    'quantity',
                },
                {
                  label:
                    'Weight',
                  value:
                    'weight',
                },
                {
                  label:
                    'Volume',
                  value:
                    'volume',
                },
                {
                  label:
                    'Length',
                  value:
                    'length',
                },
                {
                  label:
                    'Area',
                  value:
                    'area',
                },
                {
                  label:
                    'Package',
                  value:
                    'package',
                },
                {
                  label:
                    'Other',
                  value:
                    'other',
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="decimal_places"
            label="Decimal Places"
            rules={[
              {
                required:
                  true,
              },
            ]}
            extra="Use 0 for units such as Pieces, Box or Ream. Use decimals for units such as KG, Litre or Meter."
          >
            <InputNumber
              min={0}
              max={6}
              style={{
                width:
                  '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={4}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UnitsOfMeasurementPage;