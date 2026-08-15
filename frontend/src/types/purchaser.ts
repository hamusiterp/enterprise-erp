import type {
  ListFilters,
  RecordStatus,
} from './api';

export interface Purchaser {

  id: number;

  purchaser_no: string;

  purchaser_name: string;

  status: RecordStatus;

  registered_by: string | null;

  date_registered: string | null;

  created_at: string;

  updated_at: string;

  accounts_count: number;

  active_accounts_count: number;

}

export interface PurchaserFormValues {

  purchaser_no: string;

  purchaser_name: string;

  status: RecordStatus;

}

export interface PurchaserFilters
  extends ListFilters {

  status?: RecordStatus;

}

export interface PurchaserAccount {
  id: number;

  purchaser_id: number;

  bank_id: number;

  bank?: {
    id: number;
    name: string;
    bank_id?: string | null;
    branch?: string | null;
    account_no?: string | null;
  } | null;

  bank_name?: string | null;

  account_number: string;

  account_name: string | null;

  currency: string | null;

  is_primary: boolean;

  status: RecordStatus;

  registered_by?: string | null;

  date_registered?: string | null;
}

export interface PurchaserAccountFormValues {

  bank_id: number;

  account_number: string;

  account_name: string;

  currency: string;

  is_primary: boolean;

  status: RecordStatus;

}