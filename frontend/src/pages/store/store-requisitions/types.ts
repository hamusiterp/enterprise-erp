export type SrRequestType =
  | 'general'
  | 'fixed_asset'
  | 'internal_inventory';

export type SrUsedFor =
  | 'project'
  | 'department';

export type SrVoucherType =
  | 'goods'
  | 'fuel_oil';

export type FuelOilSource =
  | 'purchased'
  | 'stock';

export type SrDeliveryType =
  | 'over_qty_based'
  | 'at_any_time';

export type SrPriority =
  | 'urgent'
  | 'high'
  | 'normal'
  | 'low';

export interface SrItemUom {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
  decimal_places: number;
}

export interface SrItemMaster {
  id: number;
  item_no: string;
  item_description: string;
  category: string;

  uom_id: number | null;
  uom: SrItemUom | null;
}

export interface StoreRequisitionLine {
  /*
   * Frontend-only identifier.
   */
  key: string;

  item_id: number;
  item?: SrItemMaster;

  unit_of_measurement?: SrItemUom | null;

  uom_id: number;
  uom?: SrItemUom | null;

  mr_date?: string | null;
  mr_no?: string | null;
  mr_qty?: number | null;

  sr_qty: number;

  expected_delivery_date: string;

  delivery_type: SrDeliveryType;

  priority: SrPriority;

  urgency_reason?: string | null;

  remark?: string | null;
}

export interface SrDepartment {
  id: number;
  department_id?: string;
  department_name: string;
}

export interface SrProject {
  id: number;
  project_no: string;
  project_name: string;
  location?: string | null;
}

export interface SrUser {
  id: number;
  name?: string;
  email?: string;
}

export interface StoreRequisitionPayload {
  request_type: SrRequestType;

  mr_requested: boolean;

  used_for: SrUsedFor;

  project_id?: number | null;

  used_for_department_id?: number | null;

  from_department_id: number;

  to_location: string;

  voucher_sr_type: SrVoucherType;

  fuel_oil_source?: FuelOilSource | null;

 

  items: Array<{
    item_id: number;
    uom_id: number;

    mr_date?: string | null;
    mr_no?: string | null;
    mr_qty?: number | null;

    sr_qty: number;

    expected_delivery_date: string;

    delivery_type: SrDeliveryType;

    priority: SrPriority;

    urgency_reason?: string | null;

    remark?: string | null;
  }>;
}

export interface StoreRequisition {
  id: number;

  sr_no: string;

  request_type: SrRequestType;

  mr_requested: boolean;

  used_for: SrUsedFor | null;

  project_id: number | null;

  used_for_department_id: number | null;

  from_department_id: number | null;

  to_location: string;

  voucher_sr_type: SrVoucherType | null;

  fuel_oil_source: FuelOilSource | null;

  status: string;

  fiscal_year_id: number | null;

  sr_date: string | null;

  from_department?: SrDepartment | null;

used_for_department?: SrDepartment | null;

requested_department?: SrDepartment | null;

project?: SrProject | null;

requester?: SrUser | null;

  items: StoreRequisitionLine[];

  workflow_instance?: {
    id: number;

    current_state?: {
      id: number;
      code: string;
      name: string;
    } | null;
  } | null;
}

export interface StoreRequisitionListResponse {
  success: boolean;

  data: StoreRequisition[];

  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface StoreRequisitionResponse {
  success: boolean;
  message?: string;
  data: StoreRequisition;
}