export type DecimalValue =
  | string
  | number
  | null;

export type ProjectSource =
  | 'Bid'
  | 'Work Order';

export type YesNo =
  | 'Yes'
  | 'No';

export type ProjectStatus =
  | 'active'
  | 'inactive';

export type ConstructionProjectType =
  | 'Private Project'
  | 'Federal Project';

  export type DurationType =
  | 'working_days'
  | 'calendar_days';

  export type PaymentTerm =
  | 'cash_on_delivery'
  | 'after_work_executed';

export type AdvanceRepaymentStart =
  | 'first_payment'
  | 'second_payment'
  | 'third_payment'
  | 'fourth_payment';

export type BondType =
  | 'cpo'
  | 'insurance_bank'
  | 'unconditional_bond'
  | 'conditional_bond'
  | 'bank_bond';

  export type EngineeringFacility =
  | 'vehicle'
  | 'telephone'
  | 'internet'
  | 'office'
  | 'allowance';

export interface BidProjectOption {
  value: string;
  label: string;

  id: number;
  client: string;
  place_of_project: string;
  project_type: string | null;
  win_amount: string | null;
}

export interface WorkOrderProjectOption {
  value: string;
  label: string;

  work_order_no: string;
  project: string;
  customer: string;
  work_location: string | null;
  type_of_work: string | null;
  date_of_request: string | null;
}

export interface CustomerOption {
  value: number;
  label: string;

  id: number;
  customer_no: string;
  name: string;
  type: string;
  phone_number: string | null;
  tin_number: string | null;
  location: string | null;
}

export interface Project {
  id: number;

  project_no: string;
  project_source: ProjectSource;

  bid_reference: string | null;
  work_order_no: string | null;

  project_name: string;
  project_name_letter: string | null;
  project_description: string;
  location: string;

  customer_id: number;
  employer: string;

  has_consultant: YesNo;
  consultant: string | null;

  has_specified_area: YesNo;
  area: string | null;

  construction_project_type:
    ConstructionProjectType;

    business_unit: string | null;
contract_type: string | null;

contract_amount_before_vat: string | null;

contract_pricing_type: string | null;

contract_date: string | null;

has_site_handover_date: YesNo;
site_handover_date: string | null;

has_commencement_date: YesNo;
commencement_date: string | null;

project_duration: number | null;
duration_type: DurationType | null;
no_of_holidays: number | null;

payment_term?: PaymentTerm | null;

has_advance_payment: YesNo;

advance_percent?:
    string | number | null;

has_advance_repayment: YesNo;

advance_repayment_complete_percent?:
    string | number | null;

advance_repayment_percent?:
    string | number | null;

advance_repayment_start?:
    AdvanceRepaymentStart | null;

interim_payment_schedule?:
    number | null;

advance_payment_due_date?:
    string | null;

has_advance_bond: YesNo;
advance_bond_percent: string | null;
advance_bond_type: BondType | null;
advance_bond_start_date: string | null;
advance_bond_end_date: string | null;

has_performance_bond: YesNo;
performance_bond_percent: string | null;
performance_bond_type: BondType | null;
performance_bond_start_date: string | null;
performance_bond_end_date: string | null;

has_price_adjustment: YesNo;
price_adjustment_percent: string | null;

has_retention: YesNo;
retention_percent: string | null;

has_price_index: YesNo;

has_liquidity_damage: YesNo;
liquidity_percent: string | null;
liquidity_limit: string | null;

minimum_payment_time: number | null;

engineering_facilities:
  EngineeringFacility[];

  status: ProjectStatus;

  registered_by: string | null;
  registered_by_user_id: number | null;
  date_registered: string | null;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface ProjectFormValues {
  project_no?: string;

  project_source: ProjectSource;

  bid_reference?: string | null;
  work_order_no?: string | null;

  project_name: string;
  project_name_letter?: string | null;
  project_description: string;
  location: string;

  customer_id: number;
  employer?: string;

  has_consultant: YesNo;
  consultant?: string | null;

  has_specified_area: YesNo;
  area?: string | null;

  construction_project_type:
    ConstructionProjectType;

    business_unit: string;
contract_type: string;

contract_amount_before_vat:
  DecimalValue;

contract_pricing_type: string;

contract_date: string | null;

has_site_handover_date: YesNo;
site_handover_date?: string | null;

has_commencement_date: YesNo;
commencement_date?: string | null;

project_duration: number | null;
duration_type: DurationType;
no_of_holidays?: number | null;

payment_term?: PaymentTerm | null;

has_advance_payment: YesNo;

advance_percent?:
  string | number | null;

has_advance_repayment: YesNo;

advance_repayment_complete_percent?:
  string | number | null;

advance_repayment_percent?:
  string | number | null;

advance_repayment_start?:
  AdvanceRepaymentStart | null;

interim_payment_schedule?:
  number | null;

advance_payment_due_date?:
  string | null;

has_advance_bond: YesNo;

advance_bond_percent?:
  string | number | null;

advance_bond_type?:
  BondType | null;

advance_bond_start_date?:
  string | null;

advance_bond_end_date?:
  string | null;

has_performance_bond: YesNo;

performance_bond_percent?:
  string | number | null;

performance_bond_type?:
  BondType | null;

performance_bond_start_date?:
  string | null;

performance_bond_end_date?:
  string | null;

  has_price_adjustment: YesNo;

price_adjustment_percent?:
  string | number | null;

has_retention: YesNo;

retention_percent?:
  string | number | null;

has_price_index: YesNo;

has_liquidity_damage: YesNo;

liquidity_percent?:
  string | number | null;

liquidity_limit?:
  string | number | null;

minimum_payment_time:
  number | null;

engineering_facilities:
  EngineeringFacility[];

  status: ProjectStatus;
}

export interface ProjectFilters {
  page?: number;
  per_page?: number;
  search?: string;

  status?: ProjectStatus;
  project_source?: ProjectSource;

  construction_project_type?:
    ConstructionProjectType;

  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}