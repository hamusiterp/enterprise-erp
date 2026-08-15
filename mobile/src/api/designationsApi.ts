import api from './api';


export interface DesignationDepartment {
  id: number;
  department_id?: string;
  department_name: string;
}


export interface Designation {
  id: number;

  code: string;
  name: string;

  department_id?: number | null;
  department?: DesignationDepartment | null;

  level?: number | null;

  status: 'active' | 'inactive';

  description?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}


export interface DesignationPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
}


export interface DesignationListResponse {
  data: Designation[];
  pagination: DesignationPagination;
}


export interface DesignationPayload {
  name: string;

  department_id?: number | null;

  level?: number | null;

  status: 'active' | 'inactive';

  description?: string | null;
}


export const designationsApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {
    search?: string;

    status?:
      | 'active'
      | 'inactive';

    department_id?: number;

    level?: number;

    page?: number;

    per_page?: number;

    sort_by?:
      | 'code'
      | 'name'
      | 'level'
      | 'status'
      | 'created_at'
      | 'updated_at';

    sort_order?:
      | 'asc'
      | 'desc';

  }): Promise<DesignationListResponse> {

    const response =
      await api.get(
        '/admin/designations',
        {
          params,
        }
      );


    return {
      data:
        response.data?.data ??
        [],

      pagination:
        response.data?.pagination ?? {
          current_page: 1,
          per_page: 10,
          total: 0,
          last_page: 1,
          from: null,
          to: null,
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
  ): Promise<Designation> {

    const response =
      await api.get(
        `/admin/designations/${id}`
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
    data: DesignationPayload
  ): Promise<Designation> {

    const response =
      await api.post(
        '/admin/designations',
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
    data: DesignationPayload
  ): Promise<Designation> {

    const response =
      await api.put(
        `/admin/designations/${id}`,
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
  ): Promise<Designation> {

    const response =
      await api.patch(
        `/admin/designations/${id}/status`,
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
      `/admin/designations/${id}`
    );
  },

};