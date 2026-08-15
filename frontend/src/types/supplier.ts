export type SupplierStatus =
  | 'active'
  | 'inactive';

export interface SupplierCategory {
  id: number;
  name: string;
  type: string;
}

export interface Supplier {
  id: number;

  supplier_no: string;
  supplier_name: string;

  category_id: number;
  category: SupplierCategory | null;

  address: string | null;
  phone_number: string;

  has_tin: boolean;
  tin: string | null;

  registered_by: string | null;
  date_registered: string | null;

  approved_by: string | null;

  status: SupplierStatus;

  created_at: string | null;
  updated_at: string | null;
  deleted_at?: string | null;
}

export interface SupplierFormData {
  supplier_no?: string;

  supplier_name: string;

  category_id: number;

  address?: string | null;
  phone_number: string;

  has_tin: boolean;
  tin?: string | null;

  status: SupplierStatus;
}

export interface SupplierFilters {
  page?: number;
  per_page?: number;

  search?: string;

  status?: SupplierStatus;
  category_id?: number;
  has_tin?: boolean;

  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface SupplierStatistics {
  total: number;
  active: number;
  inactive: number;
  with_tin: number;
  without_tin: number;
  deleted: number;
}