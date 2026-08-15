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
  Project,
} from '../../../types/project';

const {
  Text,
} = Typography;

interface ProjectColumnsActions {
  onView: (
    project: Project,
  ) => void;

  onEdit: (
    project: Project,
  ) => void;

  onDelete: (
    project: Project,
  ) => void;
}

export function createProjectColumns({
  onView,
  onEdit,
  onDelete,
}: ProjectColumnsActions):
  TableColumnsType<Project> {
  return [
    {
      title: 'Project Number',
      dataIndex: 'project_no',
      key: 'project_no',
      sorter: true,
      fixed: 'left',
      width: 150,
      render: (
        value: string,
      ) => (
        <Text strong>
          {value || '-'}
        </Text>
      ),
    },

    {
      title: 'Project Name',
      dataIndex: 'project_name',
      key: 'project_name',
      sorter: true,
      width: 300,
      ellipsis: true,
      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Source',
      dataIndex: 'project_source',
      key: 'project_source',
      sorter: true,
      width: 130,
      render: (
        value: string,
      ) => (
        <Tag
          color={
            value === 'Bid'
              ? 'blue'
              : 'purple'
          }
        >
          {value}
        </Tag>
      ),
    },

    {
      title: 'Reference',
      key: 'reference',
      width: 160,
      render: (
        _,
        project,
      ) =>
        project.project_source ===
        'Bid'
          ? project.bid_reference || '-'
          : project.work_order_no || '-',
    },

    {
      title: 'Employer',
      dataIndex: 'employer',
      key: 'employer',
      sorter: true,
      width: 220,
      ellipsis: true,
      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (
        value: string,
      ) => value || '-',
    },

    {
      title: 'Construction Type',
      dataIndex:
        'construction_project_type',
      key:
        'construction_project_type',
      sorter: true,
      width: 180,
      render: (
        value: string,
      ) => (
        <Tag>
          {value || '-'}
        </Tag>
      ),
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
        project,
      ) => {
        const menuItems:
          MenuProps['items'] = [
            {
              key: 'view',
              icon: <EyeOutlined />,
              label: 'View',
              onClick: () =>
                onView(project),
            },

            {
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Edit',
              onClick: () =>
                onEdit(project),
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
                onDelete(project),
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