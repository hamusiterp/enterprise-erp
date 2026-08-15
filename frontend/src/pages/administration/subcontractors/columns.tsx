import {
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import type {
  ColumnsType,
} from 'antd/es/table';

import type {
  Subcontractor,
} from '../../../types/subcontractor';

const {
  Text,
} = Typography;

interface ColumnProps {
  onView(
    subcontractor: Subcontractor,
  ): void;

  onEdit(
    subcontractor: Subcontractor,
  ): void;

  onDelete(
    subcontractor: Subcontractor,
  ): void;
}

function typeTag(
  type: string,
) {
  if (type === 'company') {
    return (
      <Tag color="blue">
        Company
      </Tag>
    );
  }

  return (
    <Tag color="purple">
      Individual
    </Tag>
  );
}

function statusTag(
  status: string,
) {
  if (status === 'active') {
    return (
      <Tag color="green">
        Active
      </Tag>
    );
  }

  return (
    <Tag color="default">
      Inactive
    </Tag>
  );
}

function taxTag(
  taxPercent: number,
) {
  const value =
    Number(taxPercent ?? 0);

  let color = 'default';

  if (value === 2) {
    color = 'blue';
  }

  if (value === 10) {
    color = 'orange';
  }

  if (value === 15) {
    color = 'red';
  }

  return (
    <Tag color={color}>
      {value}%
    </Tag>
  );
}

export const subcontractorColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnProps): ColumnsType<Subcontractor> => [
  {
    title: 'Name',
    key: 'display_name',
    width: 220,
    render: (_, row) => (
      <Space
        direction="vertical"
        size={0}
      >
        <Text strong>
          {row.display_name || '-'}
        </Text>

        {row.type === 'company'
          && row.tin_no && (
            <Text
              type="secondary"
              style={{
                fontSize: 12,
              }}
            >
              TIN: {row.tin_no}
            </Text>
          )}
      </Space>
    ),
  },

  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    render: typeTag,
  },

  {
    title: 'Category',
    key: 'category',
    width: 180,
    render: (_, row) =>
      row.category?.name ?? '-',
  },

  {
    title: 'Contact Person',
    dataIndex: 'contact_person',
    key: 'contact_person',
    width: 180,
  },

  {
    title: 'Phone',
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 160,
  },

  {
    title: 'Tax',
    dataIndex: 'tax_percent',
    key: 'tax_percent',
    width: 100,
    align: 'center',
    render: taxTag,
  },

  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    align: 'center',
    render: statusTag,
  },

  {
    title: 'Registered',
    dataIndex: 'date_registered',
    key: 'date_registered',
    width: 130,
    sorter: true,
    render: (
      value?: string | null,
    ) => value ?? '-',
  },

  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 140,
    align: 'center',

    render: (_, subcontractor) => (
      <Space size="middle">
        <Tooltip title="View">
          <EyeOutlined
            style={{
              color: '#1677ff',
              cursor: 'pointer',
              fontSize: 16,
            }}
            onClick={() =>
              onView(
                subcontractor,
              )
            }
          />
        </Tooltip>

        <Tooltip title="Edit">
          <EditOutlined
            style={{
              color: '#52c41a',
              cursor: 'pointer',
              fontSize: 16,
            }}
            onClick={() =>
              onEdit(
                subcontractor,
              )
            }
          />
        </Tooltip>

        <Tooltip title="Delete">
          <DeleteOutlined
            style={{
              color: '#ff4d4f',
              cursor: 'pointer',
              fontSize: 16,
            }}
            onClick={() =>
              onDelete(
                subcontractor,
              )
            }
          />
        </Tooltip>
      </Space>
    ),
  },
];