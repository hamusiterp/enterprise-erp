import {
  App,
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import {
  EyeOutlined,
  
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  fetchStoreRequisitions,
} from '../../../api/storeRequisitions';

import type {
  StoreRequisition,
} from './types';

import {
  EditOutlined,
} from '@ant-design/icons';

const {
  Title,
  Text,
} = Typography;

function StoreRequisitionListPage() {
  const {
    message,
  } = App.useApp();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    data,
    setData,
  ] = useState<StoreRequisition[]>([]);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(10);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    searchInput,
    setSearchInput,
  ] = useState('');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    status,
    setStatus,
  ] = useState<string | undefined>(
    undefined,
  );

  const formatDate = (
    value?: string | null,
  ): string => {
    if (!value) {
      return '-';
    }

    return value.substring(
      0,
      10,
    );
  };

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await fetchStoreRequisitions({
              page,
              per_page:
                pageSize,

              search:
                search ||
                undefined,

              status:
                status ||
                undefined,
            });

          setData(
            response.data ??
              [],
          );

          setTotal(
            response.meta
              ?.total ??
              0,
          );
        } catch (error) {
          console.error(
            error,
          );

          message.error(
            'Unable to load Store Requisitions.',
          );
        } finally {
          setLoading(false);
        }
      },
      [
        page,
        pageSize,
        search,
        status,
        message,
      ],
    );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSearch = () => {
    setPage(1);

    setSearch(
      searchInput.trim(),
    );
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus(undefined);
    setPage(1);
  };

  const getUsedFor = (
    requisition:
      StoreRequisition,
  ): string => {
    if (
      requisition.used_for ===
      'project'
    ) {
      if (
        requisition.project
      ) {
        return `${requisition.project.project_no} - ${requisition.project.project_name}`;
      }

      return 'Project';
    }

    if (
      requisition.used_for ===
      'department'
    ) {
      return (
        requisition
          .used_for_department
          ?.department_name ??
        'Department'
      );
    }

    return '-';
  };

  const getStage = (
    requisition:
      StoreRequisition,
  ): string => {
    return (
      requisition
        .workflow_instance
        ?.current_state
        ?.name ??
      '-'
    );
  };

  const renderStatus = (
    value: string,
  ) => {
    const normalized =
      value?.toLowerCase();

    if (
      normalized ===
      'submitted'
    ) {
      return (
        <Tag color="blue">
          Submitted
        </Tag>
      );
    }

    if (
      normalized ===
      'posted'
    ) {
      return (
        <Tag color="cyan">
          Posted
        </Tag>
      );
    }

    if (
      normalized ===
      'completed'
    ) {
      return (
        <Tag color="green">
          Completed
        </Tag>
      );
    }

    if (
      normalized ===
      'cancelled'
    ) {
      return (
        <Tag color="red">
          Cancelled
        </Tag>
      );
    }

    if (
      normalized ===
      'draft'
    ) {
      return (
        <Tag>
          Draft
        </Tag>
      );
    }

    return (
      <Tag>
        {value || '-'}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'SR No.',
      dataIndex: 'sr_no',
      key: 'sr_no',
      width: 180,

      render: (
        value: string,
      ) => (
        <Text strong>
          {value || '-'}
        </Text>
      ),
    },

    {
      title: 'SR Date',
      dataIndex: 'sr_date',
      key: 'sr_date',
      width: 120,

      render: (
        value:
          string | null,
      ) =>
        formatDate(value),
    },

    {
      title:
        'Requested By',

      key:
        'requested_by',

      width: 170,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) =>
        record.requester
          ?.name ??
        '-',
    },

    {
      title:
        'From',

      key:
        'from_department',

      width: 180,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) =>
        record
          .from_department
          ?.department_name ??
        '-',
    },

    {
      title:
        'Used For',

      key:
        'used_for',

      width: 220,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) =>
        getUsedFor(
          record,
        ),
    },

    {
      title:
        'Items',

      key:
        'items',

      width: 80,

      align:
        'center' as const,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) =>
        record.items
          ?.length ??
        0,
    },

    {
      title:
        'Current Stage',

      key:
        'current_stage',

      width: 180,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) => (
        <Tag color="purple">
          {getStage(
            record,
          )}
        </Tag>
      ),
    },

    {
      title:
        'Status',

      dataIndex:
        'status',

      key:
        'status',

      width: 120,

      render:
        renderStatus,
    },

    {
      title:
        'Actions',

      key:
        'actions',

      width: 220,

      fixed:
        'right' as const,

      render: (
        _:
          unknown,

        record:
          StoreRequisition,
      ) => (
        <Space>
            <Button
  size="small"
  icon={<EditOutlined />}
  disabled={
    record.status?.toLowerCase() !== 'submitted'
  }
  onClick={() => {
    window.location.href =
      `/store/store-requisitions/${record.id}/edit`;
  }}
>
  Edit
</Button>
          <Button
            size="small"
            icon={
              <EyeOutlined />
            }
            onClick={() => {
              window.location.href =
                `/store/store-requisitions/${record.id}`;
            }}
          >
            View
          </Button>

          <Button
            size="small"
            icon={
              <PrinterOutlined />
            }
            onClick={() => {
              window.location.href =
                `/store/store-requisitions/${record.id}/print`;
            }}
          >
            Print
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems:
            'center',
          flexWrap:
            'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
            }}
          >
            Store
            Requisitions
          </Title>

          <Text
            type="secondary"
          >
            View and track
            Store Requisitions.
          </Text>
        </div>

        <Space>
          <Button
            icon={
              <ReloadOutlined />
            }
            onClick={() =>
              void loadData()
            }
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={() => {
              window.location.href =
                '/store/store-requisitions/create';
            }}
          >
            New Store
            Requisition
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap:
            'wrap',
          marginBottom: 20,
        }}
      >
        <Input
          allowClear
          value={
            searchInput
          }
          prefix={
            <SearchOutlined />
          }
          placeholder="Search SR number or item"
          style={{
            width: 320,
          }}
          onChange={(
            event,
          ) =>
            setSearchInput(
              event.target
                .value,
            )
          }
          onPressEnter={
            handleSearch
          }
        />

        <Select
          allowClear
          placeholder="Status"
          style={{
            width: 160,
          }}
          value={
            status
          }
          onChange={(
            value,
          ) => {
            setStatus(
              value,
            );

            setPage(1);
          }}
          options={[
            {
              label:
                'Submitted',
              value:
                'submitted',
            },
            {
              label:
                'Posted',
              value:
                'posted',
            },
            {
              label:
                'Completed',
              value:
                'completed',
            },
            {
              label:
                'Cancelled',
              value:
                'cancelled',
            },
          ]}
        />

        <Button
          type="primary"
          icon={
            <SearchOutlined />
          }
          onClick={
            handleSearch
          }
        >
          Search
        </Button>

        <Button
          onClick={
            resetFilters
          }
        >
          Reset
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={columns}
        scroll={{
          x: 1450,
        }}
        pagination={{
          current: page,

          pageSize,

          total,

          showSizeChanger:
            true,

          pageSizeOptions: [
            '10',
            '20',
            '50',
            '100',
          ],

          showTotal: (
            value,
          ) =>
            `Total ${value} Store Requisitions`,

          onChange: (
            nextPage,
            nextPageSize,
          ) => {
            setPage(
              nextPage,
            );

            if (
              nextPageSize !==
              pageSize
            ) {
              setPageSize(
                nextPageSize,
              );

              setPage(1);
            }
          },
        }}
      />
    </Card>
  );
}

export default StoreRequisitionListPage;