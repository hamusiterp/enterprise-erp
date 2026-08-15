export type ItemStatus =
  | 'active'
  | 'inactive';

export type InventoryType =
  | 'Stock'
  | 'Non-Stock';

export interface Item {
  id: number;

  item_no: string;
  item_description: string;
  category: string;
  unit: string;
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
  unit: string;
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
  unit?: string;
  type?: string;
  inventory?: InventoryType;

  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}