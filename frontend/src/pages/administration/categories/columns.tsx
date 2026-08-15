import type { ColumnsType } from 'antd/es/table';
import { Badge, Space, Tag } from 'antd';

import type { Category } from '../../../types/category';

interface CreateCategoryColumnsProps {
  onView: (record: Category) => void;
  onEdit: (record: Category) => void;
  onDelete: (record: Category) => void;
  onRestore?: (record: Category) => void;
  onForceDelete?: (record: Category) => void;
  recycleBin?: boolean;
}

export function createCategoryColumns({
  onView,
  onEdit,
  onDelete,
  onRestore,
  onForceDelete,
  recycleBin = false,
}: CreateCategoryColumnsProps): ColumnsType<Category> {
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      sorter: true,
      render: (value: string) => (
        <Tag color="blue">
          {value.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      sorter: true,
      render: (status: string) =>
        status === 'active' ? (
          <Badge
            status="success"
            text="Active"
          />
        ) : (
          <Badge
            status="error"
            text="Inactive"
          />
        ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a
            onClick={() => onView(record)}
          >
            View
          </a>

          {!recycleBin && (
            <>
              <a
                onClick={() =>
                  onEdit(record)
                }
              >
                Edit
              </a>

              <a
                style={{
                  color: '#ff4d4f',
                }}
                onClick={() =>
                  onDelete(record)
                }
              >
                Delete
              </a>
            </>
          )}

          {recycleBin && (
            <>
              <a
                style={{
                  color: '#52c41a',
                }}
                onClick={() =>
                  onRestore?.(record)
                }
              >
                Restore
              </a>

              <a
                style={{
                  color: '#ff4d4f',
                }}
                onClick={() =>
                  onForceDelete?.(
                    record,
                  )
                }
              >
                Delete Permanently
              </a>
            </>
          )}
        </Space>
      ),
    },
  ];

  return columns;
}