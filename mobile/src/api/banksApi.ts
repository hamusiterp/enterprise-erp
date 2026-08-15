import api from './api';


export type YesNo =
  | 'Yes'
  | 'No';

export type BankStatus =
  | 'active'
  | 'inactive';


export interface Bank {
  id: number;

  bank_id: string;
  bank_name: string;
  bank_name_orginal?: string | null;

  account_no: string;
  branch: string;
  contact_address?: string | null;

  begnning_amount: number | string;
  begnning__amount_left: number | string;

  min_amount: number | string;
  transfer_rate: number | string;

  /*
  |--------------------------------------------------------------------------
  | Overdraft
  |--------------------------------------------------------------------------
  */

  od_available: YesNo;

  od_amount?: number | string | null;
  od_amount_left?: number | string | null;

  od_limit?: string | null;
  od_status?: string | null;

  start_date?: string | null;
  end_date?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Term Loan
  |--------------------------------------------------------------------------
  */

  term_loan: YesNo;

  term_loan_amount?: number | string | null;

  loan_status?: string | null;

  term_loan_start_date?: string | null;
  term_loan_end_date?: string | null;

  repayment_amount?: number | string | null;
  repayment_amount_left?: string | null;

  period?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Term Loan Relief
  |--------------------------------------------------------------------------
  */

  term_loan_relief: YesNo;

  term_loan_relief_start_date?: string | null;
  term_loan_relief_end_date?: string | null;

  /*
  |--------------------------------------------------------------------------
  | Other
  |--------------------------------------------------------------------------
  */

  ethiopian_date?: string | null;
  date_registered?: string | null;

  cob_balance?: string | null;

  status: BankStatus;

  last_activity?: string | null;
  suggestion?: string | null;

  end_balance?: string | null;
  credit_suggestion?: string | null;

  category?: string | null;
  start_month?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}


export interface BankPayload {
  /*
  |--------------------------------------------------------------------------
  | Basic
  |--------------------------------------------------------------------------
  */

  bank_name: string;

  bank_name_orginal?: string | null;

  account_no: string;

  branch: string;

  contact_address?: string | null;


  /*
  |--------------------------------------------------------------------------
  | Financial
  |--------------------------------------------------------------------------
  */

  begnning_amount: number;

  /*
   * IMPORTANT:
   * This is intentionally spelled with TWO underscores.
   * It matches your existing Laravel validation/database field.
   */
  begnning__amount_left: number;

  min_amount: number;

  transfer_rate: number;


  /*
  |--------------------------------------------------------------------------
  | Overdraft
  |--------------------------------------------------------------------------
  */

  od_available: YesNo;

  od_amount?: number | null;

  od_amount_left?: number | null;

  od_limit?: string | null;

  od_status?: string | null;

  start_date?: string | null;

  end_date?: string | null;


  /*
  |--------------------------------------------------------------------------
  | Term Loan
  |--------------------------------------------------------------------------
  */

  term_loan: YesNo;

  term_loan_amount?: number | null;

  loan_status?: string | null;

  term_loan_start_date?: string | null;

  term_loan_end_date?: string | null;

  repayment_amount?: number | null;

  repayment_amount_left?: string | null;

  period?: string | null;


  /*
  |--------------------------------------------------------------------------
  | Term Loan Relief
  |--------------------------------------------------------------------------
  */

  term_loan_relief: YesNo;

  term_loan_relief_start_date?: string | null;

  term_loan_relief_end_date?: string | null;


  /*
  |--------------------------------------------------------------------------
  | Other
  |--------------------------------------------------------------------------
  */

  ethiopian_date?: string | null;

  date_registered?: string | null;

  cob_balance?: string | null;

  status: BankStatus;

  last_activity?: string | null;

  suggestion?: string | null;

  end_balance?: string | null;

  credit_suggestion?: string | null;

  category?: string | null;

  start_month?: string | null;
}


export interface BankPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  from?: number | null;
  to?: number | null;
}


export interface BankListResponse {
  data: Bank[];

  pagination:
    BankPagination;
}


export const banksApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {
    search?: string;

    status?: BankStatus;

    od_status?: string;

    loan_status?: string;

    sort_by?: string;

    sort_direction?:
      | 'asc'
      | 'desc';

    per_page?: number;

    page?: number;

  }): Promise<BankListResponse> {

    const response =
      await api.get(
        '/admin/banks',
        {
          params,
        }
      );


    return {
      data:
        response.data?.data ??
        [],

      pagination:
        response.data
          ?.pagination ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
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
  ): Promise<Bank> {

    const response =
      await api.get(
        `/admin/banks/${id}`
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
    data: BankPayload
  ): Promise<Bank> {

    const response =
      await api.post(
        '/admin/banks',
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
    data: BankPayload
  ): Promise<Bank> {

    const response =
      await api.put(
        `/admin/banks/${id}`,
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
    status: BankStatus
  ): Promise<Bank> {

    const response =
      await api.patch(
        `/admin/banks/${id}/status`,
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
      `/admin/banks/${id}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Deleted Banks
  |--------------------------------------------------------------------------
  */

  async deleted(
    params?: {
      page?: number;
      per_page?: number;
    }
  ): Promise<BankListResponse> {

    const response =
      await api.get(
        '/admin/banks/deleted',
        {
          params,
        }
      );


    return {
      data:
        response.data?.data ??
        [],

      pagination:
        response.data
          ?.pagination ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
          from: null,
          to: null,
        },
    };
  },


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(
  id: number
): Promise<Bank> {

  const response =
    await api.post(
      `/admin/banks/${id}/restore`
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
      `/admin/banks/${id}/force-delete`
    );
  },

};