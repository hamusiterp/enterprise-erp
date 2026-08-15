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
  Form,
  Input,
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
  subcontractorsApi,
} from '../../../api/subcontractors';

import {
  categoriesApi,
} from '../../../api/categories';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer
  from '../../../components/common/FormDrawer';

import SubcontractorForm
  from './form';

import {
  subcontractorColumns,
} from './columns';

import type {
  Subcontractor,
  SubcontractorFilters,
  SubcontractorFormValues,
  SubcontractorStatistics,
  SubcontractorTaxPercent,
  SubcontractorType,
} from '../../../types/subcontractor';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

interface CategoryOption {
  id: number;
  name: string;
}

const emptyStatistics:
  SubcontractorStatistics = {
    total: 0,
    active: 0,
    inactive: 0,
    companies: 0,
    individuals: 0,
    tax_0: 0,
    tax_2: 0,
    tax_10: 0,
    tax_15: 0,
    deleted: 0,
  };

const defaultFormValues:
  Partial<SubcontractorFormValues> = {
    type: 'company',

    firstname: null,

    lastname: null,

    company_name: null,

    tin_no: null,

    address: '',

    contact_person: '',

    phone_number: '',

    tax_percent: 0,

    category_id: undefined,

    status: 'active',
  };

function cleanText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function SubcontractorsPage() {
  const {
    message,
    modal,
  } = App.useApp();

  const [form] =
    Form.useForm<SubcontractorFormValues>();

  const [
    subcontractors,
    setSubcontractors,
  ] = useState<Subcontractor[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<CategoryOption[]>([]);

  const [
    statistics,
    setStatistics,
  ] = useState<SubcontractorStatistics>(
    emptyStatistics,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(false);

  const [
    statisticsLoading,
    setStatisticsLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    exporting,
    setExporting,
  ] = useState(false);

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [
    drawerMode,
    setDrawerMode,
  ] = useState<DrawerMode>(
    'create',
  );

  const [
    selectedSubcontractor,
    setSelectedSubcontractor,
  ] = useState<Subcontractor | null>(
    null,
  );

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  const [
    filters,
    setFilters,
  ] = useState<SubcontractorFilters>({
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

  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    useCallback(async () => {
      setCategoriesLoading(true);

      try {
        const response =
          await categoriesApi.list({
            page: 1,
            per_page: 100,
            status: 'active',
          });

        const mapped: CategoryOption[] =
        (response.data ?? []).map((category) => ({
            id: category.id,
            name: category.category,
        }));

        setCategories(mapped);
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load categories.',
        );
      } finally {
        setCategoriesLoading(false);
      }
    }, [message]);

  /*
  |--------------------------------------------------------------------------
  | Load Statistics
  |--------------------------------------------------------------------------
  */

  const loadStatistics =
    useCallback(async () => {
      setStatisticsLoading(true);

      try {
        const response =
          await subcontractorsApi
            .statistics();

        setStatistics(response);
      } catch (error) {
        console.error(error);

        setStatistics(
          emptyStatistics,
        );
      } finally {
        setStatisticsLoading(false);
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Subcontractors
  |--------------------------------------------------------------------------
  */

  const loadSubcontractors =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await subcontractorsApi.list(
            filters,
          );

        setSubcontractors(
          response.data ?? [],
        );

        setPagination({
          current:
            response.pagination
              ?.current_page
            ?? 1,

          pageSize:
            response.pagination
              ?.per_page
            ?? filters.per_page
            ?? 10,

          total:
            response.pagination
              ?.total
            ?? 0,
        });
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to load subcontractors.',
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
    void loadSubcontractors();
  }, [
    loadSubcontractors,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Table
  |--------------------------------------------------------------------------
  */

  const handleTableChange = (
    params:
      DataTableChangeParams<Subcontractor>,
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

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Set Form Values
  |--------------------------------------------------------------------------
  */

  const setSubcontractorFormValues = (
    subcontractor: Subcontractor,
  ) => {
    form.setFieldsValue({
      type:
        subcontractor.type,

      firstname:
        subcontractor.firstname
        ?? null,

      lastname:
        subcontractor.lastname
        ?? null,

      company_name:
        subcontractor.company_name
        ?? null,

      tin_no:
        subcontractor.tin_no
        ?? null,

      address:
        subcontractor.address,

      contact_person:
        subcontractor.contact_person,

      phone_number:
        subcontractor.phone_number,

      tax_percent:
        Number(
          subcontractor.tax_percent,
        ) as SubcontractorTaxPercent,

      category_id:
        subcontractor.category_id,

      status:
        subcontractor.status,
    });
  };
    /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  const handleCreate = () => {
    setSelectedSubcontractor(null);

    setDrawerMode('create');

    form.resetFields();

    form.setFieldsValue({
      ...defaultFormValues,
    });

    setDrawerOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | View
  |--------------------------------------------------------------------------
  */

  const handleView = (
    subcontractor: Subcontractor,
  ) => {
    setSelectedSubcontractor(
      subcontractor,
    );

    setDrawerMode('view');

    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setSubcontractorFormValues(
        subcontractor,
      );
    }, 0);
  };

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const handleEdit = (
    subcontractor: Subcontractor,
  ) => {
    setSelectedSubcontractor(
      subcontractor,
    );

    setDrawerMode('edit');

    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();

      setSubcontractorFormValues(
        subcontractor,
      );
    }, 0);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Drawer
  |--------------------------------------------------------------------------
  */

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);

    setSelectedSubcontractor(null);

    setDrawerMode('create');

    form.resetFields();
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async () => {
      if (
        drawerMode === 'view'
      ) {
        handleDrawerClose();

        return;
      }

      try {
        const values =
          await form.validateFields();

        setSaving(true);

        const payload:
          SubcontractorFormValues = {
            type:
              values.type,

            firstname:
              values.type
              === 'individual'
                ? cleanText(
                    values.firstname,
                  )
                : null,

            lastname:
              values.type
              === 'individual'
                ? cleanText(
                    values.lastname,
                  )
                : null,

            company_name:
              values.type
              === 'company'
                ? cleanText(
                    values.company_name,
                  )
                : null,

            tin_no:
              values.type
              === 'company'
                ? cleanText(
                    values.tin_no,
                  )
                : null,

            address:
              cleanText(
                values.address,
              ),

            contact_person:
              cleanText(
                values.contact_person,
              ),

            phone_number:
              cleanText(
                values.phone_number,
              ),

            tax_percent:
              Number(
                values.tax_percent,
              ) as SubcontractorTaxPercent,

            category_id:
              values.category_id,

            status:
              values.status,
          };

        if (
          drawerMode === 'edit'
          && selectedSubcontractor
        ) {
          await subcontractorsApi.update(
            selectedSubcontractor.id,
            payload,
          );

          message.success(
            'Subcontractor updated successfully.',
          );
        } else {
          await subcontractorsApi.create(
            payload,
          );

          message.success(
            'Subcontractor created successfully.',
          );
        }

        setDrawerOpen(false);

        setSelectedSubcontractor(
          null,
        );

        setDrawerMode('create');

        form.resetFields();

        await Promise.all([
          loadSubcontractors(),
          loadStatistics(),
        ]);
      } catch (error: unknown) {
        if (
          typeof error === 'object'
          && error !== null
          && 'errorFields' in error
        ) {
          return;
        }

        console.error(error);

        const responseError =
          error as {
            response?: {
              status?: number;

              data?: {
                message?: string;

                errors?: Record<
                  string,
                  string[]
                >;
              };
            };
          };

        const validationErrors =
          responseError.response
            ?.data?.errors;

        if (
          responseError.response
            ?.status === 422
          && validationErrors
        ) {
          const firstError =
            Object.values(
              validationErrors,
            ).flat()[0];

          message.error(
            firstError
            ?? 'Please check the required fields.',
          );

          return;
        }

        message.error(
          responseError.response
            ?.data?.message
          ?? (
            drawerMode === 'edit'
              ? 'Unable to update subcontractor.'
              : 'Unable to create subcontractor.'
          ),
        );
      } finally {
        setSaving(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = (
    subcontractor: Subcontractor,
  ) => {
    modal.confirm({
      title:
        'Delete subcontractor',

      content:
        `Move ${subcontractor.display_name} to the recycle bin?`,

      okText:
        'Delete',

      cancelText:
        'Cancel',

      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          await subcontractorsApi.remove(
            subcontractor.id,
          );

          message.success(
            'Subcontractor moved to the recycle bin.',
          );

          await Promise.all([
            loadSubcontractors(),
            loadStatistics(),
          ]);
        } catch (error: unknown) {
          console.error(error);

          const responseError =
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };

          message.error(
            responseError.response
              ?.data?.message
            ?? 'Unable to delete subcontractor.',
          );
        }
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Export
  |--------------------------------------------------------------------------
  */

  const handleExport =
    async () => {
      setExporting(true);

      try {
        await subcontractorsApi
          .exportFile(
            filters,
          );

        message.success(
          'Subcontractor export downloaded successfully.',
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to export subcontractors.',
        );
      } finally {
        setExporting(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  const columns =
    subcontractorColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onDelete:
        handleDelete,
    });

  /*
  |--------------------------------------------------------------------------
  | Drawer
  |--------------------------------------------------------------------------
  */

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Subcontractor'
      : drawerMode === 'edit'
        ? 'Edit Subcontractor'
        : 'Add Subcontractor';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Subcontractor'
        : 'Save Subcontractor';
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
              Subcontractors
            </Title>

            <Text type="secondary">
              Manage company and individual subcontractors.
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
              onClick={
                handleCreate
              }
            >
              Add Subcontractor
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
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Total"
              value={
                statistics.total
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
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Active"
              value={
                statistics.active
              }
              valueStyle={{
                color: '#389e0d',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Inactive"
              value={
                statistics.inactive
              }
              valueStyle={{
                color: '#8c8c8c',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Companies"
              value={
                statistics.companies
              }
              valueStyle={{
                color: '#1677ff',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="Individuals"
              value={
                statistics.individuals
              }
              valueStyle={{
                color: '#722ed1',
              }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
        >
          <Card
            loading={
              statisticsLoading
            }
          >
            <Statistic
              title="15% Tax"
              value={
                statistics.tax_15
              }
              valueStyle={{
                color: '#cf1322',
              }}
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
            placeholder="Search name, company, TIN, phone, contact person or address"
            style={{
              width: 390,
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
            placeholder="Type"
            style={{
              width: 150,
            }}
            value={
              filters.type
            }
            options={[
              {
                label: 'Company',
                value: 'company',
              },
              {
                label: 'Individual',
                value: 'individual',
              },
            ]}
            onChange={(
              type?: SubcontractorType,
            ) => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  type,
                }),
              );
            }}
          />

          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Category"
            style={{
              width: 210,
            }}
            loading={
              categoriesLoading
            }
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
            onChange={(
              categoryId?: number,
            ) => {
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
            placeholder="Tax"
            style={{
              width: 130,
            }}
            value={
              filters.tax_percent
            }
            options={[
              {
                label: '0%',
                value: 0,
              },
              {
                label: '2%',
                value: 2,
              },
              {
                label: '10%',
                value: 10,
              },
              {
                label: '15%',
                value: 15,
              },
            ]}
            onChange={(
              taxPercent?:
                SubcontractorTaxPercent,
            ) => {
              setFilters(
                (current) => ({
                  ...current,
                  page: 1,
                  tax_percent:
                    taxPercent,
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
            value={
              filters.status
            }
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

        <DataTable<Subcontractor>
          columns={columns}
          data={subcontractors}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={
            handleTableChange
          }
          scroll={{
            x: 1450,
          }}
        />
      </Card>

      <FormDrawer
        title={drawerTitle}
        open={drawerOpen}
        loading={saving}
        submitText={submitText}
        onClose={
          handleDrawerClose
        }
        onSubmit={() =>
          void handleSave()
        }
      >
        <SubcontractorForm
          form={form}
          categories={
            categories
          }
          categoriesLoading={
            categoriesLoading
          }
          disabled={saving}
          readOnly={
            drawerMode === 'view'
          }
        />
      </FormDrawer>
    </Space>
  );
}

export default SubcontractorsPage;