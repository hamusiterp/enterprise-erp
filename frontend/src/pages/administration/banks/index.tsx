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

import type {
  TableProps,
} from 'antd';

import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { banksApi } from '../../../api/banks';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import { createBankColumns } from './columns';
import BankForm from './form';

import type {
  Bank,
  BankFilters,
  BankFormValues,
} from '../../../types/bank';

const { Title, Text } = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues: Partial<BankFormValues> = {
  status: 'active',
  od_available: 'No',
  term_loan: 'No',
  min_amount: '0.00',
  transfer_rate: '0.00',
  od_limit: '',
  repayment_amount_left: '',
  term_loan_relief: 'No',
  term_loan_relief_start_date: '',
  term_loan_relief_end_date: '',
  cob_balance: '',
  last_activity: '',
  suggestion: '',
  end_balance: '',
  loan_status: 'Not Available',
  credit_suggestion: '',
  category: '',
  start_month: '',
};

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function BanksPage() {
  const { message } = App.useApp();

  const [form] =
    Form.useForm<BankFormValues>();

  const [banks, setBanks] =
    useState<Bank[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [drawerMode, setDrawerMode] =
    useState<DrawerMode>('create');

  const [editingBank, setEditingBank] =
    useState<Bank | null>(null);

  const [selectedBank, setSelectedBank] =
    useState<Bank | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState('');

  const [filters, setFilters] =
    useState<BankFilters>({
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

  const loadBanks = useCallback(
    async () => {
      setLoading(true);

      try {
        const response = await banksApi.list(filters);

        setBanks(response.data ?? []);

        setPagination({
          current:
            response.pagination?.current_page ?? 1,
          pageSize:
            response.pagination?.per_page ??
            filters.per_page ??
            10,
          total:
            response.pagination?.total ?? 0,
        });
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load banks.',
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, message],
  );

  useEffect(() => {
    void loadBanks();
  }, [loadBanks]);

  const setBankFormValues = (
    bank: Bank,
  ) => {
    form.setFieldsValue({
      bank_id: bank.bank_id,
      bank_name: bank.bank_name,
      bank_name_orginal:
        bank.bank_name_orginal,

      account_no: bank.account_no,
      branch: bank.branch,
      contact_address:
        bank.contact_address,

      begnning_amount:
  bank.begnning_amount !== null &&
  bank.begnning_amount !== undefined
    ? Number(bank.begnning_amount)
    : undefined,

      begnning__amount_left:
  bank.begnning__amount_left !== null &&
  bank.begnning__amount_left !== undefined
    ? Number(bank.begnning__amount_left)
    : undefined,

      od_available:
        bank.od_available,
      start_date: bank.start_date,
      end_date: bank.end_date,

      od_amount:
  bank.od_amount !== null &&
  bank.od_amount !== undefined
    ? Number(bank.od_amount)
    : undefined,

      od_amount_left:
  bank.od_amount_left !== null &&
  bank.od_amount_left !== undefined
    ? Number(bank.od_amount_left)
    : undefined,

      min_amount:
  bank.min_amount !== null &&
  bank.min_amount !== undefined
    ? Number(bank.min_amount)
    : undefined,

      od_limit: bank.od_limit,
      od_status: bank.od_status,

      term_loan: bank.term_loan,
      term_loan_start_date:
        bank.term_loan_start_date,
      term_loan_end_date:
        bank.term_loan_end_date,

      term_loan_amount:
  bank.term_loan_amount !== null &&
  bank.term_loan_amount !== undefined
    ? Number(bank.term_loan_amount)
    : undefined,

      transfer_rate:
  bank.transfer_rate !== null &&
  bank.transfer_rate !== undefined
    ? Number(bank.transfer_rate)
    : undefined,

      repayment_amount:
  bank.repayment_amount !== null &&
  bank.repayment_amount !== undefined
    ? Number(bank.repayment_amount)
    : undefined,

      repayment_amount_left:
        bank.repayment_amount_left,

      term_loan_relief:
        bank.term_loan_relief,
      term_loan_relief_start_date:
        bank.term_loan_relief_start_date,
      term_loan_relief_end_date:
        bank.term_loan_relief_end_date,

      period: bank.period,
      ethiopian_date:
        bank.ethiopian_date,
      date_registered:
        bank.date_registered,

      cob_balance:
        bank.cob_balance,
      status: bank.status,
      last_activity:
        bank.last_activity,
      suggestion: bank.suggestion,
      end_balance:
        bank.end_balance,
      loan_status:
        bank.loan_status,
      credit_suggestion:
        bank.credit_suggestion,
      category: bank.category,
      start_month:
        bank.start_month,
    });
  };

  const handleTableChange = (
    params: DataTableChangeParams<Bank>,
  ) => {
    setFilters((current) => ({
      ...current,
      page: params.page,
      per_page: params.pageSize,
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
        searchValue.trim() || undefined,
    }));
  };

  const handleResetFilters = () => {
    setSearchValue('');

    setFilters({
      page: 1,
      per_page: pagination.pageSize,
      sort_by: 'id',
      sort_direction: 'desc',
    });
  };

  const handleCreate = () => {
    setEditingBank(null);
    setDrawerMode('create');

    form.resetFields();
    form.setFieldsValue({
        status: 'active',
        od_available: 'No',
        term_loan: 'No',
        term_loan_relief: 'No',
    });

    setDrawerOpen(true);
  };

  const handleView = (bank: Bank) => {
  setEditingBank(bank);
  setDrawerMode('view');
  setDrawerOpen(true);

  setTimeout(() => {
    form.resetFields();

    form.setFieldsValue({
      ...bank,

      od_available:
        bank.od_available || 'No',

      term_loan:
        bank.term_loan || 'No',

      term_loan_relief:
        bank.term_loan_relief || 'No',

      begnning_amount:
  bank.begnning_amount !== null &&
  bank.begnning_amount !== undefined &&
  bank.begnning_amount !== ''
    ? Number(bank.begnning_amount)
    : undefined,

      begnning__amount_left:
  bank.begnning__amount_left !== null &&
  bank.begnning__amount_left !== undefined &&
  bank.begnning__amount_left !== ''
    ? Number(bank.begnning__amount_left)
    : undefined,

      min_amount:
        bank.min_amount !== null &&
        bank.min_amount !== undefined
          ? Number(bank.min_amount)
          : undefined,

      transfer_rate:
        bank.transfer_rate !== null &&
        bank.transfer_rate !== undefined
          ? Number(bank.transfer_rate)
          : undefined,
    });
  }, 0);
};

  const handleEdit = (bank: Bank) => {
  setEditingBank(bank);
  setDrawerMode('edit');
  setDrawerOpen(true);

  setTimeout(() => {
    form.resetFields();

    form.setFieldsValue({
      ...bank,

      od_available:
        bank.od_available || 'No',

      term_loan:
        bank.term_loan || 'No',

      term_loan_relief:
        bank.term_loan_relief || 'No',

      begnning_amount:
        bank.begnning_amount !== null &&
        bank.begnning_amount !== undefined
          ? Number(bank.begnning_amount)
          : undefined,

      begnning__amount_left:
        bank.begnning__amount_left !== null &&
        bank.begnning__amount_left !== undefined
          ? Number(
              bank.begnning__amount_left,
            )
          : undefined,

      min_amount:
        bank.min_amount !== null &&
        bank.min_amount !== undefined
          ? Number(bank.min_amount)
          : undefined,

      transfer_rate:
        bank.transfer_rate !== null &&
        bank.transfer_rate !== undefined
          ? Number(bank.transfer_rate)
          : undefined,

      od_amount:
        bank.od_amount !== null &&
        bank.od_amount !== undefined
          ? Number(bank.od_amount)
          : undefined,

      od_amount_left:
        bank.od_amount_left !== null &&
        bank.od_amount_left !== undefined
          ? Number(bank.od_amount_left)
          : undefined,

      term_loan_amount:
        bank.term_loan_amount !== null &&
        bank.term_loan_amount !== undefined
          ? Number(bank.term_loan_amount)
          : undefined,

      repayment_amount:
        bank.repayment_amount !== null &&
        bank.repayment_amount !== undefined
          ? Number(bank.repayment_amount)
          : undefined,
    });
  }, 0);
};

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingBank(null);
    setDrawerMode('create');
    form.resetFields();
  };

  const requestDelete = (bank: Bank) => {
    setSelectedBank(bank);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBank) {
      return;
    }

    try {
      await banksApi.remove(
        selectedBank.id,
      );

      message.success(
        'Bank deleted successfully.',
      );

      setDeleteOpen(false);
      setSelectedBank(null);

      await loadBanks();
    } catch (error) {
      console.error(error);

      message.error(
        'Unable to delete bank.',
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

      /*
       * Keep the payload simple and compatible with
       * BankFormValues. The backend generates the real Bank ID.
       */
      const payload: BankFormValues = {
        ...values,

        bank_id: '',

        bank_name:
          normalizeText(values.bank_name),

        bank_name_orginal:
          normalizeText(
            values.bank_name_orginal,
          ),

        account_no:
          normalizeText(values.account_no),

        branch:
          normalizeText(values.branch),

        contact_address:
          normalizeText(
            values.contact_address,
          ),

        od_available:
          values.od_available,

        start_date:
          values.od_available === 'Yes'
            ? normalizeText(values.start_date)
            : '',

        end_date:
          values.od_available === 'Yes'
            ? normalizeText(values.end_date)
            : '',

        od_amount:
          values.od_available === 'Yes'
            ? values.od_amount
            : null,

        od_amount_left:
          values.od_available === 'Yes'
            ? values.od_amount_left
            : null,

        od_limit:
          values.od_available === 'Yes'
            ? normalizeText(values.od_limit)
            : '',

        od_status:
          values.od_available === 'Yes'
            ? normalizeText(values.od_status)
            : '',

        term_loan:
          values.term_loan,

        term_loan_start_date:
          values.term_loan === 'Yes'
            ? normalizeText(
                values.term_loan_start_date,
              )
            : '',

        term_loan_end_date:
          values.term_loan === 'Yes'
            ? normalizeText(
                values.term_loan_end_date,
              )
            : '',

        term_loan_amount:
          values.term_loan === 'Yes'
            ? values.term_loan_amount
            : null,

        repayment_amount:
          values.term_loan === 'Yes'
            ? values.repayment_amount
            : null,

        repayment_amount_left:
          values.term_loan === 'Yes'
            ? normalizeText(
                values.repayment_amount_left,
              )
            : '',

        loan_status:
          values.term_loan === 'Yes'
            ? normalizeText(values.loan_status)
            : '',

        period:
          values.term_loan === 'Yes'
            ? normalizeText(values.period)
            : '',

        term_loan_relief:
          values.term_loan_relief,

        term_loan_relief_start_date:
          values.term_loan_relief === 'Yes'
            ? normalizeText(
                values.term_loan_relief_start_date,
              )
            : '',

        term_loan_relief_end_date:
          values.term_loan_relief === 'Yes'
            ? normalizeText(
                values.term_loan_relief_end_date,
              )
            : '',

        ethiopian_date:
          normalizeText(
            values.ethiopian_date,
          ),

        date_registered:
          normalizeText(
            values.date_registered,
          ),

        cob_balance:
          normalizeText(values.cob_balance),

        status:
          values.status,

        last_activity:
          normalizeText(values.last_activity),

        suggestion:
          normalizeText(values.suggestion),

        end_balance:
          normalizeText(values.end_balance),

        credit_suggestion:
          normalizeText(
            values.credit_suggestion,
          ),

        category:
          normalizeText(values.category),

        start_month:
          normalizeText(values.start_month),
      };

      if (
        drawerMode === 'edit' &&
        editingBank
      ) {
        await banksApi.update(
          editingBank.id,
          payload,
        );

        message.success(
          'Bank updated successfully.',
        );
      } else {
        await banksApi.create(payload);

        message.success(
          'Bank created successfully.',
        );
      }

      setDrawerOpen(false);
      setEditingBank(null);
      setDrawerMode('create');
      form.resetFields();

      await loadBanks();
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
          (drawerMode === 'edit'
            ? 'Unable to update bank.'
            : 'Unable to create bank.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = createBankColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: requestDelete,
  });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Bank'
      : drawerMode === 'edit'
        ? 'Edit Bank'
        : 'Add Bank';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Bank'
        : 'Save Bank';

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
            Banks
          </Title>

          <Text type="secondary">
            Manage bank accounts,
            overdrafts and term loans.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Add Bank
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
          placeholder="Search bank, account or branch"
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
            width: 140,
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
          placeholder="OD Status"
          style={{
            width: 160,
          }}
          value={filters.od_status}
          options={[
            {
              label: 'Active',
              value: 'Active',
            },
            {
              label: 'Inactive',
              value: 'Inactive',
            },
            {
              label: 'Expired',
              value: 'Expired',
            },
            {
              label: 'Not Available',
              value: 'Not Available',
            },
          ]}
          onChange={(odStatus) => {
            setFilters((current) => ({
              ...current,
              page: 1,
              od_status: odStatus,
            }));
          }}
        />

        <Select
          allowClear
          placeholder="Loan Status"
          style={{
            width: 170,
          }}
          value={filters.loan_status}
          options={[
            {
              label: 'Active',
              value: 'Active',
            },
            {
              label: 'Completed',
              value: 'Completed',
            },
            {
              label: 'Pending',
              value: 'Pending',
            },
            {
              label: 'Not Available',
              value: 'Not Available',
            },
          ]}
          onChange={(loanStatus) => {
            setFilters((current) => ({
              ...current,
              page: 1,
              loan_status: loanStatus,
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
        title="Delete bank"
        description={`Delete ${
          selectedBank?.bank_name_orginal ??
          'this bank'
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
          setSelectedBank(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Bank>
        columns={columns}
        data={banks}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{
          x: 1500,
        }}
      />

      <FormDrawer
  title={drawerTitle}
  open={drawerOpen}
  loading={saving}
  submitText={submitText}
  onClose={handleDrawerClose}
  onSubmit={() => void handleSave()}
>
  <BankForm
    form={form}
    disabled={
      saving ||
      drawerMode === 'view'
    }
  />
</FormDrawer>
    </Card>
  );
}

export default BanksPage;