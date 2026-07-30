import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import {
  Button,
  Dropdown,
  Space,
  Tag,
  Typography,
} from 'antd';

import type {
  MenuProps,
  TableColumnsType,
} from 'antd';

import StatusBadge from '../../../components/common/StatusBadge';

import type {
  Bank,
} from '../../../types/bank';

const { Text } = Typography;

interface BankColumnsActions {
  onView: (bank: Bank) => void;
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
}

function formatAmount(
  value: string | null,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-';
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function createBankColumns({
  onView,
  onEdit,
  onDelete,
}: BankColumnsActions): TableColumnsType<Bank> {
  return [
    {
      title: 'Bank ID',
      dataIndex: 'bank_id',
      key: 'bank_id',
      sorter: true,
      width: 120,
      render: (value: string | null) =>
        value || '-',
    },
    {
      title: 'Bank',
      dataIndex: 'bank_name_orginal',
      key: 'bank_name_orginal',
      sorter: true,
      width: 230,
      render: (
        value: string,
        bank: Bank,
      ) => (
        <Space
          direction="vertical"
          size={0}
        >
          <Text strong>
            {value}
          </Text>

          {bank.bank_name && (
            <Text
              type="secondary"
              style={{
                fontSize: 12,
              }}
            >
              {bank.bank_name}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Account Number',
      dataIndex: 'account_no',
      key: 'account_no',
      sorter: true,
      width: 170,
      render: (value: string | null) =>
        value || '-',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      sorter: true,
      width: 150,
      render: (value: string | null) =>
        value || '-',
    },
    {
      title: 'Beginning Amount',
      dataIndex: 'begnning_amount',
      key: 'begnning_amount',
      sorter: true,
      align: 'right',
      width: 170,
      render: formatAmount,
    },
    {
      title: 'OD Amount',
      dataIndex: 'od_amount',
      key: 'od_amount',
      sorter: true,
      align: 'right',
      width: 150,
      render: formatAmount,
    },
    {
      title: 'OD Status',
      dataIndex: 'od_status',
      key: 'od_status',
      width: 130,
      render: (value: string | null) =>
        value ? (
          <Tag>{value}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Loan Amount',
      dataIndex: 'term_loan_amount',
      key: 'term_loan_amount',
      sorter: true,
      align: 'right',
      width: 160,
      render: formatAmount,
    },
    {
      title: 'Loan Status',
      dataIndex: 'loan_status',
      key: 'loan_status',
      sorter: true,
      width: 140,
      render: (value: string) =>
        value ? (
          <Tag>{value}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 110,
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'active'
              ? 'active'
              : 'inactive'
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 90,
      align: 'center',
      render: (_, bank) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View',
            onClick: () =>
              onView(bank),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () =>
              onEdit(bank),
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: () =>
              onDelete(bank),
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
            />
          </Dropdown>
        );
      },
    },
  ];
}