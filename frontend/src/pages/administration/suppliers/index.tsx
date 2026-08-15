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

import {
  suppliersApi,
} from '../../../api/suppliers';

import {
  categoriesApi,
} from '../../../api/categories';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import {
  createSupplierColumns,
} from './columns';

import SupplierForm from './form';

import type {
  Supplier,
  SupplierCategory,
  SupplierFilters,
  SupplierFormData,
} from '../../../types/supplier';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues:
  Partial<SupplierFormData> = {
    supplier_no: '',
    supplier_name: '',
    category_id: undefined,
    address: '',
    phone_number: '',
    has_tin: false,
    tin: null,
    status: 'active',
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function SuppliersPage() {
  const {
    message,
  } = App.useApp();

  const [form] =
    Form.useForm<SupplierFormData>();

  const [
    suppliers,
    setSuppliers,
  ] = useState<Supplier[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<SupplierCategory[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    drawerMode,
    setDrawerMode,
  ] = useState<DrawerMode>(
    'create',
  );

  const [
    editingSupplier,
    setEditingSupplier,
  ] = useState<Supplier | null>(
    null,
  );

  const [
    selectedSupplier,
    setSelectedSupplier,
  ] = useState<Supplier | null>(
    null,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  const [
    filters,
    setFilters,
  ] = useState<SupplierFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'id',
    sort_direction: 'desc',
  });

  const [
    pagination,
    setPagination,
  ] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadCategories =
  useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const options =
  await categoriesApi.options();

      const mappedCategories:
        SupplierCategory[] =
        options.map((item) => ({
          id:
            item.id
            ?? item.value,

          name:
            item.name
            ?? item.category
            ?? item.label,

          type:
            item.type,
        }));

      setCategories(
        mappedCategories,
      );
    } catch (error) {
      console.error(
        'Category loading error:',
        error,
      );

      setCategories([]);

      message.error(
        'Unable to load supplier categories.',
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, [message]);

  const loadSuppliers =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await suppliersApi.list(
            filters,
          );

        setSuppliers(
          response.data ?? [],
        );

        setPagination({
          current:
            response.pagination
              ?.current_page ?? 1,

          pageSize:
            response.pagination
              ?.per_page
            ?? filters.per_page
            ?? 10,

          total:
            response.pagination
              ?.total ?? 0,
        });
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load suppliers.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  const setSupplierFormValues = (
    supplier: Supplier,
  ) => {
    form.setFieldsValue({
      supplier_no:
        supplier.supplier_no,

      supplier_name:
        supplier.supplier_name,

      category_id:
        supplier.category_id,

      address:
        supplier.address ?? '',

      phone_number:
        supplier.phone_number,

      has_tin:
        supplier.has_tin,

      tin:
        supplier.has_tin
          ? supplier.tin
          : null,

      status:
        supplier.status,
    });
  };

  const handleTableChange = (
    params:
      DataTableChangeParams<Supplier>,
  ) => {
    setFilters((current) => ({
      ...current,

      page:
        params.page,

      per_page:
        params.pageSize,

      sort_by:
        params.sortField
        ?? current.sort_by,

      sort_direction:
        params.sortDirection
        ?? current.sort_direction,
    }));
  };

  const handleSearch = () => {
    setFilters((current) => ({
      ...current,
      page: 1,

      search:
        searchValue.trim()
        || undefined,
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

  const handleCreate =
    async () => {
      setEditingSupplier(null);
      setDrawerMode('create');

      form.resetFields();

      try {
        const supplierNumber =
          await suppliersApi
            .nextSupplierNumber();

        form.setFieldsValue({
          ...defaultFormValues,

          supplier_no:
            supplierNumber,
        });
      } catch (error) {
        console.error(error);

        form.setFieldsValue({
          ...defaultFormValues,
        });

        message.warning(
          'Supplier number will be generated when the supplier is saved.',
        );
      }

      setDrawerOpen(true);
    };

  const handleView = (
    supplier: Supplier,
  ) => {
    setEditingSupplier(
      supplier,
    );

    setDrawerMode('view');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setSupplierFormValues(
        supplier,
      );
    }, 0);
  };

  const handleEdit = (
    supplier: Supplier,
  ) => {
    setEditingSupplier(
      supplier,
    );

    setDrawerMode('edit');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setSupplierFormValues(
        supplier,
      );
    }, 0);
  };

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingSupplier(null);
    setDrawerMode('create');

    form.resetFields();
  };

  const requestDelete = (
    supplier: Supplier,
  ) => {
    setSelectedSupplier(
      supplier,
    );

    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedSupplier) {
        return;
      }

      try {
        await suppliersApi.remove(
          selectedSupplier.id,
        );

        message.success(
          'Supplier deleted successfully.',
        );

        setDeleteOpen(false);
        setSelectedSupplier(null);

        await loadSuppliers();
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete supplier.',
        );
      }
    };

  const handleCategoryCreated = (
    category: SupplierCategory,
  ) => {
    setCategories((current) => {
      const categoryExists =
        current.some(
          (item) =>
            item.id === category.id,
        );

      if (categoryExists) {
        return current.map(
          (item) =>
            item.id === category.id
              ? category
              : item,
        );
      }

      return [
        ...current,
        category,
      ].sort(
        (first, second) =>
          first.name.localeCompare(
            second.name,
          ),
      );
    });

    form.setFieldValue(
      'category_id',
      category.id,
    );
  };

  const handleSave =
    async () => {
      if (
        drawerMode === 'view'
      ) {
        handleDrawerClose();
        return;
      }

      try {
        const values =
          await form.validateFields();

        setSaving(true);

        const payload:
          SupplierFormData = {
            supplier_no: '',

            supplier_name:
              normalizeText(
                values.supplier_name,
              ),

            category_id:
              values.category_id,

            address:
              normalizeText(
                values.address,
              ),

            phone_number:
              normalizeText(
                values.phone_number,
              ),

            has_tin:
              values.has_tin,

            tin:
              values.has_tin
                ? normalizeText(
                    values.tin,
                  )
                : null,

            status:
              values.status,
          };

        if (
          drawerMode === 'edit'
          && editingSupplier
        ) {
          await suppliersApi.update(
            editingSupplier.id,
            payload,
          );

          message.success(
            'Supplier updated successfully.',
          );
        } else {
          await suppliersApi.create(
            payload,
          );

          message.success(
            'Supplier created successfully.',
          );
        }

        setDrawerOpen(false);
        setEditingSupplier(null);
        setDrawerMode('create');

        form.resetFields();

        await loadSuppliers();
      } catch (error: unknown) {
        if (
          typeof error === 'object'
          && error !== null
          && 'errorFields' in error
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

        const validationErrors =
          responseError.response
            ?.data?.errors;

        if (
          responseError.response
            ?.status === 422
          && validationErrors
        ) {
          const firstError =
            Object.values(
              validationErrors,
            ).flat()[0];

          message.error(
            firstError
            ?? 'Please check the required fields.',
          );

          return;
        }

        message.error(
          responseError.response
            ?.data?.message
          ?? (
            drawerMode === 'edit'
              ? 'Unable to update supplier.'
              : 'Unable to create supplier.'
          ),
        );
      } finally {
        setSaving(false);
      }
    };

  const columns =
    createSupplierColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onDelete:
        requestDelete,
    });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Supplier'
      : drawerMode === 'edit'
        ? 'Edit Supplier'
        : 'Add Supplier';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Supplier'
        : 'Save Supplier';

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
            style={{
              margin: 0,
            }}
          >
            Suppliers
          </Title>

          <Text type="secondary">
            Manage suppliers and
            supplier categories.
          </Text>
        </div>

        <Button
          type="primary"
          icon={
            <PlusOutlined />
          }
          onClick={() =>
            void handleCreate()
          }
        >
          Add Supplier
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
          prefix={
            <SearchOutlined />
          }
          placeholder="Search supplier number, name, phone or TIN"
          style={{
            width: 340,
          }}
          onChange={(event) =>
            setSearchValue(
              event.target.value,
            )
          }
          onPressEnter={
            handleSearch
          }
        />

        <Select
          allowClear
          placeholder="Status"
          style={{
            width: 140,
          }}
          value={
            filters.status
          }
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
            setFilters(
              (current) => ({
                ...current,
                page: 1,
                status,
              }),
            );
          }}
        />

        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Category"
          loading={
            categoriesLoading
          }
          style={{
            width: 220,
          }}
          value={
            filters.category_id
          }
          options={categories.map(
            (category) => ({
              label:
                category.name,

              value:
                category.id,
            }),
          )}
          onChange={(categoryId) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                category_id:
                  categoryId,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="TIN Status"
          style={{
            width: 160,
          }}
          value={
            filters.has_tin
          }
          options={[
            {
              label: 'With TIN',
              value: true,
            },
            {
              label: 'Without TIN',
              value: false,
            },
          ]}
          onChange={(hasTin) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                has_tin:
                  hasTin,
              }),
            );
          }}
        />

        <Space>
          <Button
            type="primary"
            icon={
              <SearchOutlined />
            }
            onClick={
              handleSearch
            }
          >
            Search
          </Button>

          <Button
            icon={
              <ReloadOutlined />
            }
            onClick={
              handleResetFilters
            }
          >
            Reset
          </Button>
        </Space>
      </Flex>

      <Popconfirm
        title="Delete supplier"
        description={`Delete ${
          selectedSupplier
            ?.supplier_name
          ?? 'this supplier'
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
          setSelectedSupplier(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Supplier>
        columns={columns}
        data={suppliers}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={
          handleTableChange
        }
        scroll={{
          x: 1700,
        }}
      />

      <FormDrawer
        title={drawerTitle}
        open={drawerOpen}
        loading={saving}
        submitText={submitText}
        onClose={
          handleDrawerClose
        }
        onSubmit={() =>
          void handleSave()
        }
      >
        <SupplierForm
          form={form}
          disabled={
            saving
            || drawerMode === 'view'
          }
          categories={
            categories
          }
          onCategoryCreated={
            handleCategoryCreated
          }
        />
      </FormDrawer>
    </Card>
  );
}

export default SuppliersPage;