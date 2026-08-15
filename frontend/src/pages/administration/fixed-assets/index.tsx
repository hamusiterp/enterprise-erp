import {
  useCallback,
  useEffect,

  useState,
} from 'react';

import {
  App,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from 'antd';

import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import {
  useNavigate,
} from 'react-router';

import {
  categoriesApi,
} from '../../../api/categories';

import {
  fixedAssetsApi,
} from '../../../api/fixedAssets';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import {
  createFixedAssetColumns,
} from './columns';

import type {
  FixedAsset,
  FixedAssetCategory,
  FixedAssetFilters,
  FixedAssetStatistics,
} from '../../../types/fixedAsset';

const {
  Title,
  Text,
} = Typography;

const emptyStatistics: FixedAssetStatistics = {
  total: 0,
  active: 0,
  inactive: 0,
  excellent: 0,
  good: 0,
  fair: 0,
  poor: 0,
  out_of_service: 0,
  with_gauge: 0,
  without_gauge: 0,
  deleted: 0,
};

function downloadBlob(
  blob: Blob,
  fileName: string,
): void {
  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}

function FixedAssetsPage() {
  const {
    message,
  } = App.useApp();

  const navigate =
    useNavigate();

  const [
    assets,
    setAssets,
  ] = useState<FixedAsset[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<FixedAssetCategory[]>(
    [],
  );

  const [
    statistics,
    setStatistics,
  ] = useState<FixedAssetStatistics>(
    emptyStatistics,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    statisticsLoading,
    setStatisticsLoading,
  ] = useState(false);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(false);

  const [
    exporting,
    setExporting,
  ] = useState(false);

  const [
    selectedAsset,
    setSelectedAsset,
  ] = useState<FixedAsset | null>(
    null,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  const [
    filters,
    setFilters,
  ] = useState<FixedAssetFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'id',
    sort_direction: 'desc',
  });

  const [
    pagination,
    setPagination,
  ] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadCategories =
    useCallback(async () => {
      setCategoriesLoading(true);

      try {
        const options =
          await categoriesApi.options(
            'machine',
          );

        const mappedCategories:
          FixedAssetCategory[] =
          options.map((item) => ({
            id:
              item.id
              ?? item.value,

            name:
              item.name
              ?? item.category
              ?? item.label,

            type:
              item.type,
          }));

        setCategories(
          mappedCategories,
        );
      } catch (error) {
        console.error(
          'Unable to load fixed asset categories:',
          error,
        );

        message.error(
          'Unable to load machine categories.',
        );
      } finally {
        setCategoriesLoading(false);
      }
    }, [message]);

  const loadStatistics =
    useCallback(async () => {
      setStatisticsLoading(true);

      try {
        const result =
          await fixedAssetsApi
            .statistics();

        setStatistics(
          result,
        );
      } catch (error) {
        console.error(
          'Unable to load fixed asset statistics:',
          error,
        );

        setStatistics(
          emptyStatistics,
        );
      } finally {
        setStatisticsLoading(false);
      }
    }, []);

  const loadAssets =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await fixedAssetsApi.list(
            filters,
          );

        setAssets(
          response.data ?? [],
        );

        setPagination({
          current:
            response.pagination
              ?.current_page ?? 1,

          pageSize:
            response.pagination
              ?.per_page
            ?? filters.per_page
            ?? 10,

          total:
            response.pagination
              ?.total ?? 0,
        });
      } catch (error) {
        console.error(
          'Unable to load fixed assets:',
          error,
        );

        message.error(
          'Unable to load fixed assets.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadCategories();
    void loadStatistics();
  }, [
    loadCategories,
    loadStatistics,
  ]);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const handleSearch = () => {
    setFilters((current) => ({
      ...current,

      page: 1,

      search:
        searchValue.trim()
        || undefined,
    }));
  };

  const handleResetFilters = () => {
    setSearchValue('');

    setFilters({
      page: 1,

      per_page:
        pagination.pageSize,

      sort_by: 'id',

      sort_direction: 'desc',
    });
  };

  const handleTableChange = (
    params:
      DataTableChangeParams<FixedAsset>,
  ) => {
    setFilters((current) => ({
      ...current,

      page:
        params.page,

      per_page:
        params.pageSize,

      sort_by:
        params.sortField
        ?? current.sort_by,

      sort_direction:
        params.sortDirection
        ?? current.sort_direction,
    }));
  };

  const handleView = (
    asset: FixedAsset,
  ) => {
    navigate(
      `/administration/fixed-assets/${asset.id}`,
    );
  };

  const handleEdit = (
    asset: FixedAsset,
  ) => {
    navigate(
      `/administration/fixed-assets/${asset.id}/edit`,
    );
  };

  const requestDelete = (
    asset: FixedAsset,
  ) => {
    setSelectedAsset(
      asset,
    );

    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedAsset) {
        return;
      }

      setDeleting(true);

      try {
        await fixedAssetsApi.remove(
          selectedAsset.id,
        );

        message.success(
          'Fixed asset deleted successfully.',
        );

        setDeleteOpen(false);

        setSelectedAsset(null);

        await Promise.all([
          loadAssets(),
          loadStatistics(),
        ]);
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete fixed asset.',
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleExport =
    async () => {
      setExporting(true);

      try {
        const blob =
          await fixedAssetsApi.export(
            filters,
          );

        const fileName =
          `fixed_assets_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        downloadBlob(
          blob,
          fileName,
        );

        message.success(
          'Fixed asset export downloaded successfully.',
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to export fixed assets.',
        );
      } finally {
        setExporting(false);
      }
    };

  const columns =
  createFixedAssetColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: requestDelete,
  });

  return (
    <Space
      direction="vertical"
      size={20}
      style={{
        width: '100%',
      }}
    >
      <Card>
        <Flex
          justify="space-between"
          align="center"
          gap={16}
          wrap="wrap"
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              Fixed Assets
            </Title>

            <Text type="secondary">
              Manage machinery,
              vehicles, equipment,
              documents, photos and
              service information.
            </Text>
          </div>

          <Space wrap>
            <Button
              icon={
                <DownloadOutlined />
              }
              loading={exporting}
              onClick={() =>
                void handleExport()
              }
            >
              Export
            </Button>

            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              onClick={() =>
                navigate(
                  '/administration/fixed-assets/create',
                )
              }
            >
              Add Fixed Asset
            </Button>
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Total Assets"
              value={statistics.total}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Active Assets"
              value={statistics.active}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Inactive Assets"
              value={statistics.inactive}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Out of Service"
              value={
                statistics
                  .out_of_service
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Excellent Condition"
              value={
                statistics.excellent
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Good Condition"
              value={statistics.good}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="With Gauge"
              value={
                statistics.with_gauge
              }
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card loading={statisticsLoading}>
            <Statistic
              title="Recycle Bin"
              value={statistics.deleted}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Flex
          gap={12}
          wrap="wrap"
          style={{
            marginBottom: 20,
          }}
        >
          <Input
            allowClear
            value={searchValue}
            prefix={
              <SearchOutlined />
            }
            placeholder="Search asset number, tag, plate, machinery, engine or location"
            style={{
              width: 380,
            }}
            onChange={(event) =>
              setSearchValue(
                event.target.value,
              )
            }
            onPressEnter={
              handleSearch
            }
          />

          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Category"
            loading={
              categoriesLoading
            }
            style={{
              width: 220,
            }}
            value={
              filters.category_id
            }
            options={categories.map(
              (category) => ({
                label:
                  category.name,

                value:
                  category.id,
              }),
            )}
            onChange={(categoryId) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  category_id:
                    categoryId,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Status"
            style={{
              width: 140,
            }}
            value={filters.status}
            options={[
              {
                label: 'Active',
                value: 'active',
              },
              {
                label: 'Inactive',
                value: 'inactive',
              },
            ]}
            onChange={(status) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  status,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Condition"
            style={{
              width: 180,
            }}
            value={
              filters.asset_condition
            }
            options={[
              {
                label: 'Excellent',
                value: 'excellent',
              },
              {
                label: 'Good',
                value: 'good',
              },
              {
                label: 'Fair',
                value: 'fair',
              },
              {
                label: 'Poor',
                value: 'poor',
              },
              {
                label: 'Out of Service',
                value: 'out_of_service',
              },
            ]}
            onChange={(
              assetCondition,
            ) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  asset_condition:
                    assetCondition,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Reading Type"
            style={{
              width: 190,
            }}
            value={
              filters.reading_type
            }
            options={[
              {
                label:
                  'Engine Horse Power',

                value:
                  'engine_horse_power',
              },
              {
                label:
                  'KM Reading',

                value:
                  'km_reading',
              },
            ]}
            onChange={(readingType) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  reading_type:
                    readingType,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Fuel Type"
            style={{
              width: 150,
            }}
            value={
              filters.type_of_fuel
            }
            options={[
              {
                label: 'Diesel',
                value: 'Diesel',
              },
              {
                label: 'Petrol',
                value: 'Petrol',
              },
              {
                label: 'Electric',
                value: 'Electric',
              },
              {
                label: 'Hybrid',
                value: 'Hybrid',
              },
              {
                label: 'Gas',
                value: 'Gas',
              },
              {
                label: 'Other',
                value: 'Other',
              },
            ]}
            onChange={(fuelType) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  type_of_fuel:
                    fuelType,
                }),
              );
            }}
          />

          <Select
            allowClear
            placeholder="Gauge"
            style={{
              width: 140,
            }}
            value={
              filters.has_gauge
            }
            options={[
              {
                label: 'With Gauge',
                value: true,
              },
              {
                label: 'Without Gauge',
                value: false,
              },
            ]}
            onChange={(hasGauge) => {
              setFilters(
                (current) => ({
                  ...current,

                  page: 1,

                  has_gauge:
                    hasGauge,
                }),
              );
            }}
          />

          <Space>
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
              icon={
                <ReloadOutlined />
              }
              onClick={
                handleResetFilters
              }
            >
              Reset
            </Button>
          </Space>
        </Flex>

        <Popconfirm
          title="Delete fixed asset"
          description={`Delete ${
            selectedAsset
              ? `${selectedAsset.asset_no} - ${selectedAsset.name_of_machinery}`
              : 'this fixed asset'
          }?`}
          open={deleteOpen}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            loading: deleting,
          }}
          onConfirm={() =>
            void handleDelete()
          }
          onCancel={() => {
            setDeleteOpen(false);
            setSelectedAsset(null);
          }}
        >
          <span />
        </Popconfirm>

        <DataTable<FixedAsset>
          columns={columns}
          data={assets}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={
            handleTableChange
          }
          scroll={{
            x: 1900,
          }}
        />
      </Card>
    </Space>
  );
}

export default FixedAssetsPage;