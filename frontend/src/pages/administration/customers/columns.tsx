import type { ColumnsType } from 'antd/es/table';
import { Space, Tag } from 'antd';

import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import type { Customer } from '../../../types/customer';

interface ColumnProps {
  onView: (record: Customer) => void;
  onEdit: (record: Customer) => void;
  onDelete: (record: Customer) => void;
}

const statusColor = (status: string) =>
  status === 'active' ? 'green' : 'red';

const customerTypeColor = (type: string) =>
  type === 'company' ? 'blue' : 'purple';

export const customerColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnProps): ColumnsType<Customer> => [
  {
    title: 'Customer No',
    dataIndex: 'customer_no',
    key: 'customer_no',
    sorter: true,
    width: 140,
  },

  {
    title: 'Customer',
    dataIndex: 'display_name',
    key: 'display_name',
    sorter: true,
    width: 250,
  },

  {
    title: 'Type',
    dataIndex: 'customer_type',
    key: 'customer_type',
    width: 120,
    render: (value: string) => (
      <Tag color={customerTypeColor(value)}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Tag>
    ),
  },

  {
    title: 'Phone',
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 150,
  },

  {
    title: 'Email',
    dataIndex: 'email_address',
    key: 'email_address',
    width: 220,
    render: (value: string | null) =>
      value || '-',
  },

  {
    title: 'TIN',
    dataIndex: 'tin_number',
    key: 'tin_number',
    width: 150,
    render: (value: string | null) =>
      value || '-',
  },

  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    width: 180,
  },

  {
    title: 'Withhold',
    dataIndex: 'withhold',
    key: 'withhold',
    width: 110,
    align: 'center',
    render: (value: boolean) => (
      <Tag color={value ? 'orange' : 'default'}>
        {value ? 'Yes' : 'No'}
      </Tag>
    ),
  },

  {
    title: 'Status',
    dataIndex: 'customer_status',
    key: 'customer_status',
    width: 120,
    render: (status: string) => (
      <Tag color={statusColor(status)}>
        {status.toUpperCase()}
      </Tag>
    ),
  },

  {
    title: 'Registered By',
    dataIndex: 'registered_by',
    key: 'registered_by',
    width: 170,
    render: (value: string | null) =>
      value || '-',
  },

  {
    title: 'Date Registered',
    dataIndex: 'date_registered',
    key: 'date_registered',
    width: 150,
    sorter: true,
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
          onClick={() => onView(record)}
        />

        <EditOutlined
          style={{
            color: '#52c41a',
            cursor: 'pointer',
          }}
          onClick={() => onEdit(record)}
        />

        <DeleteOutlined
          style={{
            color: '#ff4d4f',
            cursor: 'pointer',
          }}
          onClick={() => onDelete(record)}
        />
      </Space>
    ),
  },
];