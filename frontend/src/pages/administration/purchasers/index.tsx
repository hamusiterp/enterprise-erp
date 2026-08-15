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
  purchasersApi,
} from '../../../api/purchasers';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer
  from '../../../components/common/FormDrawer';

import {
  purchaserColumns,
} from './columns';

import PurchaserForm
  from './form';

import type {

  Purchaser,

  PurchaserFilters,

  PurchaserFormValues,

} from '../../../types/purchaser';
import AccountDrawer from './accountDrawer';

const {

  Title,

  Text,

} = Typography;

type DrawerMode =

  | 'create'

  | 'edit'

  | 'view';

const defaultFormValues:
Partial<PurchaserFormValues> = {

  purchaser_no: '',

  purchaser_name: '',

  status: 'active',

};



function normalizeText(

  value?: string | null,

): string {

  return value?.trim() ?? '';

}

function PurchasersPage() {

  const {

    message,

  } = App.useApp();

  const [

  accountDrawerOpen,

  setAccountDrawerOpen,

] = useState(false);

const [

  accountPurchaser,

  setAccountPurchaser,

] = useState<Purchaser | null>(
  null,
);

  const [form] =
    Form.useForm<PurchaserFormValues>();

  const [

    purchasers,

    setPurchasers,

  ] = useState<Purchaser[]>([]);

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

  ] =
    useState<DrawerMode>('create');

  const [

    editingPurchaser,

    setEditingPurchaser,

  ] =
    useState<Purchaser | null>(null);

  const [

    selectedPurchaser,

    setSelectedPurchaser,

  ] =
    useState<Purchaser | null>(null);

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

  ] =
    useState<PurchaserFilters>({

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

  const loadPurchasers =
    useCallback(async () => {

      setLoading(true);

      try {

        const response =
          await purchasersApi.list(
            filters,
          );

        setPurchasers(
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
          'Unable to load purchasers.',
        );

      } finally {

        setLoading(false);

      }

    }, [

      filters,

      message,

    ]);

  useEffect(() => {

    void loadPurchasers();

  }, [

    loadPurchasers,

  ]);

  const setPurchaserFormValues =
    (
      purchaser: Purchaser,
    ) => {

      form.setFieldsValue({

        purchaser_no:
          purchaser.purchaser_no,

        purchaser_name:
          purchaser.purchaser_name,

        status:
          purchaser.status,

      });

    };

  const handleTableChange = (

    params:
      DataTableChangeParams<Purchaser>,

  ) => {

    setFilters(current => ({

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

    setFilters(current => ({

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

      setEditingPurchaser(null);

      setDrawerMode('create');

      form.resetFields();

      try {

        const purchaserNumber =
          await purchasersApi
            .nextPurchaserNumber();

        form.setFieldsValue({

          ...defaultFormValues,

          purchaser_no:
            purchaserNumber,

        });

      } catch (error) {

        console.error(error);

        form.setFieldsValue({

          ...defaultFormValues,

        });

        message.warning(

          'Purchaser number will be generated when the purchaser is saved.',

        );

      }

      setDrawerOpen(true);

    };

  const handleView = (

    purchaser: Purchaser,

  ) => {

    setEditingPurchaser(

      purchaser,

    );

    setDrawerMode('view');

    setDrawerOpen(true);

    setTimeout(() => {

      form.resetFields();

      setPurchaserFormValues(

        purchaser,

      );

    }, 0);

  };

  const handleEdit = (

    purchaser: Purchaser,

  ) => {

    setEditingPurchaser(

      purchaser,

    );

    setDrawerMode('edit');

    setDrawerOpen(true);

    setTimeout(() => {

      form.resetFields();

      setPurchaserFormValues(

        purchaser,

      );

    }, 0);

  };

  const handleDrawerClose =
    () => {

      if (saving) {

        return;

      }

      setDrawerOpen(false);

      setEditingPurchaser(null);

      setDrawerMode('create');

      form.resetFields();

    };

  const requestDelete = (

    purchaser: Purchaser,

  ) => {

    setSelectedPurchaser(

      purchaser,

    );

    setDeleteOpen(true);

  };

  const handleAccounts = (

  purchaser: Purchaser,

) => {

  setAccountPurchaser(

    purchaser,

  );

  setAccountDrawerOpen(

    true,

  );

};

  const handleDelete =
    async () => {

      if (!selectedPurchaser) {

        return;

      }

      try {

        await purchasersApi.remove(

          selectedPurchaser.id,

        );

        message.success(

          'Purchaser deleted successfully.',

        );

        setDeleteOpen(false);

        setSelectedPurchaser(null);

        await loadPurchasers();

      } catch (error) {

        console.error(error);

        message.error(

          'Unable to delete purchaser.',

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
          PurchaserFormValues = {

          purchaser_no: '',

          purchaser_name:
            normalizeText(
              values.purchaser_name,
            ),

          status:
            values.status,

        };

        if (

          drawerMode === 'edit'

          && editingPurchaser

        ) {

          await purchasersApi.update(

            editingPurchaser.id,

            payload,

          );

          message.success(

            'Purchaser updated successfully.',

          );

        } else {

          await purchasersApi.create(

            payload,

          );

          message.success(

            'Purchaser created successfully.',

          );

        }

        setDrawerOpen(false);

        setEditingPurchaser(null);

        setDrawerMode('create');

        form.resetFields();

        await loadPurchasers();

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

            firstError ??

            'Please check the required fields.',

          );

          return;

        }

        message.error(

          responseError.response
            ?.data?.message

          ??

          (

            drawerMode === 'edit'

              ? 'Unable to update purchaser.'

              : 'Unable to create purchaser.'

          ),

        );

      } finally {

        setSaving(false);

      }

    };

  const columns =
  purchaserColumns({

    onView:
      handleView,

    onEdit:
      handleEdit,

    onAccounts:
      handleAccounts,

    onDelete:
      requestDelete,

  });

  const drawerTitle =

    drawerMode === 'view'

      ? 'View Purchaser'

      : drawerMode === 'edit'

        ? 'Edit Purchaser'

        : 'Add Purchaser';

  const submitText =

    drawerMode === 'view'

      ? 'Close'

      : drawerMode === 'edit'

        ? 'Update Purchaser'

        : 'Save Purchaser';
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

            Purchasers

          </Title>

          <Text type="secondary">

            Manage purchasers and their bank accounts.

          </Text>

        </div>

        <Button

          type="primary"

          icon={<PlusOutlined />}

          onClick={() =>

            void handleCreate()

          }

        >

          Add Purchaser

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

          placeholder="Search purchaser number or purchaser name"

          style={{

            width: 360,

          }}

          onChange={event =>

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

            width: 180,

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

          onChange={status => {
  setFilters(current => ({
    ...current,
    page: 1,
    status,
  }));
}}

        />

        <Space>

          <Button

            type="primary"

            icon={<SearchOutlined />}

            onClick={

              handleSearch

            }

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

        title="Delete purchaser"

        description={`Delete ${

          selectedPurchaser

            ?.purchaser_name

          ??

          'this purchaser'

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

          setSelectedPurchaser(null);

        }}

      >

        <span />

      </Popconfirm>

      <DataTable<Purchaser>

        columns={columns}

        data={purchasers}

        loading={loading}

        rowKey="id"

        pagination={pagination}

        onChange={

          handleTableChange

        }

        scroll={{

          x: 1400,

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

        <PurchaserForm

          form={form}

          disabled={

            saving ||

            drawerMode === 'view'

          }

        />

      </FormDrawer>

      <AccountDrawer

  open={

    accountDrawerOpen

  }

  purchaser={

    accountPurchaser

  }

  onClose={() => {

    setAccountDrawerOpen(false);

    setAccountPurchaser(null);

  }}

/>

    </Card>

  );

}

export default PurchasersPage;