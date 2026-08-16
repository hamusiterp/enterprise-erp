import api from './api';


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type PurchaserStatus =
  | 'active'
  | 'inactive';


export type PurchaserAccountStatus =
  | 'active'
  | 'inactive';


export type PurchaserCurrency =
  | 'ETB'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AED'
  | 'JPY'
  | 'CNY';


/*
|--------------------------------------------------------------------------
| Bank
|--------------------------------------------------------------------------
*/

export interface PurchaserBank {

  id: number;

  name: string;
}


/*
|--------------------------------------------------------------------------
| Purchaser Account
|--------------------------------------------------------------------------
*/

export interface PurchaserAccount {

  id: number;

  purchaser_id: number;

  bank_id: number;

  bank?:
    | PurchaserBank
    | null;

  account_number: string;

  account_name?:
    | string
    | null;

  currency?:
    | PurchaserCurrency
    | null;

  is_primary:
    | boolean
    | number
    | string;

  status:
    PurchaserAccountStatus;

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


/*
|--------------------------------------------------------------------------
| Purchaser
|--------------------------------------------------------------------------
*/

export interface Purchaser {

  id: number;

  purchaser_no: string;

  purchaser_name: string;

  status:
    PurchaserStatus;


  /*
  |--------------------------------------------------------------------------
  | Account Summary
  |--------------------------------------------------------------------------
  */

  accounts_count?:
    number;

  active_accounts_count?:
    number;

  primary_account?:
    | PurchaserAccount
    | null;

  accounts?:
    PurchaserAccount[];


  /*
  |--------------------------------------------------------------------------
  | Registration
  |--------------------------------------------------------------------------
  */

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


/*
|--------------------------------------------------------------------------
| Payload
|--------------------------------------------------------------------------
*/

export interface PurchaserPayload {

  purchaser_name: string;

  status:
    PurchaserStatus;
}


export interface PurchaserAccountPayload {

  bank_id: number;

  account_number: string;

  account_name?:
    | string
    | null;

  currency?:
    | PurchaserCurrency
    | null;

  is_primary: boolean;

  status:
    PurchaserAccountStatus;
}


/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export interface PurchaserStatistics {

  total: number;

  active: number;

  inactive: number;

  deleted: number;

  with_accounts: number;

  without_accounts: number;

  total_accounts: number;
}


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

export interface PurchaserPagination {

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


export interface PurchaserListResponse {

  data:
    Purchaser[];

  pagination:
    PurchaserPagination;
}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const purchasersApi = {

  /*
  |--------------------------------------------------------------------------
  | Purchaser List
  |--------------------------------------------------------------------------
  */

  async list(params?: {

    search?: string;

    status?:
      PurchaserStatus;

    date_from?:
      string;

    date_to?:
      string;

    sort_by?:
      | 'id'
      | 'purchaser_no'
      | 'purchaser_name'
      | 'status'
      | 'date_registered'
      | 'created_at';

    sort_direction?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<PurchaserListResponse> {

    const response =
      await api.get(
        '/admin/sales/purchasers',
        {
          params,
        }
      );


    const meta =
      response.data?.meta;


    return {

      data:
        response.data?.data ??
        [],

      pagination: {

        current_page:
          meta?.current_page ??
          1,

        last_page:
          meta?.last_page ??
          1,

        per_page:
          meta?.per_page ??
          10,

        total:
          meta?.total ??
          0,

        from:
          meta?.from ??
          null,

        to:
          meta?.to ??
          null,

      },

    };

  },


  /*
  |--------------------------------------------------------------------------
  | Show Purchaser
  |--------------------------------------------------------------------------
  */

  async get(
    id: number
  ): Promise<Purchaser> {

    const response =
      await api.get(
        `/admin/sales/purchasers/${id}`
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Create Purchaser
  |--------------------------------------------------------------------------
  */

  async create(
    data:
      PurchaserPayload
  ): Promise<Purchaser> {

    const response =
      await api.post(
        '/admin/sales/purchasers',
        data
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Update Purchaser
  |--------------------------------------------------------------------------
  */

  async update(
    id: number,
    data:
      PurchaserPayload
  ): Promise<Purchaser> {

    const response =
      await api.put(
        `/admin/sales/purchasers/${id}`,
        data
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Soft Delete Purchaser
  |--------------------------------------------------------------------------
  */

  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/sales/purchasers/${id}`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Restore Purchaser
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Your backend route uses POST, not PATCH.
  |
  */

  async restore(
    id: number
  ): Promise<void> {

    await api.post(
      `/admin/sales/purchasers/${id}/restore`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Permanent Delete Purchaser
  |--------------------------------------------------------------------------
  */

  async forceDelete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/sales/purchasers/${id}/force-delete`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<PurchaserStatistics> {

    const response =
      await api.get(
        '/admin/sales/purchasers/statistics'
      );


    /*
     * Controller returns direct JSON,
     * not a Resource object.
     */

    return {

      total:
        response.data?.total ??
        0,

      active:
        response.data?.active ??
        0,

      inactive:
        response.data?.inactive ??
        0,

      deleted:
        response.data?.deleted ??
        0,

      with_accounts:
        response.data
          ?.with_accounts ??
        0,

      without_accounts:
        response.data
          ?.without_accounts ??
        0,

      total_accounts:
        response.data
          ?.total_accounts ??
        0,

    };

  },


  /*
  |--------------------------------------------------------------------------
  | Next Purchaser Number
  |--------------------------------------------------------------------------
  */

  async nextNumber():
    Promise<string> {

    const response =
      await api.get(
        '/admin/sales/purchasers/next-number'
      );


    /*
     * Controller returns:
     *
     * {
     *   purchaser_no: "PUR000001"
     * }
     */

    return (
      response.data
        ?.purchaser_no ??
      ''
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Purchaser Accounts
  |--------------------------------------------------------------------------
  */

  async accounts(
    purchaserId: number
  ): Promise<PurchaserAccount[]> {

    const response =
      await api.get(
        `/admin/sales/purchasers/${purchaserId}/accounts`
      );


    return (
      response.data?.data ??
      []
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Create Account
  |--------------------------------------------------------------------------
  */

  async createAccount(
    purchaserId: number,
    data:
      PurchaserAccountPayload
  ): Promise<PurchaserAccount> {

    const response =
      await api.post(
        `/admin/sales/purchasers/${purchaserId}/accounts`,
        data
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Update Account
  |--------------------------------------------------------------------------
  */

  async updateAccount(
    purchaserId: number,
    accountId: number,
    data:
      PurchaserAccountPayload
  ): Promise<PurchaserAccount> {

    const response =
      await api.put(
        `/admin/sales/purchasers/${purchaserId}/accounts/${accountId}`,
        data
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Delete Account
  |--------------------------------------------------------------------------
  */

  async deleteAccount(
    purchaserId: number,
    accountId: number
  ): Promise<void> {

    await api.delete(
      `/admin/sales/purchasers/${purchaserId}/accounts/${accountId}`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Set Primary Account
  |--------------------------------------------------------------------------
  */

  async setPrimaryAccount(
    purchaserId: number,
    accountId: number
  ): Promise<void> {

    await api.patch(
      `/admin/sales/purchasers/${purchaserId}/accounts/${accountId}/primary`
    );

  },

  /*
|--------------------------------------------------------------------------
| Deleted Purchasers
|--------------------------------------------------------------------------
*/

async deleted(params?: {

  search?: string;

  page?: number;

  per_page?: number;

}): Promise<PurchaserListResponse> {

  const response =
    await api.get(
      '/admin/sales/purchasers/deleted',
      {
        params,
      }
    );


  const meta =
    response.data?.meta;


  return {

    data:
      response.data?.data ??
      [],

    pagination: {

      current_page:
        meta?.current_page ??
        1,

      last_page:
        meta?.last_page ??
        1,

      per_page:
        meta?.per_page ??
        10,

      total:
        meta?.total ??
        0,

      from:
        meta?.from ??
        null,

      to:
        meta?.to ??
        null,

    },

  };

},

};

