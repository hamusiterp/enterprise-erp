import api from './api';


export type ItemStatus =
  | 'active'
  | 'inactive';


export interface Item {
  id: number;

  item_no: string;

  item_description: string;

  category?: string | null;

  unit?: string | null;

  status: ItemStatus;

  product_date?: string | null;

  type?: string | null;

  inventory?: string | null;

  registered_by?: string | null;

  registered_by_user_id?: number | null;

  date_registered?: string | null;

  created_at?: string | null;

  updated_at?: string | null;

  deleted_at?: string | null;
}


export interface ItemPayload {
  item_description: string;

  category?: string | null;

  unit?: string | null;

  status: ItemStatus;

  product_date?: string | null;

  type?: string | null;

  inventory?: string | null;
}


export interface ItemStatistics {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}


export interface ItemOptions {
  categories: string[];
  units: string[];
  types: string[];
  inventories: string[];
}


export interface ItemPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  from?: number | null;
  to?: number | null;
}


export interface ItemListResponse {
  data: Item[];

  pagination:
    ItemPagination;
}


export const itemsApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {
    search?: string;

    status?: ItemStatus;

    category?: string;

    unit?: string;

    type?: string;

    inventory?: string;

    sort_by?:
      | 'id'
      | 'item_no'
      | 'item_description'
      | 'category'
      | 'unit'
      | 'status'
      | 'product_date'
      | 'type'
      | 'inventory'
      | 'registered_by'
      | 'date_registered'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at';

    sort_order?:
      | 'asc'
      | 'desc';

    sort_direction?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<ItemListResponse> {

    const response =
      await api.get(
        '/admin/items',
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
  ): Promise<Item> {

    const response =
      await api.get(
        `/admin/items/${id}`
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
    data: ItemPayload
  ): Promise<Item> {

    const response =
      await api.post(
        '/admin/items',
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
    data: ItemPayload
  ): Promise<Item> {

    const response =
      await api.put(
        `/admin/items/${id}`,
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
    status: ItemStatus
  ): Promise<Item> {

    const response =
      await api.patch(
        `/admin/items/${id}/status`,
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
      `/admin/items/${id}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Deleted Items
  |--------------------------------------------------------------------------
  */

  async deleted(
    params?: {
      search?: string;
      page?: number;
      per_page?: number;
    }
  ): Promise<ItemListResponse> {

    const response =
      await api.get(
        '/admin/items/deleted',
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
  ): Promise<Item> {

    const response =
      await api.patch(
        `/admin/items/${id}/restore`
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
      `/admin/items/${id}/force-delete`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<ItemStatistics> {

    const response =
      await api.get(
        '/admin/items/statistics'
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

  async options():
    Promise<ItemOptions> {

    const response =
      await api.get(
        '/admin/items/options'
      );


    return (
      response.data?.data ?? {
        categories: [],
        units: [],
        types: [],
        inventories: [],
      }
    );
  },

};