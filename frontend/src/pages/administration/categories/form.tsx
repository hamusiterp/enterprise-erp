import { Form, Input, Select } from 'antd';
import type { Category, CategoryFormValues } from '../../../types/category';

const { Option } = Select;

interface CategoryFormProps {
  form: any;
  initialValues?: Partial<Category>;
  disabled?: boolean;
}

const CATEGORY_TYPES = [
  { value: 'Supplier', label: 'Supplier' },
  { value: 'Material', label: 'Material' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Service', label: 'Service' },
  { value: 'Subcontractor', label: 'Subcontractor' },
  { value: 'Machine', label: 'Machine' },
];

export default function CategoryForm({
  form,
  initialValues,
  disabled = false,
}: CategoryFormProps) {
  return (
    <Form<CategoryFormValues>
      form={form}
      layout="vertical"
      initialValues={{
        status: 'active',
        ...initialValues,
      }}
    >
      <Form.Item
        label="Category Name"
        name="category"
        rules={[
          {
            required: true,
            message: 'Please enter category name',
          },
          {
            max: 50,
            message: 'Maximum 50 characters',
          },
        ]}
      >
        <Input
         disabled={disabled}
          placeholder="Enter category name"
          allowClear
          maxLength={50}
        />
      </Form.Item>

      <Form.Item
        label="Category Type"
        name="type"
        rules={[
          {
            required: true,
            message: 'Please select category type',
          },
        ]}
      >
        <Select
        disabled={disabled}
          placeholder="Select category type"
          allowClear
        >
          {CATEGORY_TYPES.map((item) => (
            <Option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select disabled={disabled}>
          <Option value="active">
            Active
          </Option>

          <Option value="inactive">
            Inactive
          </Option>
        </Select>
      </Form.Item>
    </Form>
  );
}