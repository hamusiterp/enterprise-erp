import api from './api';


export type SupplierStatus =
  | 'active'
  | 'inactive';


export interface SupplierCategory {
  id: number;

  name: string;

  type?: string | null;
}


export interface Supplier {
  id: number;

  supplier_no: string;

  supplier_name: string;

  category_id: number;

  category_name?: string | null;

  category?:
    | SupplierCategory
    | null;

  address?:
    | string
    | null;

  phone_number: string;

  has_tin:
    | boolean
    | number
    | string;

  tin?:
    | string
    | null;

  status: SupplierStatus;

  registered_by?:
    | string
    | null;

  registered_by_user_id?:
    | number
    | null;

  date_registered?:
    | string
    | null;

  approved_by?:
    | string
    | null;

  created_at?:
    | string
    | null;

  updated_at?:
    | string
    | null;

  deleted_at?:
    | string
    | null;
}


export interface SupplierPayload {

  supplier_name: string;

  category_id: number;

  address?:
    | string
    | null;

  phone_number: string;

  has_tin: boolean;

  tin?:
    | string
    | null;

  status: SupplierStatus;
}


export interface SupplierStatistics {

  total: number;

  active: number;

  inactive: number;

  with_tin: number;

  without_tin: number;

  deleted: number;
}


export interface SupplierPagination {

  current_page: number;

  last_page: number;

  per_page: number;

  total: number;

  from?:
    | number
    | null;

  to?:
    | number
    | null;
}


export interface SupplierListResponse {

  data: Supplier[];

  pagination:
    SupplierPagination;
}


export const suppliersApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {

    search?: string;

    status?:
      SupplierStatus;

    category_id?: number;

    has_tin?: boolean;

    sort_by?: string;

    sort_direction?:
      | 'asc'
      | 'desc';

    sort_order?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<SupplierListResponse> {

    const response =
      await api.get(
        '/admin/suppliers',
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
  | Show
  |--------------------------------------------------------------------------
  */

  async get(
    id: number
  ): Promise<Supplier> {

    const response =
      await api.get(
        `/admin/suppliers/${id}`
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
    data: SupplierPayload
  ): Promise<Supplier> {

    const response =
      await api.post(
        '/admin/suppliers',
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
    data: SupplierPayload
  ): Promise<Supplier> {

    const response =
      await api.put(
        `/admin/suppliers/${id}`,
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
    status: SupplierStatus
  ): Promise<Supplier> {

    const response =
      await api.patch(
        `/admin/suppliers/${id}/status`,
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
      `/admin/suppliers/${id}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Deleted Suppliers
  |--------------------------------------------------------------------------
  */

  async deleted(params?: {

    search?: string;

    page?: number;

    per_page?: number;

  }): Promise<SupplierListResponse> {

    const response =
      await api.get(
        '/admin/suppliers/deleted',
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
  ): Promise<Supplier> {

    const response =
      await api.patch(
        `/admin/suppliers/${id}/restore`
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
      `/admin/suppliers/${id}/force-delete`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<SupplierStatistics> {

    const response =
      await api.get(
        '/admin/suppliers/statistics'
      );


    return (
      response.data?.data ?? {

        total: 0,

        active: 0,

        inactive: 0,

        with_tin: 0,

        without_tin: 0,

        deleted: 0,

      }
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Next Supplier Number
  |--------------------------------------------------------------------------
  */

  async nextNumber():
    Promise<string> {

    const response =
      await api.get(
        '/admin/suppliers/next-number'
      );


    return (
      response.data?.data
        ?.supplier_no ??
      ''
    );
  },

};