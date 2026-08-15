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
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { itemsApi } from '../../../api/items';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import {
  createItemColumns,
} from './columns';

import ItemForm from './form';

import type {
  Item,
  ItemFilters,
  ItemFormValues,
} from '../../../types/item';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues:
  Partial<ItemFormValues> = {
    item_no: '',
    item_description: '',
    category: undefined,
    unit: undefined,
    type: undefined,
    inventory: 'Stock',
    product_date: null,
    status: 'active',
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function ItemsPage() {
  const {
    message,
  } = App.useApp();

  const [form] =
    Form.useForm<ItemFormValues>();

  const [
    items,
    setItems,
  ] = useState<Item[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    exporting,
    setExporting,
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
    editingItem,
    setEditingItem,
  ] = useState<Item | null>(null);

  const [
    selectedItem,
    setSelectedItem,
  ] = useState<Item | null>(null);

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
  ] = useState<ItemFilters>({
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

  const loadItems =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await itemsApi.list(
            filters,
          );

        setItems(
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
          'Unable to load items.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const setItemFormValues = (
    item: Item,
  ) => {
    form.setFieldsValue({
      item_no:
        item.item_no,

      item_description:
        item.item_description,

      category:
        item.category,

      unit:
        item.unit,

      type:
        item.type,

      inventory:
        item.inventory,

      product_date:
        item.product_date,

      status:
        item.status,
    });
  };

  const handleTableChange = (
    params:
      DataTableChangeParams<Item>,
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

  const handleCreate = () => {
    setEditingItem(null);
    setDrawerMode('create');

    form.resetFields();

    form.setFieldsValue({
      ...defaultFormValues,
    });

    setDrawerOpen(true);
  };

  const handleView = (
    item: Item,
  ) => {
    setEditingItem(item);
    setDrawerMode('view');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();
      setItemFormValues(item);
    }, 0);
  };

  const handleEdit = (
    item: Item,
  ) => {
    setEditingItem(item);
    setDrawerMode('edit');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();
      setItemFormValues(item);
    }, 0);
  };

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingItem(null);
    setDrawerMode('create');

    form.resetFields();
  };

  const requestDelete = (
    item: Item,
  ) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedItem) {
        return;
      }

      try {
        await itemsApi.remove(
          selectedItem.id,
        );

        message.success(
          'Item deleted successfully.',
        );

        setDeleteOpen(false);
        setSelectedItem(null);

        await loadItems();
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete item.',
        );
      }
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
          ItemFormValues = {
            item_no: '',

            item_description:
              normalizeText(
                values.item_description,
              ),

            category:
              normalizeText(
                values.category,
              ),

            unit:
              normalizeText(
                values.unit,
              ),

            type:
              normalizeText(
                values.type,
              ),

            inventory:
              values.inventory,

            product_date:
              normalizeText(
                values.product_date,
              ) || null,

            status:
              values.status,
          };

        if (
          drawerMode === 'edit'
          && editingItem
        ) {
          await itemsApi.update(
            editingItem.id,
            payload,
          );

          message.success(
            'Item updated successfully.',
          );
        } else {
          await itemsApi.create(
            payload,
          );

          message.success(
            'Item created successfully.',
          );
        }

        setDrawerOpen(false);
        setEditingItem(null);
        setDrawerMode('create');

        form.resetFields();

        await loadItems();
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
              ? 'Unable to update item.'
              : 'Unable to create item.'
          ),
        );
      } finally {
        setSaving(false);
      }
    };

  const handleExport =
    async () => {
      setExporting(true);

      try {
        await itemsApi.exportFile(
          filters,
        );

        message.success(
          'Items exported successfully.',
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to export items.',
        );
      } finally {
        setExporting(false);
      }
    };

  const columns =
    createItemColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onDelete:
        requestDelete,
    });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Item'
      : drawerMode === 'edit'
        ? 'Edit Item'
        : 'Add Item';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Item'
        : 'Save Item';

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
            Items
          </Title>

          <Text type="secondary">
            Manage products,
            materials, assets and
            inventory items.
          </Text>
        </div>

        <Space>
          <Button
            icon={
              <DownloadOutlined />
            }
            loading={exporting}
            onClick={() =>
              void handleExport()
            }
          >
            Export Excel
          </Button>

          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={
              handleCreate
            }
          >
            Add Item
          </Button>
        </Space>
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
          placeholder="Search item number, description or category"
          style={{
            width: 320,
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
          placeholder="Inventory"
          style={{
            width: 160,
          }}
          value={
            filters.inventory
          }
          options={[
            {
              label: 'Stock',
              value: 'Stock',
            },
            {
              label: 'Non-Stock',
              value: 'Non-Stock',
            },
          ]}
          onChange={(
            inventory,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,
                inventory,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="Item Type"
          style={{
            width: 160,
          }}
          value={
            filters.type
          }
          options={[
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
          ]}
          onChange={(type) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,
                type,
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
        title="Delete item"
        description={`Delete ${
          selectedItem
            ?.item_description
          ?? 'this item'
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
          setSelectedItem(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Item>
        columns={columns}
        data={items}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={
          handleTableChange
        }
        scroll={{
          x: 1600,
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
        <ItemForm
          form={form}
          disabled={
            saving
            || drawerMode === 'view'
          }
        />
      </FormDrawer>
    </Card>
  );
}

export default ItemsPage;