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
  customersApi,
} from '../../../api/customers';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import {
  customerColumns,
} from './columns';

import CustomerForm from './form';

import type {
  Customer,
  CustomerFilters,
  CustomerFormValues,
} from '../../../types/customer';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues:
  Partial<CustomerFormValues> = {
    customer_no: '',
    customer_type: undefined,

    firstname: '',
    lastname: '',
    company_name: '',

    email_address: '',
    tin_number: '',
    contact_person: '',
    phone_number: '',
    location: '',

    customer_status: 'active',

    withhold: false,
    withhold_percent: null,

    withhold_from_advance: false,
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function CustomersPage() {
  const {
    message,
  } = App.useApp();

  const [form] =
    Form.useForm<CustomerFormValues>();

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    loading,
    setLoading,
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
    editingCustomer,
    setEditingCustomer,
  ] = useState<Customer | null>(
    null,
  );

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<Customer | null>(
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
  ] = useState<CustomerFilters>({
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

  const loadCustomers =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await customersApi.list(
            filters,
          );

        setCustomers(
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
          'Unable to load customers.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const setCustomerFormValues = (
    customer: Customer,
  ) => {
    form.setFieldsValue({
      customer_no:
        customer.customer_no,

      customer_type:
        customer.customer_type,

      firstname:
        customer.firstname ?? '',

      lastname:
        customer.lastname ?? '',

      company_name:
        customer.company_name ?? '',

      email_address:
        customer.email_address ?? '',

      tin_number:
        customer.tin_number ?? '',

      contact_person:
        customer.contact_person ?? '',

      phone_number:
        customer.phone_number,

      location:
        customer.location,

      customer_status:
        customer.customer_status,

      withhold:
        customer.withhold,

      withhold_percent:
        customer.withhold_percent !== null
        && customer.withhold_percent !== undefined
          ? Number(
              customer.withhold_percent,
            )
          : null,

      withhold_from_advance:
        customer.withhold_from_advance,
    });
  };

  const handleTableChange = (
    params:
      DataTableChangeParams<Customer>,
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
      setEditingCustomer(null);
      setDrawerMode('create');

      form.resetFields();

      try {
        const customerNumber =
          await customersApi
            .nextCustomerNumber();

        form.setFieldsValue({
          ...defaultFormValues,

          customer_no:
            customerNumber,
        });
      } catch (error) {
        console.error(error);

        form.setFieldsValue({
          ...defaultFormValues,
        });

        message.warning(
          'Customer number will be generated when the customer is saved.',
        );
      }

      setDrawerOpen(true);
    };

  const handleView = (
    customer: Customer,
  ) => {
    setEditingCustomer(
      customer,
    );

    setDrawerMode('view');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setCustomerFormValues(
        customer,
      );
    }, 0);
  };

  const handleEdit = (
    customer: Customer,
  ) => {
    setEditingCustomer(
      customer,
    );

    setDrawerMode('edit');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setCustomerFormValues(
        customer,
      );
    }, 0);
  };

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);

    setEditingCustomer(null);

    setDrawerMode('create');

    form.resetFields();
  };

  const requestDelete = (
    customer: Customer,
  ) => {
    setSelectedCustomer(
      customer,
    );

    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedCustomer) {
        return;
      }

      try {
        await customersApi.remove(
          selectedCustomer.id,
        );

        message.success(
          'Customer deleted successfully.',
        );

        setDeleteOpen(false);

        setSelectedCustomer(null);

        await loadCustomers();
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete customer.',
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
          CustomerFormValues = {
            customer_no: '',

            customer_type:
              values.customer_type,

            firstname:
              values.customer_type
                === 'individual'
                ? normalizeText(
                    values.firstname,
                  )
                : null,

            lastname:
              values.customer_type
                === 'individual'
                ? normalizeText(
                    values.lastname,
                  )
                : null,

            company_name:
              values.customer_type
                === 'company'
                ? normalizeText(
                    values.company_name,
                  )
                : null,

            email_address:
              normalizeText(
                values.email_address,
              ),

            tin_number:
              values.customer_type
                === 'company'
                ? normalizeText(
                    values.tin_number,
                  )
                : null,

            contact_person:
              normalizeText(
                values.contact_person,
              ),

            phone_number:
              normalizeText(
                values.phone_number,
              ),

            location:
              normalizeText(
                values.location,
              ),

            customer_status:
              values.customer_status,

            withhold:
              values.withhold,

            withhold_percent:
              values.withhold
                ? values.withhold_percent
                : null,

            withhold_from_advance:
              values.withhold_from_advance,
          };

        if (
          drawerMode === 'edit'
          && editingCustomer
        ) {
          await customersApi.update(
            editingCustomer.id,
            payload,
          );

          message.success(
            'Customer updated successfully.',
          );
        } else {
          await customersApi.create(
            payload,
          );

          message.success(
            'Customer created successfully.',
          );
        }

        setDrawerOpen(false);

        setEditingCustomer(null);

        setDrawerMode('create');

        form.resetFields();

        await loadCustomers();
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
              ? 'Unable to update customer.'
              : 'Unable to create customer.'
          ),
        );
      } finally {
        setSaving(false);
      }
    };

  const columns =
    customerColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onDelete:
        requestDelete,
    });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Customer'
      : drawerMode === 'edit'
        ? 'Edit Customer'
        : 'Add Customer';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Customer'
        : 'Save Customer';

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
            Customers
          </Title>

          <Text type="secondary">
            Manage individual and
            company customers.
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
          Add Customer
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
          placeholder="Search customer number, name, phone, email or TIN"
          style={{
            width: 360,
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
          placeholder="Customer Type"
          style={{
            width: 170,
          }}
          value={
            filters.customer_type
          }
          options={[
            {
              label: 'Individual',
              value: 'individual',
            },
            {
              label: 'Company',
              value: 'company',
            },
          ]}
          onChange={(
            customerType,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                customer_type:
                  customerType,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="Status"
          style={{
            width: 140,
          }}
          value={
            filters.customer_status
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
          onChange={(
            customerStatus,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                customer_status:
                  customerStatus,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="Withhold"
          style={{
            width: 150,
          }}
          value={
            filters.withhold
          }
          options={[
            {
              label: 'Yes',
              value: true,
            },
            {
              label: 'No',
              value: false,
            },
          ]}
          onChange={(
            withhold,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,
                withhold,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="Advance Withhold"
          style={{
            width: 180,
          }}
          value={
            filters.withhold_from_advance
          }
          options={[
            {
              label: 'Yes',
              value: true,
            },
            {
              label: 'No',
              value: false,
            },
          ]}
          onChange={(
            withholdFromAdvance,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                withhold_from_advance:
                  withholdFromAdvance,
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
        title="Delete customer"
        description={`Delete ${
          selectedCustomer
            ?.display_name
          ?? 'this customer'
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

          setSelectedCustomer(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Customer>
        columns={columns}
        data={customers}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={
          handleTableChange
        }
        scroll={{
          x: 1800,
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
        <CustomerForm
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

export default CustomersPage;