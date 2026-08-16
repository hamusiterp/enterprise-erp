import api from './api';


export type CustomerType =
  | 'individual'
  | 'company';


export type CustomerStatus =
  | 'active'
  | 'inactive';


export interface Customer {

  id: number;

  customer_no: string;

  customer_type:
    CustomerType;

  firstname?:
    | string
    | null;

  lastname?:
    | string
    | null;

  company_name?:
    | string
    | null;

  display_name: string;

  email_address?:
    | string
    | null;

  contact_person?:
    | string
    | null;

  phone_number: string;

  location: string;

  tin_number?:
    | string
    | null;

  withhold:
    | boolean
    | number
    | string;

  withhold_percent?:
    | number
    | string
    | null;

  withhold_from_advance:
    | boolean
    | number
    | string;

  customer_status:
    CustomerStatus;

  registered_by?:
    | string
    | null;

  registered_by_user_id?:
    | number
    | null;

  date_registered?:
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


export interface CustomerPayload {

  customer_type:
    CustomerType;

  firstname?:
    | string
    | null;

  lastname?:
    | string
    | null;

  company_name?:
    | string
    | null;

  email_address?:
    | string
    | null;

  tin_number?:
    | string
    | null;

  contact_person?:
    | string
    | null;

  phone_number: string;

  location: string;

  customer_status:
    CustomerStatus;

  withhold: boolean;

  withhold_percent?:
    | number
    | null;

  withhold_from_advance:
    boolean;
}


export interface CustomerStatistics {

  total: number;

  active: number;

  inactive: number;

  individuals: number;

  companies: number;

  with_withhold: number;

  without_withhold: number;

  deleted: number;
}


export interface CustomerPagination {

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


export interface CustomerListResponse {

  data: Customer[];

  pagination:
    CustomerPagination;
}


export interface CustomerOption {

  value: number;

  label: string;

  id: number;

  customer_no: string;

  name: string;

  customer_type:
    CustomerType;

  phone_number: string;

  tin_number?:
    | string
    | null;

  location: string;
}


export const customersApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {

    search?: string;

    customer_type?:
      CustomerType;

    customer_status?:
      CustomerStatus;

    withhold?: boolean;

    withhold_from_advance?:
      boolean;

    sort_by?: string;

    sort_direction?:
      | 'asc'
      | 'desc';

    sort_order?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<CustomerListResponse> {

    const response =
      await api.get(
        '/admin/customers',
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
  ): Promise<Customer> {

    const response =
      await api.get(
        `/admin/customers/${id}`
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
    data: CustomerPayload
  ): Promise<Customer> {

    const response =
      await api.post(
        '/admin/customers',
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
    data: CustomerPayload
  ): Promise<Customer> {

    const response =
      await api.put(
        `/admin/customers/${id}`,
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
    customer_status:
      CustomerStatus
  ): Promise<Customer> {

    const response =
      await api.patch(
        `/admin/customers/${id}/status`,
        {
          customer_status,
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
      `/admin/customers/${id}`
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

  }): Promise<CustomerListResponse> {

    const response =
      await api.get(
        '/admin/customers/deleted',
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
  ): Promise<Customer> {

    const response =
      await api.patch(
        `/admin/customers/${id}/restore`
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
      `/admin/customers/${id}/force-delete`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<CustomerStatistics> {

    const response =
      await api.get(
        '/admin/customers/statistics'
      );

    return (
      response.data?.data ?? {
        total: 0,
        active: 0,
        inactive: 0,
        individuals: 0,
        companies: 0,
        with_withhold: 0,
        without_withhold: 0,
        deleted: 0,
      }
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Next Number
  |--------------------------------------------------------------------------
  */

  async nextNumber():
    Promise<string> {

    const response =
      await api.get(
        '/admin/customers/next-number'
      );

    return (
      response.data?.data
        ?.customer_no ??
      ''
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Options
  |--------------------------------------------------------------------------
  */

  async options(params?: {

    search?: string;

    customer_type?:
      CustomerType;

  }): Promise<CustomerOption[]> {

    const response =
      await api.get(
        '/admin/customers/options',
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