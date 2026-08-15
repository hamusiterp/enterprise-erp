import {
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';

import type {
  FormInstance,
} from 'antd';

import type {
  ItemFormValues,
} from '../../../types/item';

interface ItemFormProps {
  form: FormInstance<ItemFormValues>;
  disabled?: boolean;
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

const inventoryOptions = [
  {
    label: 'Stock',
    value: 'Stock',
  },
  {
    label: 'Non-Stock',
    value: 'Non-Stock',
  },
];

const categoryOptions = [
  {
    label: 'Office Supplies',
    value: 'Office Supplies',
  },
  {
    label: 'IT Equipment',
    value: 'IT Equipment',
  },
  {
    label: 'Furniture',
    value: 'Furniture',
  },
  {
    label: 'Electrical',
    value: 'Electrical',
  },
  {
    label: 'Construction Materials',
    value: 'Construction Materials',
  },
  {
    label: 'Cleaning Supplies',
    value: 'Cleaning Supplies',
  },
  {
    label: 'Vehicle Parts',
    value: 'Vehicle Parts',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

const unitOptions = [
  {
    label: 'Piece',
    value: 'Piece',
  },
  {
    label: 'Box',
    value: 'Box',
  },
  {
    label: 'Pack',
    value: 'Pack',
  },
  {
    label: 'Set',
    value: 'Set',
  },
  {
    label: 'Kilogram',
    value: 'Kilogram',
  },
  {
    label: 'Gram',
    value: 'Gram',
  },
  {
    label: 'Liter',
    value: 'Liter',
  },
  {
    label: 'Meter',
    value: 'Meter',
  },
  {
    label: 'Roll',
    value: 'Roll',
  },
  {
    label: 'Carton',
    value: 'Carton',
  },
];

const typeOptions = [
  {
    label: 'Product',
    value: 'Product',
  },
  {
    label: 'Material',
    value: 'Material',
  },
  {
    label: 'Asset',
    value: 'Asset',
  },
  {
    label: 'Consumable',
    value: 'Consumable',
  },
  {
    label: 'Service',
    value: 'Service',
  },
];

function ItemForm({
  form,
  disabled = false,
}: ItemFormProps) {
  return (
    <Form<ItemFormValues>
      form={form}
      layout="vertical"
      requiredMark
      initialValues={{
        status: 'active',
        inventory: 'Stock',
        product_date: null,
      }}
    >
      <Row gutter={[16, 0]}>
        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="item_no"
            label="Item Number"
          >
            <Input
              placeholder="Generated automatically"
              disabled
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message:
                  'Category is required.',
              },
              {
                max: 50,
                message:
                  'Category cannot exceed 50 characters.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={
                categoryOptions
              }
              optionFilterProp="label"
              placeholder="Select category"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="unit"
            label="Unit"
            rules={[
              {
                required: true,
                message:
                  'Unit is required.',
              },
              {
                max: 20,
                message:
                  'Unit cannot exceed 20 characters.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={unitOptions}
              optionFilterProp="label"
              placeholder="Select unit"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="type"
            label="Item Type"
            rules={[
              {
                required: true,
                message:
                  'Item type is required.',
              },
              {
                max: 30,
                message:
                  'Item type cannot exceed 30 characters.',
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={typeOptions}
              optionFilterProp="label"
              placeholder="Select item type"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="inventory"
            label="Inventory"
            rules={[
              {
                required: true,
                message:
                  'Inventory type is required.',
              },
            ]}
          >
            <Select
              options={
                inventoryOptions
              }
              placeholder="Select inventory"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="product_date"
            label="Product Date"
            rules={[
              {
                max: 10,
                message:
                  'Use YYYY-MM-DD format.',
              },
              {
                pattern:
                  /^\d{4}-\d{2}-\d{2}$/,
                message:
                  'Product date must be YYYY-MM-DD.',
              },
            ]}
          >
            <Input
              placeholder="YYYY-MM-DD"
              maxLength={10}
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col
          xs={24}
          md={8}
        >
          <Form.Item
            name="status"
            label="Status"
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
              placeholder="Select status"
              disabled={disabled}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="item_description"
            label="Item Description"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Item description is required.',
              },
              {
                max: 1000,
                message:
                  'Description cannot exceed 1000 characters.',
              },
            ]}
          >
            <Input.TextArea
              rows={5}
              showCount
              maxLength={1000}
              placeholder="Enter item description"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default ItemForm;