import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  App,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Typography,
} from 'antd';

import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { categoriesApi } from '../../../api/categories';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import { createCategoryColumns } from './columns';
import CategoryForm from './form';

import type {
  Category,
  CategoryFormValues,
  CategoryFilters,
} from '../../../types/category';

const { Title, Text } = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues: Partial<CategoryFormValues> = {
  category: '',
  type: '',
  status: 'active',
};

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function CategoriesPage() {

  const { message } = App.useApp();

  const [form] =
    Form.useForm<CategoryFormValues>();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [drawerMode, setDrawerMode] =
    useState<DrawerMode>('create');

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState('');

  const [filters, setFilters] =
  useState<CategoryFilters>({
      page: 1,
      per_page: 10,
      sort_by: 'id',
      sort_direction: 'desc',
    });

  const [pagination, setPagination] =
    useState({
      current: 1,
      pageSize: 10,
      total: 0,
    });

  const loadCategories = useCallback(
    async () => {

      setLoading(true);

      try {

        const response =
          await categoriesApi.list(filters);

        setCategories(response.data ?? []);

        setPagination({
          current:
            response.pagination?.current_page ?? 1,

          pageSize:
            response.pagination?.per_page ??
            filters.per_page,

          total:
            response.pagination?.total ?? 0,
        });

      } catch (error) {

        console.error(error);

        message.error(
          'Unable to load categories.',
        );

      } finally {

        setLoading(false);

      }

    },
    [filters, message],
  );

  useEffect(() => {

    void loadCategories();

  }, [loadCategories]);

  const setCategoryFormValues = (
    category: Category,
  ) => {

    form.setFieldsValue({

      category:
        category.category,

      type:
        category.type,

      status:
        category.status,

    });

  };

  const handleTableChange = (
    params: DataTableChangeParams<Category>,
  ) => {

    setFilters((current) => ({
      ...current,

      page: params.page,

      per_page:
        params.pageSize,

      sort_by:
        params.sortField ??
        current.sort_by,

      sort_direction:
        params.sortDirection ??
        current.sort_direction,
    }));

  };

  const handleSearch = () => {

    setFilters((current) => ({
      ...current,

      page: 1,

      search:
        searchValue.trim() ||
        undefined,
    }));

  };

  const handleResetFilters = () => {

    setSearchValue('');

    setFilters({

      page: 1,

      per_page:
        pagination.pageSize,

      sort_by: 'id',

      sort_direction: 'desc',

    });

  };

  const handleCreate = () => {

    setEditingCategory(null);

    setDrawerMode('create');

    form.resetFields();

    form.setFieldsValue(defaultFormValues);

    setDrawerOpen(true);

  };

  const handleView = (
    category: Category,
  ) => {

    setEditingCategory(category);

    setDrawerMode('view');

    setDrawerOpen(true);

    setTimeout(() => {

      form.resetFields();

      setCategoryFormValues(category);

    }, 0);

  };

  const handleEdit = (
    category: Category,
  ) => {

    setEditingCategory(category);

    setDrawerMode('edit');

    setDrawerOpen(true);

    setTimeout(() => {

      form.resetFields();

      setCategoryFormValues(category);

    }, 0);

  };

    const handleDrawerClose = () => {

    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingCategory(null);
    setDrawerMode('create');

    form.resetFields();

  };

  const requestDelete = (
    category: Category,
  ) => {

    setSelectedCategory(category);
    setDeleteOpen(true);

  };

  const handleDelete = async () => {

    if (!selectedCategory) {
      return;
    }

    try {

      await categoriesApi.remove(
        selectedCategory.id,
      );

      message.success(
        'Category deleted successfully.',
      );

      setDeleteOpen(false);
      setSelectedCategory(null);

      await loadCategories();

    } catch (error) {

      console.error(error);

      message.error(
        'Unable to delete category.',
      );

    }

  };

  const handleSave = async () => {

    if (drawerMode === 'view') {

      handleDrawerClose();

      return;

    }

    try {

      const values =
        await form.validateFields();

      setSaving(true);

      const payload: CategoryFormValues = {

        category: normalizeText(
          values.category,
        ),

        type: normalizeText(
          values.type,
        ),

        status: values.status,

      };

      if (
        drawerMode === 'edit' &&
        editingCategory
      ) {

        await categoriesApi.update(
          editingCategory.id,
          payload,
        );

        message.success(
          'Category updated successfully.',
        );

      } else {

        await categoriesApi.create(
          payload,
        );

        message.success(
          'Category created successfully.',
        );

      }

      setDrawerOpen(false);

      setEditingCategory(null);

      setDrawerMode('create');

      form.resetFields();

      await loadCategories();

    } catch (error: unknown) {

      if (
        typeof error === 'object' &&
        error !== null &&
        'errorFields' in error
      ) {
        return;
      }

      console.error(error);

      const responseError = error as {
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

      const validationErrors =
        responseError.response?.data?.errors;

      if (
        responseError.response?.status === 422 &&
        validationErrors
      ) {

        const firstError =
          Object.values(validationErrors)
            .flat()[0];

        message.error(
          firstError ??
          'Please check the required fields.',
        );

        return;

      }

      message.error(

        responseError.response?.data?.message ??

        (
          drawerMode === 'edit'
            ? 'Unable to update category.'
            : 'Unable to create category.'
        ),

      );

    } finally {

      setSaving(false);

    }

  };

  const columns =
    createCategoryColumns({

      onView: handleView,

      onEdit: handleEdit,

      onDelete: requestDelete,

    });

  const drawerTitle =

    drawerMode === 'view'

      ? 'View Category'

      : drawerMode === 'edit'

      ? 'Edit Category'

      : 'Add Category';

  const submitText =

    drawerMode === 'view'

      ? 'Close'

      : drawerMode === 'edit'

      ? 'Update Category'

      : 'Save Category';

        return (
    <Card>
      <Flex
        justify="space-between"
        align="center"
        gap={16}
        wrap="wrap"
        style={{
          marginBottom: 20,
        }}
      >
        <div>
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Categories
          </Title>

          <Text type="secondary">
            Manage category master data.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Add Category
        </Button>
      </Flex>

      <Flex
        gap={12}
        wrap="wrap"
        style={{
          marginBottom: 20,
        }}
      >
        <Input
          allowClear
          value={searchValue}
          prefix={<SearchOutlined />}
          placeholder="Search category..."
          style={{
            width: 300,
          }}
          onChange={(event) =>
            setSearchValue(
              event.target.value,
            )
          }
          onPressEnter={handleSearch}
        />

        <Select
          allowClear
          placeholder="Status"
          style={{
            width: 150,
          }}
          value={filters.status}
          options={[
            {
              label: 'Active',
              value: 'active',
            },
            {
              label: 'Inactive',
              value: 'inactive',
            },
          ]}
          onChange={(status) => {
            setFilters((current) => ({
              ...current,
              page: 1,
              status,
            }));
          }}
        />

        <Select
          allowClear
          placeholder="Category Type"
          style={{
            width: 180,
          }}
          value={filters.type}
          options={[
            {
              label: 'Supplier',
              value: 'supplier',
            },
            {
              label: 'Material',
              value: 'material',
            },
            {
              label: 'Equipment',
              value: 'equipment',
            },
            {
              label: 'Service',
              value: 'service',
            },
            {
              label: 'Subcontractor',
              value: 'subcontractor',
            },
          ]}
          onChange={(type) => {
            setFilters((current) => ({
              ...current,
              page: 1,
              type,
            }));
          }}
        />

        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={
              handleResetFilters
            }
          >
            Reset
          </Button>
        </Space>
      </Flex>

      <Popconfirm
        title="Delete Category"
        description={`Delete ${
          selectedCategory?.category ??
          'this category'
        }?`}
        open={deleteOpen}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
        }}
        onConfirm={() =>
          void handleDelete()
        }
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedCategory(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Category>
        columns={columns}
        data={categories}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />

      <FormDrawer
        title={drawerTitle}
        open={drawerOpen}
        loading={saving}
        submitText={submitText}
        onClose={handleDrawerClose}
        onSubmit={() =>
          void handleSave()
        }
      >
        <CategoryForm
          form={form}
          initialValues={
            editingCategory ??
            defaultFormValues
          }
          disabled={
            saving ||
            drawerMode === 'view'
          }
        />
      </FormDrawer>
    </Card>
  );
}

export default CategoriesPage;