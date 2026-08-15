import type { ColumnsType } from 'antd/es/table';
import { Space, Tag } from 'antd';

import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  BankOutlined,
} from '@ant-design/icons';

import type {
  Purchaser,
} from '../../../types/purchaser';

interface ColumnProps {

  onView: (record: Purchaser) => void;

  onEdit: (record: Purchaser) => void;

  onAccounts: (
    record: Purchaser,
  ) => void;

  onDelete: (record: Purchaser) => void;

}

const statusColor = (
  status: string,
) =>

  status === 'active'
    ? 'green'
    : 'red';

export const purchaserColumns = ({

  onView,

  onEdit,

onAccounts,

onDelete,   

}: ColumnProps): ColumnsType<Purchaser> => [

  {

    title: 'Purchaser No',

    dataIndex: 'purchaser_no',

    key: 'purchaser_no',

    sorter: true,

    width: 150,

  },

  {

    title: 'Purchaser Name',

    dataIndex: 'purchaser_name',

    key: 'purchaser_name',

    sorter: true,

    width: 280,

  },

  {

    title: 'Accounts',

    dataIndex: 'accounts_count',

    key: 'accounts_count',

    width: 110,

    align: 'center',

    render: (value: number) => (

      <Tag color="blue">

        {value}

      </Tag>

    ),

  },

  {

    title: 'Active Accounts',

    dataIndex: 'active_accounts_count',

    key: 'active_accounts_count',

    width: 150,

    align: 'center',

    render: (value: number) => (

      <Tag color="green">

        {value}

      </Tag>

    ),

  },

  {

    title: 'Status',

    dataIndex: 'status',

    key: 'status',

    width: 120,

    render: (status?: string) => (
  <Tag color={statusColor(status ?? '')}>
    {(status ?? '-').toUpperCase()}
  </Tag>
),

  },

  {

    title: 'Registered By',

    dataIndex: 'registered_by',

    key: 'registered_by',

    width: 180,

    render: (
      value: string | null,
    ) =>

      value || '-',

  },

  {

    title: 'Date Registered',

    dataIndex: 'date_registered',

    key: 'date_registered',

    sorter: true,

    width: 150,

  },

  {

    title: 'Actions',

    key: 'actions',

    fixed: 'right',

    width: 130,

    render: (_, record) => (

      <Space>

        <EyeOutlined

          style={{

            color: '#1677ff',

            cursor: 'pointer',

          }}

          onClick={() =>

            onView(record)

          }

        />

        <EditOutlined

          style={{

            color: '#52c41a',

            cursor: 'pointer',

          }}

          onClick={() =>

            onEdit(record)

          }

        />

        <BankOutlined

  style={{

    color: '#722ed1',

    cursor: 'pointer',

  }}

  title="Manage Bank Accounts"

  onClick={() =>

    onAccounts(record)

  }

/>

        <DeleteOutlined

          style={{

            color: '#ff4d4f',

            cursor: 'pointer',

          }}

          onClick={() =>

            onDelete(record)

          }

        />

      </Space>

    ),

  },

];