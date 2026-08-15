import type {
  ListFilters,
  RecordStatus,
} from './api';

export type SubcontractorType =
  | 'company'
  | 'individual';

export type SubcontractorTaxPercent =
  | 0
  | 2
  | 10
  | 15;

export interface SubcontractorCategory {
  id: number;
  name: string;
}

export interface Subcontractor {
  id: number;

  type: SubcontractorType;

  firstname?: string | null;

  lastname?: string | null;

  company_name?: string | null;

  display_name: string;

  tin_no?: string | null;

  address: string;

  contact_person: string;

  phone_number: string;

  tax_percent: number;

  category_id: number;

  category?: SubcontractorCategory | null;

  status: RecordStatus;

  registered_by?: string | null;

  registered_by_user_id?: number | null;

  date_registered?: string | null;

  created_at?: string | null;

  updated_at?: string | null;

  deleted_at?: string | null;
}

export interface SubcontractorFormValues {
  type: SubcontractorType;

  firstname?: string | null;

  lastname?: string | null;

  company_name?: string | null;

  tin_no?: string | null;

  address: string;

  contact_person: string;

  phone_number: string;

  tax_percent: SubcontractorTaxPercent;

  category_id: number;

  status: RecordStatus;
}

export interface SubcontractorFilters
  extends ListFilters {

  type?: SubcontractorType;

  category_id?: number;

  tax_percent?: SubcontractorTaxPercent;

  status?: RecordStatus;
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