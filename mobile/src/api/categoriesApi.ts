import api from './api';


export type CategoryStatus =
  | 'active'
  | 'inactive';


export interface Category {
  id: number;

  category: string;

  type: string;

  status: CategoryStatus;

  created_at?: string | null;

  updated_at?: string | null;

  deleted_at?: string | null;
}


export interface CategoryPayload {
  category: string;

  type: string;

  status: CategoryStatus;
}


export interface CategoryStatistics {
  total: number;

  active: number;

  inactive: number;

  deleted: number;
}


export interface CategoryPagination {
  current_page: number;

  last_page: number;

  per_page: number;

  total: number;

  from?: number | null;

  to?: number | null;
}


export interface CategoryListResponse {
  data: Category[];

  pagination:
    CategoryPagination;
}


export interface CategoryOption {
  value: number;

  label: string;

  id: number;

  category: string;

  name: string;

  type: string;
}


export const categoriesApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {
    search?: string;

    status?: CategoryStatus;

    type?: string;

    sort_by?: string;

    sort_direction?:
      | 'asc'
      | 'desc';

    sort_order?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<CategoryListResponse> {

    const response =
      await api.get(
        '/admin/categories',
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


  /*
  |--------------------------------------------------------------------------
  | Details
  |--------------------------------------------------------------------------
  */

  async get(
    id: number
  ): Promise<Category> {

    const response =
      await api.get(
        `/admin/categories/${id}`
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
    data: CategoryPayload
  ): Promise<Category> {

    const response =
      await api.post(
        '/admin/categories',
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
    data: CategoryPayload
  ): Promise<Category> {

    const response =
      await api.put(
        `/admin/categories/${id}`,
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
    status: CategoryStatus
  ): Promise<Category> {

    const response =
      await api.patch(
        `/admin/categories/${id}/status`,
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
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/categories/${id}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Deleted
  |--------------------------------------------------------------------------
  */

  async deleted(params?: {
    search?: string;

    page?: number;

    per_page?: number;

  }): Promise<CategoryListResponse> {

    const response =
      await api.get(
        '/admin/categories/deleted',
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


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(
    id: number
  ): Promise<Category> {

    const response =
      await api.patch(
        `/admin/categories/${id}/restore`
      );

    return (
      response.data?.data ??
      response.data
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Permanent Delete
  |--------------------------------------------------------------------------
  */

  async forceDelete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/categories/${id}/force-delete`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<CategoryStatistics> {

    const response =
      await api.get(
        '/admin/categories/statistics'
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


  /*
  |--------------------------------------------------------------------------
  | Options
  |--------------------------------------------------------------------------
  */

  async options(params?: {
    type?: string;

    search?: string;

  }): Promise<CategoryOption[]> {

    const response =
      await api.get(
        '/admin/categories/options',
        {
          params,
        }
      );

    return (
      response.data?.data ??
      []
    );
  },

};