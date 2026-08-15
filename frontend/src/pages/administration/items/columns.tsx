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
  Item,
} from '../../../types/item';

const {
  Text,
} = Typography;

interface ItemColumnsActions {
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function createItemColumns({
  onView,
  onEdit,
  onDelete,
}: ItemColumnsActions): TableColumnsType<Item> {
  return [
    {
      title: 'Item Number',
      dataIndex: 'item_no',
      key: 'item_no',
      sorter: true,
      fixed: 'left',
      width: 140,
      render: (
        value: string | null,
      ) => (
        <Text strong>
          {value || '-'}
        </Text>
      ),
    },

    {
      title: 'Item Description',
      dataIndex: 'item_description',
      key: 'item_description',
      sorter: true,
      width: 300,
      ellipsis: true,
      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      width: 180,
      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      sorter: true,
      width: 110,
      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Item Type',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      width: 150,
      render: (
        value: string | null,
      ) => value ? (
        <Tag>
          {value}
        </Tag>
      ) : (
        '-'
      ),
    },

    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      sorter: true,
      width: 140,
      render: (
        value: string | null,
      ) => value ? (
        <Tag
          color={
            value === 'Stock'
              ? 'blue'
              : 'default'
          }
        >
          {value}
        </Tag>
      ) : (
        '-'
      ),
    },

    {
      title: 'Product Date',
      dataIndex: 'product_date',
      key: 'product_date',
      sorter: true,
      width: 150,
      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Registered By',
      dataIndex: 'registered_by',
      key: 'registered_by',
      sorter: true,
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
        item,
      ) => {
        const menuItems:
          MenuProps['items'] = [
            {
              key: 'view',
              icon: <EyeOutlined />,
              label: 'View',
              onClick: () =>
                onView(item),
            },

            {
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Edit',
              onClick: () =>
                onEdit(item),
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
                onDelete(item),
            },
          ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
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