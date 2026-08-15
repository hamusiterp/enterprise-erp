import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  App,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Typography,
} from 'antd';

import {
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import {
  projectsApi,
} from '../../../api/projects';

import DataTable, {
  type DataTableChangeParams,
} from '../../../components/common/DataTable';

import FormDrawer from '../../../components/common/FormDrawer';

import {
  createProjectColumns,
} from './columns';

import ProjectForm from './form';

import type {
  Project,
  ProjectFilters,
  ProjectFormValues,
} from '../../../types/project';

const {
  Title,
  Text,
} = Typography;

type DrawerMode =
  | 'create'
  | 'edit'
  | 'view';

const defaultFormValues:
  Partial<ProjectFormValues> = {
    project_no: '',
    project_source: undefined,
    bid_reference: null,
    work_order_no: null,
    project_name: '',
    project_name_letter: '',
    project_description: '',
    location: '',
    customer_id: undefined,
    employer: '',
    has_consultant: 'No',
    consultant: null,
    has_specified_area: 'No',
    area: null,
    construction_project_type:
      undefined,
      contract_date: null,

has_site_handover_date: 'No',
site_handover_date: null,

has_commencement_date: 'No',
commencement_date: null,

project_duration: null,
duration_type: undefined,
no_of_holidays: null,
    status: 'active',
    business_unit: undefined,
contract_type: undefined,

contract_amount_before_vat: null,

contract_pricing_type: undefined,

payment_term: undefined,

has_advance_payment: 'No',
advance_percent: null,

has_advance_repayment: 'No',

advance_repayment_complete_percent:
  null,

advance_repayment_percent:
  null,

advance_repayment_start:
  null,

interim_payment_schedule:
  null,

advance_payment_due_date:
  null,

  has_advance_bond: 'No',
advance_bond_percent: null,
advance_bond_type: null,
advance_bond_start_date: null,
advance_bond_end_date: null,

has_performance_bond: 'No',
performance_bond_percent: null,
performance_bond_type: null,
performance_bond_start_date: null,
performance_bond_end_date: null,
has_price_adjustment: 'No',
price_adjustment_percent: null,

has_retention: 'No',
retention_percent: null,

has_price_index: 'No',

has_liquidity_damage: 'No',
liquidity_percent: null,
liquidity_limit: null,

minimum_payment_time: null,

engineering_facilities: [],
  };

function normalizeText(
  value?: string | null,
): string {
  return value?.trim() ?? '';
}

function ProjectsPage() {
  const {
    message,
  } = App.useApp();

  const [form] =
    Form.useForm<ProjectFormValues>();

  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  const [
    loading,
    setLoading,
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
    editingProject,
    setEditingProject,
  ] = useState<Project | null>(
    null,
  );

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<Project | null>(
    null,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState('');

  const [
    filters,
    setFilters,
  ] = useState<ProjectFilters>({
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

  const loadProjects =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await projectsApi.list(
            filters,
          );

        setProjects(
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
        console.error(error);

        message.error(
          'Unable to load projects.',
        );
      } finally {
        setLoading(false);
      }
    }, [
      filters,
      message,
    ]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleTableChange = (
    params:
      DataTableChangeParams<Project>,
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

  const handleCreate =
    async () => {
      setEditingProject(null);
      setDrawerMode('create');

      form.resetFields();

      try {
        const projectNumber =
          await projectsApi
            .nextProjectNumber();

        form.setFieldsValue({
          ...defaultFormValues,
          project_no:
            projectNumber,
        });
      } catch (error) {
        console.error(error);

        form.setFieldsValue({
          ...defaultFormValues,
        });

        message.warning(
          'Project number will be generated when the project is saved.',
        );
      }

      setDrawerOpen(true);
    };

  const setProjectFormValues = (
    project: Project,
  ) => {
    form.setFieldsValue({
      project_no:
        project.project_no,

      project_source:
        project.project_source,

      bid_reference:
        project.bid_reference,

      work_order_no:
        project.work_order_no,

      project_name:
        project.project_name,

      project_name_letter:
        project.project_name_letter,

      project_description:
        project.project_description,

      location:
        project.location,

      customer_id:
        project.customer_id,

      employer:
        project.employer,

      has_consultant:
        project.has_consultant,

      consultant:
        project.consultant,

      has_specified_area:
        project.has_specified_area,

      area:
        project.area,

      construction_project_type:
        project
          .construction_project_type,

          business_unit:
  project.business_unit ?? '',

contract_type:
  project.contract_type ?? '',

contract_amount_before_vat:
  project.contract_amount_before_vat !== null &&
  project.contract_amount_before_vat !== undefined
    ? Number(
        project.contract_amount_before_vat,
      )
    : null,

contract_pricing_type:
  project.contract_pricing_type ?? '',
  contract_date:
  project.contract_date,

has_site_handover_date:
  project.has_site_handover_date,

site_handover_date:
  project.site_handover_date,

has_commencement_date:
  project.has_commencement_date,

commencement_date:
  project.commencement_date,

project_duration:
  project.project_duration,

duration_type:
  project.duration_type ?? undefined,

no_of_holidays:
  project.no_of_holidays,

  payment_term:
  project.payment_term
  ?? undefined,

has_advance_payment:
  project.has_advance_payment,

advance_percent:
  project.advance_percent,

has_advance_repayment:
  project.has_advance_repayment,

advance_repayment_complete_percent:
  project.advance_repayment_complete_percent,

advance_repayment_percent:
  project.advance_repayment_percent,

advance_repayment_start:
  project.advance_repayment_start,

interim_payment_schedule:
  project.interim_payment_schedule,

advance_payment_due_date:
  project.advance_payment_due_date,

has_advance_bond:
  project.has_advance_bond,

advance_bond_percent:
  project.advance_bond_percent,

advance_bond_type:
  project.advance_bond_type,

advance_bond_start_date:
  project.advance_bond_start_date,

advance_bond_end_date:
  project.advance_bond_end_date,

has_performance_bond:
  project.has_performance_bond,

performance_bond_percent:
  project.performance_bond_percent,

performance_bond_type:
  project.performance_bond_type,

performance_bond_start_date:
  project.performance_bond_start_date,

performance_bond_end_date:
  project.performance_bond_end_date,

  has_price_adjustment:
  project.has_price_adjustment,

price_adjustment_percent:
  project.price_adjustment_percent,

has_retention:
  project.has_retention,

retention_percent:
  project.retention_percent,

has_price_index:
  project.has_price_index,

has_liquidity_damage:
  project.has_liquidity_damage,

liquidity_percent:
  project.liquidity_percent,

liquidity_limit:
  project.liquidity_limit,

minimum_payment_time:
  project.minimum_payment_time,

engineering_facilities:
  project.engineering_facilities ?? [],

      status:
        project.status,
    });
  };

  const handleView = (
    project: Project,
  ) => {
    setEditingProject(project);
    setDrawerMode('view');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();
      setProjectFormValues(
        project,
      );
    }, 0);
  };

  const handleEdit = (
    project: Project,
  ) => {
    setEditingProject(project);
    setDrawerMode('edit');
    setDrawerOpen(true);

    setTimeout(() => {
      form.resetFields();
      setProjectFormValues(
        project,
      );
    }, 0);
  };

  const handleDrawerClose = () => {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingProject(null);
    setDrawerMode('create');

    form.resetFields();
  };

  const requestDelete = (
    project: Project,
  ) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const handleDelete =
    async () => {
      if (!selectedProject) {
        return;
      }

      try {
        await projectsApi.remove(
          selectedProject.id,
        );

        message.success(
          'Project deleted successfully.',
        );

        setDeleteOpen(false);
        setSelectedProject(null);

        await loadProjects();
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to delete project.',
        );
      }
    };

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
          ProjectFormValues = {
            project_no: '',

            project_source:
              values.project_source,

            bid_reference:
              values.project_source
                === 'Bid'
                ? values.bid_reference
                : null,

            work_order_no:
              values.project_source
                === 'Work Order'
                ? values.work_order_no
                : null,

            project_name:
              normalizeText(
                values.project_name,
              ),

            project_name_letter:
              normalizeText(
                values.project_name_letter,
              ),

            project_description:
              normalizeText(
                values
                  .project_description,
              ),

            location:
              normalizeText(
                values.location,
              ),

            customer_id:
              values.customer_id,

            employer:
              normalizeText(
                values.employer,
              ),

            has_consultant:
              values.has_consultant,

            consultant:
              values.has_consultant
                === 'Yes'
                ? normalizeText(
                    values.consultant,
                  )
                : null,

            has_specified_area:
              values.has_specified_area,

            area:
              values.has_specified_area
                === 'Yes'
                ? normalizeText(
                    values.area,
                  )
                : null,

            construction_project_type:
              values
                .construction_project_type,

                business_unit:
  normalizeText(
    values.business_unit,
  ),

contract_type:
  normalizeText(
    values.contract_type,
  ),

contract_amount_before_vat:
  values.contract_amount_before_vat,

contract_pricing_type:
  normalizeText(
    values.contract_pricing_type,
  ),

  contract_date:
  values.contract_date,

has_site_handover_date:
  values.has_site_handover_date,

site_handover_date:
  values.has_site_handover_date
    === 'Yes'
    ? values.site_handover_date
    : null,

has_commencement_date:
  values.has_commencement_date,

commencement_date:
  values.has_commencement_date
    === 'Yes'
    ? values.commencement_date
    : null,

project_duration:
  values.project_duration,

duration_type:
  values.duration_type,

no_of_holidays:
  values.duration_type
    === 'working_days'
    ? values.no_of_holidays
    : null,
payment_term:
  values.payment_term,

has_advance_payment:
  values.has_advance_payment,

advance_percent:
  values.has_advance_payment
    === 'Yes'
    ? values.advance_percent
    : null,

has_advance_repayment:
  values.has_advance_repayment,

advance_repayment_complete_percent:
  values.has_advance_repayment
    === 'Yes'
    ? values
        .advance_repayment_complete_percent
    : null,

advance_repayment_percent:
  values.has_advance_repayment
    === 'Yes'
    ? values.advance_repayment_percent
    : null,

advance_repayment_start:
  values.has_advance_repayment
    === 'Yes'
    ? values.advance_repayment_start
    : null,

interim_payment_schedule:
  values.interim_payment_schedule,

advance_payment_due_date:
  values.advance_payment_due_date,

has_advance_bond:
  values.has_advance_bond,

advance_bond_percent:
  values.has_advance_bond === 'Yes'
    ? values.advance_bond_percent
    : null,

advance_bond_type:
  values.has_advance_bond === 'Yes'
    ? values.advance_bond_type
    : null,

advance_bond_start_date:
  values.has_advance_bond === 'Yes'
    ? values.advance_bond_start_date
    : null,

advance_bond_end_date:
  values.has_advance_bond === 'Yes'
    ? values.advance_bond_end_date
    : null,

has_performance_bond:
  values.has_performance_bond,

performance_bond_percent:
  values.has_performance_bond === 'Yes'
    ? values.performance_bond_percent
    : null,

performance_bond_type:
  values.has_performance_bond === 'Yes'
    ? values.performance_bond_type
    : null,

performance_bond_start_date:
  values.has_performance_bond === 'Yes'
    ? values.performance_bond_start_date
    : null,

performance_bond_end_date:
  values.has_performance_bond === 'Yes'
    ? values.performance_bond_end_date
    : null,

  has_price_adjustment:
  values.has_price_adjustment,

price_adjustment_percent:
  values.has_price_adjustment === 'Yes'
    ? values.price_adjustment_percent
    : null,

has_retention:
  values.has_retention,

retention_percent:
  values.has_retention === 'Yes'
    ? values.retention_percent
    : null,

has_price_index:
  values.has_price_index,

has_liquidity_damage:
  values.has_liquidity_damage,

liquidity_percent:
  values.has_liquidity_damage === 'Yes'
    ? values.liquidity_percent
    : null,

liquidity_limit:
  values.has_liquidity_damage === 'Yes'
    ? values.liquidity_limit
    : null,

minimum_payment_time:
  values.minimum_payment_time,

engineering_facilities:
  values.engineering_facilities ?? [],
            status:
              values.status,
          };

        /*
         * ProjectRequest converts Yes/No values to real
         * booleans during prepareForValidation().
         */
        if (
          drawerMode === 'edit'
          && editingProject
        ) {
          await projectsApi.update(
            editingProject.id,
            payload,
          );

          message.success(
            'Project updated successfully.',
          );
        } else {
          await projectsApi.create(
            payload,
          );

          message.success(
            'Project created successfully.',
          );
        }

        setDrawerOpen(false);
        setEditingProject(null);
        setDrawerMode('create');

        form.resetFields();

        await loadProjects();
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
              ? 'Unable to update project.'
              : 'Unable to create project.'
          ),
        );
      } finally {
        setSaving(false);
      }
    };

  const handleExport =
    async () => {
      setExporting(true);

      try {
        await projectsApi.exportFile(
          filters,
        );

        message.success(
          'Projects exported successfully.',
        );
      } catch (error) {
        console.error(error);

        message.error(
          'Unable to export projects.',
        );
      } finally {
        setExporting(false);
      }
    };

  const columns =
    createProjectColumns({
      onView:
        handleView,

      onEdit:
        handleEdit,

      onDelete:
        requestDelete,
    });

  const drawerTitle =
    drawerMode === 'view'
      ? 'View Project'
      : drawerMode === 'edit'
        ? 'Edit Project'
        : 'Add Project';

  const submitText =
    drawerMode === 'view'
      ? 'Close'
      : drawerMode === 'edit'
        ? 'Update Project'
        : 'Save Project';

  return (
    <Card>
      <Flex
        justify="space-between"
        align="center"
        gap={16}
        wrap="wrap"
        style={{
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
            Projects
          </Title>

          <Text type="secondary">
            Manage Bid and Work Order
            construction projects.
          </Text>
        </div>

        <Space>
          <Button
            icon={
              <DownloadOutlined />
            }
            loading={exporting}
            onClick={() =>
              void handleExport()
            }
          >
            Export Excel
          </Button>

          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={() =>
              void handleCreate()
            }
          >
            Add Project
          </Button>
        </Space>
      </Flex>

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
          placeholder="Search project number, name, employer or location"
          style={{
            width: 340,
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

        <Select
          allowClear
          placeholder="Project Source"
          style={{
            width: 170,
          }}
          value={
            filters.project_source
          }
          options={[
            {
              label: 'Bid',
              value: 'Bid',
            },
            {
              label: 'Work Order',
              value: 'Work Order',
            },
          ]}
          onChange={(
            projectSource,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,
                project_source:
                  projectSource,
              }),
            );
          }}
        />

        <Select
          allowClear
          placeholder="Construction Type"
          style={{
            width: 190,
          }}
          value={
            filters
              .construction_project_type
          }
          options={[
            {
              label:
                'Private Project',
              value:
                'Private Project',
            },
            {
              label:
                'Federal Project',
              value:
                'Federal Project',
            },
          ]}
          onChange={(
            constructionType,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page: 1,

                construction_project_type:
                  constructionType,
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
        title="Delete project"
        description={`Delete ${
          selectedProject
            ?.project_name
          ?? 'this project'
        }?`}
        open={deleteOpen}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
        }}
        onConfirm={() =>
          void handleDelete()
        }
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedProject(null);
        }}
      >
        <span />
      </Popconfirm>

      <DataTable<Project>
        columns={columns}
        data={projects}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={
          handleTableChange
        }
        scroll={{
          x: 1850,
        }}
      />

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
        <ProjectForm
          form={form}
          disabled={
            saving
            || drawerMode === 'view'
          }
        />
      </FormDrawer>
    </Card>
  );
}

export default ProjectsPage;