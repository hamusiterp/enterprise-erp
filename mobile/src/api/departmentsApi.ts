import api from './api';


export interface DepartmentUser {
  id: number;
  name: string;
  email?: string;
}


export interface Department {
  id: number;

  department_id: string;
  department_name: string;

  description?: string | null;

  status: 'active' | 'inactive';

  registered_by?: DepartmentUser | null;
  registeredBy?: DepartmentUser | null;

  created_at?: string | null;
  updated_at?: string | null;
}


export interface DepartmentMeta {
  current_page: number;
  from?: number | null;
  last_page: number;
  per_page: number;
  to?: number | null;
  total: number;
}


export interface DepartmentListResponse {
  data: Department[];
  meta: DepartmentMeta;
}


export interface DepartmentStatistics {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}


export interface DepartmentOption {
  id: number;
  department_id: string;
  department_name: string;
}


export interface DepartmentPayload {
  department_id: string;
  department_name: string;
  description?: string;
  status: 'active' | 'inactive';
}


export const departmentsApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    per_page?: number;
    sort_by?:
      | 'department_id'
      | 'department_name'
      | 'status'
      | 'created_at'
      | 'updated_at';
    sort_order?: 'asc' | 'desc';
  }): Promise<DepartmentListResponse> {

    const response =
      await api.get(
        '/admin/departments',
        {
          params,
        }
      );

    return {
      data:
        response.data?.data ?? [],

      meta:
        response.data?.meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        },
    };
  },


  /*
  |--------------------------------------------------------------------------
  | Details
  |--------------------------------------------------------------------------
  */

  async get(
    id: number
  ): Promise<Department> {

    const response =
      await api.get(
        `/admin/departments/${id}`
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(
    data: DepartmentPayload
  ): Promise<Department> {

    const response =
      await api.post(
        '/admin/departments',
        data
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(
    id: number,
    data: DepartmentPayload
  ): Promise<Department> {

    const response =
      await api.put(
        `/admin/departments/${id}`,
        data
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(
    id: number,
    status:
      | 'active'
      | 'inactive'
  ): Promise<Department> {

    const response =
      await api.patch(
        `/admin/departments/${id}/status`,
        {
          status,
        }
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/departments/${id}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Active Options
  |--------------------------------------------------------------------------
  */

  async options():
    Promise<DepartmentOption[]> {

    const response =
      await api.get(
        '/admin/departments/options'
      );

    return (
      response.data?.data ??
      []
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<DepartmentStatistics> {

    const response =
      await api.get(
        '/admin/departments/statistics'
      );

    return (
      response.data?.data ?? {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
      }
    );
  },

};