export type ItemStatus =
  | 'active'
  | 'inactive';

export type InventoryType =
  | 'Stock'
  | 'Non-Stock';

export interface ItemUom {
  id: number;
  code: string;
  name: string;
  symbol: string | null;
  decimal_places: number;
}

export interface Item {
  id: number;

  item_no: string;
  item_description: string;
  category: string;

  /*
   * Dynamic Unit of Measurement
   */
  uom_id: number | null;
  uom: ItemUom | null;

  /*
   * Legacy field.
   * Keep temporarily for existing old records.
   */
  unit?: string | null;

  status: ItemStatus;

  product_date: string | null;

  type: string;
  inventory: InventoryType;

  registered_by: string | null;
  registered_by_user_id: number | null;

  date_registered: string | null;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface ItemFormValues {
  item_no?: string;

  item_description: string;
  category: string;

  uom_id: number;

  status: ItemStatus;

  product_date?: string | null;

  type: string;
  inventory: InventoryType;
}

export interface ItemFilters {
  page?: number;
  per_page?: number;
  search?: string;

  status?: ItemStatus;
  category?: string;

  /*
   * Legacy filter support.
   */
  unit?: string;

  type?: string;
  inventory?: InventoryType;

  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}