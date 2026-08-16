import api from './api';


export type SubcontractorType =
  | 'company'
  | 'individual';


export type SubcontractorStatus =
  | 'active'
  | 'inactive';


export type SubcontractorTaxPercent =
  | 0
  | 2
  | 10
  | 15;


export interface SubcontractorCategory {
  id: number;
  name: string;
  type?: string | null;
  status?: string | null;
}


export interface Subcontractor {

  id: number;

  type:
    SubcontractorType;

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

  tin_no?:
    | string
    | null;

  address: string;

  contact_person: string;

  phone_number: string;

  tax_percent:
    number;

  category_id:
    number;

  category?:
    | SubcontractorCategory
    | null;

  status:
    SubcontractorStatus;

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


export interface SubcontractorPayload {

  type:
    SubcontractorType;

  firstname?:
    | string
    | null;

  lastname?:
    | string
    | null;

  company_name?:
    | string
    | null;

  tin_no?:
    | string
    | null;

  address: string;

  contact_person: string;

  phone_number: string;

  tax_percent:
    SubcontractorTaxPercent;

  category_id:
    number;

  status:
    SubcontractorStatus;
}


export interface SubcontractorStatistics {

  total: number;

  active: number;

  inactive: number;

  companies: number;

  individuals: number;

  tax_0: number;

  tax_2: number;

  tax_10: number;

  tax_15: number;

  deleted: number;
}


export interface SubcontractorPagination {

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


export interface SubcontractorListResponse {

  data:
    Subcontractor[];

  pagination:
    SubcontractorPagination;
}


export const subcontractorsApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {

    search?: string;

    type?:
      SubcontractorType;

    category_id?:
      number;

    tax_percent?:
      SubcontractorTaxPercent;

    status?:
      SubcontractorStatus;

    sort_by?: string;

    sort_direction?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<SubcontractorListResponse> {

    const response =
      await api.get(
        '/admin/sales/subcontractors',
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
  ): Promise<Subcontractor> {

    const response =
      await api.get(
        `/admin/sales/subcontractors/${id}`
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
    data:
      SubcontractorPayload
  ): Promise<Subcontractor> {

    const response =
      await api.post(
        '/admin/sales/subcontractors',
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
    data:
      SubcontractorPayload
  ): Promise<Subcontractor> {

    const response =
      await api.put(
        `/admin/sales/subcontractors/${id}`,
        data
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
      `/admin/sales/subcontractors/${id}`
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

  }): Promise<SubcontractorListResponse> {

    const response =
      await api.get(
        '/admin/sales/subcontractors/deleted',
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
  |
  | Your backend route uses POST.
  |
  */

  async restore(
    id: number
  ): Promise<Subcontractor> {

    const response =
      await api.post(
        `/admin/sales/subcontractors/${id}/restore`
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<SubcontractorStatistics> {

    const response =
      await api.get(
        '/admin/sales/subcontractors/statistics'
      );


    return (
      response.data?.data ?? {

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

      }
    );

  },

};