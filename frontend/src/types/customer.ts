export type CustomerType =
  | 'individual'
  | 'company';

export type CustomerStatus =
  | 'active'
  | 'inactive';

export interface Customer {
  id: number;

  customer_no: string;
  customer_type: CustomerType;

  firstname: string | null;
  lastname: string | null;
  company_name: string | null;

  display_name: string;

  email_address: string | null;
  tin_number: string | null;
  contact_person: string | null;
  phone_number: string;
  location: string;

  customer_status: CustomerStatus;

  withhold: boolean;
  withhold_percent: string | null;

  withhold_from_advance: boolean;

  registered_by: string | null;
  registered_by_user_id: number | null;
  date_registered: string | null;

  created_at: string | null;
  updated_at: string | null;
  deleted_at?: string | null;
}

export interface CustomerFormValues {
  customer_no?: string;

  customer_type: CustomerType;

  firstname?: string | null;
  lastname?: string | null;
  company_name?: string | null;

  email_address?: string | null;
  tin_number?: string | null;
  contact_person?: string | null;
  phone_number: string;
  location: string;

  customer_status: CustomerStatus;

  withhold: boolean;

  withhold_percent?:
    string | number | null;

  withhold_from_advance: boolean;
}

export interface CustomerFilters {
  page?: number;
  per_page?: number;

  search?: string;

  customer_type?: CustomerType;
  customer_status?: CustomerStatus;

  withhold?: boolean;
  withhold_from_advance?: boolean;

  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
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

export interface CustomerOption {
  value: number;
  label: string;

  id: number;
  customer_no: string;
  name: string;
  customer_type: CustomerType;

  phone_number: string | null;
  tin_number: string | null;
  location: string | null;
}