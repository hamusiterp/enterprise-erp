import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Select,
} from 'antd';

import { useState } from 'react';

import { categoriesApi } from '../../../api/categories';

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: (category: any) => void;
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

function CategoryDrawer({
  open,
  onClose,
  onCreated,
}: CategoryDrawerProps) {
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const [saving, setSaving] =
    useState(false);

  const handleSave = async () => {
    try {
      const values =
        await form.validateFields();

      setSaving(true);

      const response =
        await categoriesApi.create({
          category: values.category,
          status: values.status,
          type: 'supplier',
        });

      message.success(
        'Category created successfully.',
      );

      form.resetFields();

      const createdCategory =
  response.data;

onCreated({
  id: createdCategory.id,

  name:
    createdCategory.category
    ?? createdCategory.category,

  type:
    createdCategory.type,
});

      onClose();
    } catch (error: any) {
      console.error(error);

      message.error(
        error?.response?.data?.message ??
          'Unable to create category.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
  title="Add Category"
  size="large"
  open={open}
  destroyOnHidden
  forceRender
  onClose={onClose}
  afterOpenChange={(drawerOpen) => {
    if (!drawerOpen) {
      form.resetFields();
    }
  }}
  extra={
    <Button
      type="primary"
      loading={saving}
      onClick={() =>
        void handleSave()
      }
    >
      Save
    </Button>
  }
>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
        }}
      >
        <Form.Item
          label="Category Name"
          name="category"
          rules={[
            {
              required: true,
              message:
                'Category name is required.',
            },
          ]}
        >
          <Input
            placeholder="Enter category name"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select
            options={statusOptions}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default CategoryDrawer;