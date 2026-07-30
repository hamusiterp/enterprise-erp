export type DecimalValue =
  | string
  | number
  | null;

export interface Bank {
  id: number;

  bank_id: string | null;
  bank_name: string | null;
  bank_name_orginal: string;

  account_no: string | null;
  branch: string | null;
  contact_address: string | null;

  begnning_amount: string | null;
  begnning__amount_left: string | null;

  od_available: string | null;
  start_date: string | null;
  end_date: string | null;
  od_amount: string | null;
  od_amount_left: string | null;
  min_amount: string;
  od_limit: string;
  od_status: string | null;

  term_loan: string | null;
  term_loan_start_date: string | null;
  term_loan_end_date: string | null;
  term_loan_amount: string | null;

  transfer_rate: string;
  repayment_amount: string | null;
  repayment_amount_left: string;

  term_loan_relief: string;
  term_loan_relief_start_date: string;
  term_loan_relief_end_date: string;

  period: string | null;
  ethiopian_date: string | null;
  date_registered: string | null;

  cob_balance: string;
  status: string;
  last_activity: string;
  suggestion: string;
  end_balance: string;
  loan_status: string;
  credit_suggestion: string;
  category: string;
  start_month: string;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface BankFormValues {
  bank_id?: string | null;
  bank_name?: string | null;
  bank_name_orginal: string;

  account_no?: string | null;
  branch?: string | null;
  contact_address?: string | null;

  begnning_amount?: DecimalValue;
  begnning__amount_left?: DecimalValue;

  od_available?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  od_amount?: DecimalValue;
  od_amount_left?: DecimalValue;
  min_amount: DecimalValue;
  od_limit: string;
  od_status?: string | null;

  term_loan?: string | null;
  term_loan_start_date?: string | null;
  term_loan_end_date?: string | null;
  term_loan_amount?: DecimalValue;

  transfer_rate: DecimalValue;
  repayment_amount?: DecimalValue;
  repayment_amount_left: string;

  term_loan_relief: string;
  term_loan_relief_start_date: string;
  term_loan_relief_end_date: string;

  period?: string | null;
  ethiopian_date?: string | null;
  date_registered?: string | null;

  cob_balance: string;
  status: string;
  last_activity: string;
  suggestion: string;
  end_balance: string;
  loan_status: string;
  credit_suggestion: string;
  category: string;
  start_month: string;
}

export interface BankFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';

  status?: string;
  od_status?: string;
  loan_status?: string;
}