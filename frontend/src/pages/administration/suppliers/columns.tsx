import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import {
  Button,
  Dropdown,
  Tag,
  Typography,
} from 'antd';

import type {
  MenuProps,
  TableColumnsType,
} from 'antd';

import StatusBadge from '../../../components/common/StatusBadge';

import type {
  Supplier,
} from '../../../types/supplier';

const {
  Text,
} = Typography;

interface SupplierColumnsActions {
  onView: (
    supplier: Supplier,
  ) => void;

  onEdit: (
    supplier: Supplier,
  ) => void;

  onDelete: (
    supplier: Supplier,
  ) => void;
}

export function createSupplierColumns({
  onView,
  onEdit,
  onDelete,
}: SupplierColumnsActions):
  TableColumnsType<Supplier> {
  return [
    {
      title: 'Supplier Number',
      dataIndex: 'supplier_no',
      key: 'supplier_no',
      sorter: true,
      fixed: 'left',
      width: 160,

      render: (
        value: string,
      ) => (
        <Text strong>
          {value || '-'}
        </Text>
      ),
    },

    {
      title: 'Supplier Name',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: true,
      width: 260,
      ellipsis: true,

      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Category',
      key: 'category_id',
      width: 200,
      ellipsis: true,

      render: (
        _,
        supplier,
      ) => (
        <Tag>
          {supplier.category?.name || '-'}
        </Tag>
      ),
    },

    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: true,
      width: 170,

      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 220,
      ellipsis: true,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'TIN',
      key: 'tin',
      width: 160,

      render: (
        _,
        supplier,
      ) =>
        supplier.has_tin
          ? supplier.tin || '-'
          : 'Not Available',
    },

    {
      title: 'Registered By',
      dataIndex: 'registered_by',
      key: 'registered_by',
      width: 170,

      render: (
        value: string | null,
      ) => value || 'System',
    },

    {
      title: 'Date Registered',
      dataIndex: 'date_registered',
      key: 'date_registered',
      sorter: true,
      width: 160,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 110,

      render: (
        value: string,
      ) => (
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

      render: (
        _,
        supplier,
      ) => {
        const items:
          MenuProps['items'] = [
            {
              key: 'view',
              icon: <EyeOutlined />,
              label: 'View',

              onClick: () =>
                onView(supplier),
            },

            {
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Edit',

              onClick: () =>
                onEdit(supplier),
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
                onDelete(supplier),
            },
          ];

        return (
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={
                <MoreOutlined />
              }
            />
          </Dropdown>
        );
      },
    },
  ];
}