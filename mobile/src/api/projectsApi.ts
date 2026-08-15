import api from './api';


export type ProjectStatus =
  | 'active'
  | 'inactive';

export type ProjectSource =
  | 'Bid'
  | 'Work Order';

export type ConstructionProjectType =
  | 'Private Project'
  | 'Federal Project';

export type DurationType =
  | 'working_days'
  | 'calendar_days';

export type PaymentTerm =
  | 'cash_on_delivery'
  | 'after_work_executed';

export type YesNo =
  | 'Yes'
  | 'No';


export interface Project {
  id: number;

  project_no: string;

  project_source: ProjectSource;

  bid_reference?: string | null;

  work_order_no?: string | null;

  project_name: string;

  project_name_letter?: string | null;

  project_description: string;

  location: string;

  customer_id: number;

  employer?: string | null;

  has_consultant: boolean;

  consultant?: string | null;

  has_specified_area: boolean;

  area?: string | null;

  construction_project_type:
    ConstructionProjectType;

  business_unit: string;

  contract_type: string;

  contract_amount_before_vat:
    string | number;

  contract_pricing_type: string;

  contract_date: string;

  has_site_handover_date: boolean;

  site_handover_date?: string | null;

  has_commencement_date: boolean;

  commencement_date?: string | null;

  project_duration: number;

  duration_type: DurationType;

  no_of_holidays?: number | null;

  payment_term: PaymentTerm;

  has_advance_payment: boolean;

  advance_percent?: number | null;

  has_advance_repayment: boolean;

  advance_repayment_complete_percent?:
    number | null;

  advance_repayment_percent?:
    number | null;

  advance_repayment_start?:
    string | null;

  interim_payment_schedule: number;

  advance_payment_due_date: string;

  has_advance_bond: boolean;

  advance_bond_percent?:
    number | null;

  advance_bond_type?:
    string | null;

  advance_bond_start_date?:
    string | null;

  advance_bond_end_date?:
    string | null;

  has_performance_bond: boolean;

  performance_bond_percent?:
    number | null;

  performance_bond_type?:
    string | null;

  performance_bond_start_date?:
    string | null;

  performance_bond_end_date?:
    string | null;

  has_price_adjustment: boolean;

  price_adjustment_percent?:
    number | null;

  has_retention: boolean;

  retention_percent?:
    number | null;

  has_price_index: boolean;

  has_liquidity_damage: boolean;

  liquidity_percent?:
    number | null;

  liquidity_limit?:
    number | null;

  minimum_payment_time: number;

  engineering_facilities: string[];

  status: ProjectStatus;

  registered_by?: string | null;

  registered_by_user_id?: number | null;

  date_registered?: string | null;

  created_at?: string | null;

  updated_at?: string | null;

  deleted_at?: string | null;
}


export interface ProjectPayload {
  project_source: ProjectSource;

  bid_reference?: string | null;

  work_order_no?: string | null;

  project_name: string;

  project_name_letter?: string | null;

  project_description: string;

  location: string;

  customer_id: number;

  has_consultant: YesNo;

  consultant?: string | null;

  has_specified_area: YesNo;

  area?: string | null;

  construction_project_type:
    ConstructionProjectType;

  business_unit: string;

  contract_type: string;

  contract_amount_before_vat:
    number;

  contract_pricing_type: string;

  contract_date: string;

  has_site_handover_date: YesNo;

  site_handover_date?: string | null;

  has_commencement_date: YesNo;

  commencement_date?: string | null;

  project_duration: number;

  duration_type: DurationType;

  no_of_holidays?: number | null;

  payment_term: PaymentTerm;

  has_advance_payment: YesNo;

  advance_percent?: number | null;

  has_advance_repayment: YesNo;

  advance_repayment_complete_percent?:
    number | null;

  advance_repayment_percent?:
    number | null;

  advance_repayment_start?:
    string | null;

  interim_payment_schedule: number;

  advance_payment_due_date: string;

  has_advance_bond: YesNo;

  advance_bond_percent?:
    number | null;

  advance_bond_type?:
    string | null;

  advance_bond_start_date?:
    string | null;

  advance_bond_end_date?:
    string | null;

  has_performance_bond: YesNo;

  performance_bond_percent?:
    number | null;

  performance_bond_type?:
    string | null;

  performance_bond_start_date?:
    string | null;

  performance_bond_end_date?:
    string | null;

  has_price_adjustment: YesNo;

  price_adjustment_percent?:
    number | null;

  has_retention: YesNo;

  retention_percent?:
    number | null;

  has_price_index: YesNo;

  has_liquidity_damage: YesNo;

  liquidity_percent?:
    number | null;

  liquidity_limit?:
    number | null;

  minimum_payment_time: number;

  engineering_facilities: string[];

  status: ProjectStatus;
}


export interface ProjectStatistics {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
  bid_projects: number;
  work_order_projects: number;
}


export interface ProjectPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}


export interface ProjectListResponse {
  data: Project[];

  pagination:
    ProjectPagination;
}


export interface BidOption {
  value: string;
  label: string;
  id: number;
  client: string;
  place_of_project?: string | null;
  project_type?: string | null;
  win_amount?: string | number | null;
}


export interface WorkOrderOption {
  value: string;
  label: string;
  work_order_no: string;
  project?: string | null;
  customer?: string | null;
  work_location?: string | null;
  type_of_work?: string | null;
  date_of_request?: string | null;
}


export interface CustomerOption {
  value: number;
  label: string;
  id: number;
  customer_no: string;
  name: string;
  type?: string | null;
  phone_number?: string | null;
  tin_number?: string | null;
  location?: string | null;
}


export const projectsApi = {

  async list(params?: {
    search?: string;

    status?: ProjectStatus;

    project_source?:
      ProjectSource;

    construction_project_type?:
      ConstructionProjectType;

    sort_by?: string;

    sort_direction?:
      'asc'
      | 'desc';

    sort_order?:
      'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<ProjectListResponse> {

    const response =
      await api.get(
        '/admin/projects',
        {
          params,
        }
      );


    const pagination =
      response.data?.pagination ??
      response.data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
      };


    return {
      data:
        response.data?.data ??
        [],

      pagination,
    };
  },


  async get(
    id: number
  ): Promise<Project> {

    const response =
      await api.get(
        `/admin/projects/${id}`
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  async create(
    data: ProjectPayload
  ): Promise<Project> {

    const response =
      await api.post(
        '/admin/projects',
        data
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  async update(
    id: number,
    data: ProjectPayload
  ): Promise<Project> {

    const response =
      await api.put(
        `/admin/projects/${id}`,
        data
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  async changeStatus(
    id: number,
    status: ProjectStatus
  ): Promise<Project> {

    const response =
      await api.patch(
        `/admin/projects/${id}/status`,
        {
          status,
        }
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/projects/${id}`
    );
  },


  async deleted(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<ProjectListResponse> {

    const response =
      await api.get(
        '/admin/projects/deleted',
        {
          params,
        }
      );

    const pagination =
      response.data?.pagination ??
      response.data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
      };

    return {
      data:
        response.data?.data ??
        [],
      pagination,
    };
  },


  async restore(
    id: number
  ): Promise<Project> {

    const response =
      await api.patch(
        `/admin/projects/${id}/restore`
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  async forceDelete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/projects/${id}/force-delete`
    );
  },


  async statistics():
    Promise<ProjectStatistics> {

    const response =
      await api.get(
        '/admin/projects/statistics'
      );

    return (
      response.data?.data ?? {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
        bid_projects: 0,
        work_order_projects: 0,
      }
    );
  },


  async nextNumber():
    Promise<string> {

    const response =
      await api.get(
        '/admin/projects/next-number'
      );

    return (
      response.data?.data
        ?.project_no ??
      ''
    );
  },


  async bidOptions(
    search?: string
  ): Promise<BidOption[]> {

    const response =
      await api.get(
        '/admin/projects/bid-options',
        {
          params: {
            search:
              search ||
              undefined,
          },
        }
      );

    return (
      response.data?.data ??
      []
    );
  },


  async workOrderOptions(
    search?: string
  ): Promise<WorkOrderOption[]> {

    const response =
      await api.get(
        '/admin/projects/work-order-options',
        {
          params: {
            search:
              search ||
              undefined,
          },
        }
      );

    return (
      response.data?.data ??
      []
    );
  },


  async customerOptions(
    search?: string
  ): Promise<CustomerOption[]> {

    const response =
      await api.get(
        '/admin/projects/customer-options',
        {
          params: {
            search:
              search ||
              undefined,
          },
        }
      );

    return (
      response.data?.data ??
      []
    );
  },

};