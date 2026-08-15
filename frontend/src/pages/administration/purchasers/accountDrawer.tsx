import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
} from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarFilled,
} from '@ant-design/icons';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import DataTable
  from '../../../components/common/DataTable';

import { purchaserAccountsApi }
  from '../../../api/purchaserAccounts';

import { banksApi }
  from '../../../api/banks';

import type {

  Purchaser,

  PurchaserAccount,

  PurchaserAccountFormValues,

} from '../../../types/purchaser';

interface Props {
  open: boolean;
  purchaser: Purchaser | null;
  readOnly?: boolean;
  onClose(): void;
}

const defaultValues:
Partial<PurchaserAccountFormValues> = {

  bank_id: undefined,

  account_number: '',

  account_name: '',

  currency: 'ETB',

  is_primary: false,

  status: 'active',

};

export default function AccountDrawer({
  open,
  purchaser,
  readOnly = false,
  onClose,
}: Props) {

  const {

    message,

  } = App.useApp();

  const [form] =
    Form.useForm<PurchaserAccountFormValues>();

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    saving,

    setSaving,

  ] = useState(false);

  const [

    banks,

    setBanks,

  ] = useState<any[]>([]);

  const [

    accounts,

    setAccounts,

  ] = useState<PurchaserAccount[]>([]);

  const [

    editAccount,

    setEditAccount,

  ] =
    useState<PurchaserAccount | null>(
      null,
    );

const loadBanks =
  useCallback(async () => {
    try {
      const response =
        await banksApi.list({
          page: 1,
          per_page: 100,
          status: 'active',
        });

      setBanks(
        response.data ?? [],
      );
    } catch (error) {
      console.error(
        'Bank loading error:',
        error,
      );

      message.error(
        'Unable to load banks.',
      );
    }
  }, [message]);

  const loadAccounts =
  useCallback(async () => {
    if (!purchaser) {
      setAccounts([]);
      return;
    }

    setLoading(true);

    try {
      const response =
        await purchaserAccountsApi.list(
          purchaser.id,
        );

      setAccounts(response);
    } catch (error) {
      console.error(
        'Account loading error:',
        error,
      );

      message.error(
        'Unable to load accounts.',
      );
    } finally {
      setLoading(false);
    }
  }, [
    purchaser,
    message,
  ]);

  useEffect(() => {

    if (!open) {

      return;

    }

    void loadBanks();

    void loadAccounts();

  }, [

    open,

    loadBanks,

    loadAccounts,

  ]);
    const handleEdit = (
    account: PurchaserAccount,
  ) => {

    setEditAccount(account);

    form.setFieldsValue({

      bank_id: account.bank_id,

      account_number:
        account.account_number,

      account_name: account.account_name ?? '',

      currency: account.currency ?? '',

      is_primary:
        account.is_primary,

      status:
        account.status,

    });

  };

  const handleCancel = () => {

    setEditAccount(null);

    form.resetFields();

    form.setFieldsValue(defaultValues);

  };

  const handleSave =
    async () => {

      if (!purchaser) {

        return;

      }

      try {

        const values =
          await form.validateFields();

        setSaving(true);

        if (editAccount) {

          await purchaserAccountsApi.update(

            purchaser.id,

            editAccount.id,

            values,

          );

          message.success(

            'Bank account updated successfully.',

          );

        } else {

          await purchaserAccountsApi.create(

            purchaser.id,

            values,

          );

          message.success(

            'Bank account added successfully.',

          );

        }

        handleCancel();

        await loadAccounts();

      } catch (error: any) {

        if (error?.errorFields) {

          return;

        }

        console.error(error);

        message.error(

          error?.response?.data?.message

          ??

          'Unable to save bank account.',

        );

      } finally {

        setSaving(false);

      }

    };

  const handleDelete =
    async (
      account: PurchaserAccount,
    ) => {

      if (!purchaser) {

        return;

      }

      try {

        await purchaserAccountsApi.remove(

          purchaser.id,

          account.id,

        );

        message.success(

          'Bank account deleted successfully.',

        );

        await loadAccounts();

      } catch (error) {

        console.error(error);

        message.error(

          'Unable to delete bank account.',

        );

      }

    };

  const handlePrimary =
    async (
      account: PurchaserAccount,
    ) => {

      if (!purchaser) {

        return;

      }

      try {

        await purchaserAccountsApi.setPrimary(

          purchaser.id,

          account.id,

        );

        message.success(

          'Primary account updated.',

        );

        await loadAccounts();

      } catch (error) {

        console.error(error);

        message.error(

          'Unable to update primary account.',

        );

      }

    };

  const columns = [

    {
  title: 'Bank',
  key: 'bank',
  width: 220,
  render: (
    _: unknown,
    row: PurchaserAccount,
  ) =>
    row.bank?.name
    ?? row.bank_name
    ?? '-',
},

    {

      title: 'Account Number',

      dataIndex: 'account_number',

      width: 180,

    },

    {

      title: 'Account Name',

      dataIndex: 'account_name',

      width: 220,

    },

    {

      title: 'Currency',

      dataIndex: 'currency',

      width: 100,

    },

    {

      title: 'Primary',

      width: 100,

      render: (_: any, row: PurchaserAccount) =>

        row.is_primary

          ? 'Yes'

          : 'No',

    },

    {

      title: 'Status',

      dataIndex: 'status',

      width: 120,

    },

    {

      title: 'Actions',

      width: 170,

      render: (_: any, row: PurchaserAccount) => (

        <Space>

          <EditOutlined

            style={{

              color: '#52c41a',

              cursor: 'pointer',

            }}

            onClick={() =>

              handleEdit(row)

            }

          />

          {

            !row.is_primary && (

              <StarFilled

                style={{

                  color: '#faad14',

                  cursor: 'pointer',

                }}

                onClick={() =>

                  void handlePrimary(row)

                }

              />

            )

          }

          <Popconfirm

            title="Delete account?"

            okText="Delete"

            cancelText="Cancel"

            onConfirm={() =>

              void handleDelete(row)

            }

          >

            <DeleteOutlined

              style={{

                color: '#ff4d4f',

                cursor: 'pointer',

              }}

            />

          </Popconfirm>

        </Space>

      ),

    },

  ];
    return (

    <Modal

      title={

        purchaser

          ? `Bank Accounts - ${purchaser.purchaser_name}`

          : 'Bank Accounts'

      }

      open={open}

      width={1000}

      footer={null}

      destroyOnClose

      onCancel={() => {

        handleCancel();

        onClose();

      }}

    >

      <Form

        form={form}

        layout="vertical"

        initialValues={defaultValues}

      >

        <Space

          align="start"

          size={16}

          style={{

            width: '100%',

            marginBottom: 20,

          }}

        >

          <Form.Item

            name="bank_id"

            label="Bank"

            rules={[

              {

                required: true,

                message: 'Please select a bank.',

              },

            ]}

          >

            <Select

              showSearch
              disabled={readOnly}

              style={{

                width: 220,

              }}

              options={banks.map((bank) => ({
  value: bank.id,

  label:
    bank.bank_name_original
    ?? bank.bank_name_orginal
    ?? bank.bank_name
    ?? bank.name
    ?? `Bank ${bank.id}`,
}))}

            />

          </Form.Item>

          <Form.Item

            name="account_number"

            label="Account Number"

            rules={[

              {

                required: true,

                message:
                  'Account number is required.',

              },

            ]}

          >

            <Input
            disabled={readOnly}
              style={{

                width: 180,

              }}

            />

          </Form.Item>

          <Form.Item

            name="account_name"

            label="Account Name"

          >

            <Input
disabled={readOnly}
              style={{

                width: 220,

              }}

            />

          </Form.Item>

          <Form.Item

            name="currency"

            label="Currency"

          >

            <Select
            disabled={readOnly}
              style={{

                width: 120,

              }}

              options={[

                {

                  label: 'ETB',

                  value: 'ETB',

                },

                {

                  label: 'USD',

                  value: 'USD',

                },

                {

                  label: 'EUR',

                  value: 'EUR',

                },

                {

                  label: 'GBP',

                  value: 'GBP',

                },

              ]}

            />

          </Form.Item>

        </Space>

        <Space

          size={16}

          style={{

            marginBottom: 20,

          }}

        >

          <Form.Item

            name="status"

            label="Status"

          >

            <Select
            disabled={readOnly}
              style={{

                width: 160,

              }}

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

            />

          </Form.Item>

          <Form.Item

            name="is_primary"

            label="Primary"

            valuePropName="checked"

          >

            <Switch />

          </Form.Item>

        </Space>

        {!readOnly && (<Space

          style={{

            marginBottom: 20,

          }}

        >

          <Button

            type="primary"

            icon={<PlusOutlined />}

            loading={saving}

            onClick={() =>

              void handleSave()

            }

          >

            {

              editAccount

                ? 'Update Account'

                : 'Add Account'

            }

          </Button>

          <Button

            onClick={

              handleCancel

            }

          >

            Reset

          </Button>

        </Space>)}

      </Form>

      <DataTable<PurchaserAccount>

        rowKey="id"

        columns={columns}

        data={accounts}

        loading={loading}

        pagination={false}

        scroll={{

          x: 900,

        }}

      />

    </Modal>

  );

}
