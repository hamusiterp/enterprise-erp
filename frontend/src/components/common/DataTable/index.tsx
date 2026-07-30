import type { Key, ReactNode } from 'react';

import {
  Empty,
  Table,
  type TableColumnsType,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';

import type {
  FilterValue,
  SorterResult,
} from 'antd/es/table/interface';

export interface DataTablePagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface DataTableChangeParams<T> {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<T> | SorterResult<T>[];
}

interface DataTableProps<T extends object> {
  columns: TableColumnsType<T>;
  data: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => Key);
  pagination?: DataTablePagination;
  onChange?: (
    params: DataTableChangeParams<T>,
  ) => void;
  emptyText?: ReactNode;
  scrollX?: number | string | true;
  rowSelection?: TableProps<T>['rowSelection'];
  size?: TableProps<T>['size'];
}

function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  pagination,
  onChange,
  emptyText = 'No records found',
  scrollX = 'max-content',
  rowSelection,
  size = 'middle',
}: DataTableProps<T>) {
  const handleChange: TableProps<T>['onChange'] = (
    tablePagination,
    filters,
    sorter,
  ) => {
    const activeSorter = Array.isArray(sorter)
      ? sorter[0]
      : sorter;

    let sortDirection:
      | 'asc'
      | 'desc'
      | undefined;

    if (activeSorter?.order === 'ascend') {
      sortDirection = 'asc';
    }

    if (activeSorter?.order === 'descend') {
      sortDirection = 'desc';
    }

    const sortField =
      typeof activeSorter?.field === 'string'
        ? activeSorter.field
        : undefined;

    onChange?.({
      page: tablePagination.current ?? 1,
      pageSize: tablePagination.pageSize ?? 10,
      sortField,
      sortDirection,
      filters,
      sorter,
    });
  };

  const tablePagination:
    | TablePaginationConfig
    | false = pagination
    ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} records`,
      }
    : false;

  return (
    <Table<T>
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={tablePagination}
      onChange={handleChange}
      rowSelection={rowSelection}
      size={size}
      scroll={{ x: scrollX }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyText}
          />
        ),
      }}
    />
  );
}

export default DataTable;