import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd';

import {
  PlusOutlined,
} from '@ant-design/icons';

import type {
  FormInstance,
} from 'antd';

import {
  useState,
} from 'react';

import CategoryDrawer from './categoryDrawer';

import type {
  SupplierCategory,
  SupplierFormData,
} from '../../../types/supplier';

interface SupplierFormProps {
  form: FormInstance<SupplierFormData>;
  disabled?: boolean;
  categories: SupplierCategory[];
  onCategoryCreated: (
    category: SupplierCategory,
  ) => void;
}

const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const yesNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

function SupplierForm({
  form,
  disabled = false,
  categories,
  onCategoryCreated,
}: SupplierFormProps) {
  const [
    categoryDrawerOpen,
    setCategoryDrawerOpen,
  ] = useState(false);

  const hasTin = Form.useWatch(
    'has_tin',
    form,
  );

  const handleCategoryCreated = (
    category: SupplierCategory,
  ) => {
    onCategoryCreated(category);

    form.setFieldValue(
      'category_id',
      category.id,
    );

    setCategoryDrawerOpen(false);
  };

  const handleHasTinChange = (
    value: boolean,
  ) => {
    if (!value) {
      form.setFieldValue(
        'tin',
        undefined,
      );
    }
  };

  return (
    <>
      <Form<SupplierFormData>
        form={form}
        layout="vertical"
        requiredMark
        initialValues={{
          has_tin: false,
          status: 'active',
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Supplier Number"
              name="supplier_no"
            >
              <Input
                disabled
                placeholder="Generated automatically"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Supplier Name"
              name="supplier_name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message:
                    'Supplier name is required.',
                },
                {
                  max: 200,
                  message:
                    'Supplier name cannot exceed 200 characters.',
                },
              ]}
            >
              <Input
                disabled={disabled}
                placeholder="Enter supplier name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Category"
              required
            >
              <Space.Compact
                style={{
                  width: '100%',
                }}
              >
                <Form.Item
                  name="category_id"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message:
                        'Category is required.',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    disabled={disabled}
                    placeholder="Select supplier category"
                    style={{
                      width: 'calc(100% - 42px)',
                    }}
                    options={categories.map(
                      (category) => ({
                        label: category.name,
                        value: category.id,
                      }),
                    )}
                  />
                </Form.Item>

                <Button
                  icon={<PlusOutlined />}
                  disabled={disabled}
                  title="Add new category"
                  onClick={() =>
                    setCategoryDrawerOpen(true)
                  }
                />
              </Space.Compact>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message:
                    'Phone number is required.',
                },
                {
                  max: 50,
                  message:
                    'Phone number cannot exceed 50 characters.',
                },
              ]}
            >
              <Input
                disabled={disabled}
                placeholder="Enter phone number"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  max: 2000,
                  message:
                    'Address cannot exceed 2000 characters.',
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                disabled={disabled}
                placeholder="Enter supplier address"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Have a TIN Number?"
              name="has_tin"
              rules={[
                {
                  required: true,
                  message:
                    'Please select Yes or No.',
                },
              ]}
            >
              <Select
                options={yesNoOptions}
                disabled={disabled}
                placeholder="Select"
                onChange={
                  handleHasTinChange
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message:
                    'Status is required.',
                },
              ]}
            >
              <Select
                options={statusOptions}
                disabled={disabled}
                placeholder="Select status"
              />
            </Form.Item>
          </Col>

          {hasTin === true && (
            <Col xs={24} md={12}>
              <Form.Item
                label="TIN Number"
                name="tin"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message:
                      'TIN number is required.',
                  },
                  {
                    max: 50,
                    message:
                      'TIN number cannot exceed 50 characters.',
                  },
                ]}
              >
                <Input
                  disabled={disabled}
                  placeholder="Enter TIN number"
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>

      <CategoryDrawer
        open={categoryDrawerOpen}
        onClose={() =>
          setCategoryDrawerOpen(false)
        }
        onCreated={
          handleCategoryCreated
        }
      />
    </>
  );
}

export default SupplierForm;