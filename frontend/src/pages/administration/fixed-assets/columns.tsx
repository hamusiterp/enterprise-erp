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
  FixedAsset,
} from '../../../types/fixedAsset';

const {
  Text,
} = Typography;

interface FixedAssetColumnsActions {
  onView: (
    asset: FixedAsset,
  ) => void;

  onEdit: (
    asset: FixedAsset,
  ) => void;

  onDelete: (
    asset: FixedAsset,
  ) => void;
}

function formatLabel(
  value?: string | null,
): string {
  if (!value) {
    return '-';
  }

  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatNumber(
  value?: string | number | null,
  suffix?: string,
): string {
  if (
    value === null
    || value === undefined
    || value === ''
  ) {
    return '-';
  }

  const numericValue =
    Number(value);

  if (
    Number.isNaN(
      numericValue,
    )
  ) {
    return String(value);
  }

  const formatted =
    new Intl.NumberFormat(
      'en-US',
      {
        maximumFractionDigits: 2,
      },
    ).format(
      numericValue,
    );

  return suffix
    ? `${formatted} ${suffix}`
    : formatted;
}

function getConditionColor(
  condition: FixedAsset[
    'asset_condition'
  ],
): string {
  switch (condition) {
    case 'excellent':
      return 'green';

    case 'good':
      return 'blue';

    case 'fair':
      return 'gold';

    case 'poor':
      return 'orange';

    case 'out_of_service':
      return 'red';

    default:
      return 'default';
  }
}

export function createFixedAssetColumns({
  onView,
  onEdit,
  onDelete,
}: FixedAssetColumnsActions):
  TableColumnsType<FixedAsset> {
  return [
    {
      title: 'Asset Number',
      dataIndex: 'asset_no',
      key: 'asset_no',
      sorter: true,
      fixed: 'left',
      width: 140,

      render: (
        value: string,
      ) => (
        <Text strong>
          {value || '-'}
        </Text>
      ),
    },

    {
      title: 'Machinery / Vehicle',
      dataIndex:
        'name_of_machinery',
      key:
        'name_of_machinery',
      sorter: true,
      width: 260,
      ellipsis: true,

      render: (
        value: string,
        asset: FixedAsset,
      ) => (
        <Space
          direction="vertical"
          size={0}
        >
          <Text strong>
            {value || '-'}
          </Text>

          <Text
            type="secondary"
            style={{
              fontSize: 12,
            }}
          >
            {[
              asset.make_of_vehicle,
              asset.model,
              asset.make_of_year,
            ]
              .filter(Boolean)
              .join(' ')
              || '-'}
          </Text>
        </Space>
      ),
    },

    {
      title: 'Category',
      key: 'category_id',
      width: 180,
      ellipsis: true,

      render: (
        _,
        asset,
      ) => (
        <Tag>
          {
            asset.category?.name
            || '-'
          }
        </Tag>
      ),
    },

    {
      title: 'Tag Number',
      dataIndex: 'tag_no',
      key: 'tag_no',
      sorter: true,
      width: 150,

      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Plate Number',
      dataIndex: 'plate_no',
      key: 'plate_no',
      sorter: true,
      width: 150,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Reading',
      key: 'reading',
      width: 160,
      align: 'right',

      render: (
        _,
        asset,
      ) =>
        formatNumber(
          asset.reading,
          asset.reading_type ===
          'km_reading'
            ? 'KM'
            : 'HP',
        ),
    },

    {
      title: 'Fuel Type',
      dataIndex: 'type_of_fuel',
      key: 'type_of_fuel',
      sorter: true,
      width: 130,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Condition',
      dataIndex:
        'asset_condition',
      key:
        'asset_condition',
      sorter: true,
      width: 150,

      render: (
        condition:
          FixedAsset[
            'asset_condition'
          ],
      ) => (
        <Tag
          color={
            getConditionColor(
              condition,
            )
          }
        >
          {
            formatLabel(
              condition,
            )
          }
        </Tag>
      ),
    },

    {
      title: 'Current Location',
      dataIndex:
        'current_location',
      key:
        'current_location',
      sorter: true,
      width: 200,
      ellipsis: true,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      width: 180,
      ellipsis: true,

      render: (
        value: string | null,
      ) => value || '-',
    },

    {
      title: 'Purchase Date',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      sorter: true,
      width: 150,

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
        asset,
      ) => {
        const items:
          MenuProps['items'] = [
            {
              key: 'view',
              icon:
                <EyeOutlined />,
              label: 'View',

              onClick: () =>
                onView(asset),
            },

            {
              key: 'edit',
              icon:
                <EditOutlined />,
              label: 'Edit',

              onClick: () =>
                onEdit(asset),
            },

            {
              type: 'divider',
            },

            {
              key: 'delete',
              icon:
                <DeleteOutlined />,
              label: 'Delete',
              danger: true,

              onClick: () =>
                onDelete(asset),
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