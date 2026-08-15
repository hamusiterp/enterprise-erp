import type {
  UploadFile,
} from 'antd';

export type FixedAssetStatus =
  | 'active'
  | 'inactive';

export type AssetCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'out_of_service';

export type ReadingType =
  | 'engine_horse_power'
  | 'km_reading';

export interface FixedAssetCategory {
  id: number;
  name: string;
  type: string;
}

export interface FixedAsset {
  id: number;

  asset_no: string;

  vehicle_no: string | null;
  tag_no: string;
  plate_no: string | null;

  category_id: number;
  category: FixedAssetCategory | null;

  name_of_machinery: string;

  make_of_vehicle: string | null;
  model: string | null;
  make_of_year: string | null;

  chassis_no: string | null;
  engine_no: string | null;
  engine_model: string | null;
  make_of_engine: string | null;

  horse_power: string | null;
  type_of_fuel: string | null;

  reading_type: ReadingType;
  reading: string | null;

  consumption: string | null;
  standard_consumption: string | null;
  tanker_capacity: string | null;
  last_refill: string | null;

  has_gauge: boolean;
  gauge_reading: string | null;

  service_interval: number | null;
  last_service: string | null;

  purchase_date: string | null;
  licence_renewal_date: string | null;

  last_inspection_renewal_date:
    string | null;

  last_insurance_renewal_date:
    string | null;

  front_view_photo: string | null;
  front_view_photo_url: string | null;

  rear_view_photo: string | null;
  rear_view_photo_url: string | null;

  right_side_view_photo: string | null;
  right_side_view_photo_url: string | null;

  left_side_view_photo: string | null;
  left_side_view_photo_url: string | null;

  libre_document: string | null;
  libre_document_url: string | null;

  inspection_document: string | null;
  inspection_document_url: string | null;

  insurance_document: string | null;
  insurance_document_url: string | null;

  asset_condition: AssetCondition;

  current_location: string | null;
  assigned_to: string | null;
  remarks: string | null;

  status: FixedAssetStatus;

  registered_by: string | null;
  registered_by_user_id: number | null;
  registered_date: string | null;

  edited_by: string | null;
  edited_by_user_id: number | null;

  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface FixedAssetFormValues {
  asset_no?: string;

  vehicle_no?: string | null;
  tag_no: string;
  plate_no?: string | null;

  category_id: number;

  name_of_machinery: string;

  make_of_vehicle?: string | null;
  model?: string | null;
  make_of_year?: string | null;

  chassis_no?: string | null;
  engine_no?: string | null;
  engine_model?: string | null;
  make_of_engine?: string | null;

  horse_power?: string | number | null;

  type_of_fuel?: string | null;

  reading_type: ReadingType;

  reading:
    | string
    | number
    | null;

  consumption?:
    | string
    | number
    | null;

  standard_consumption?:
    | string
    | number
    | null;

  tanker_capacity?:
    | string
    | number
    | null;

  last_refill?: string | null;

  has_gauge: boolean;

  gauge_reading?:
    | string
    | number
    | null;

  service_interval?: number | null;
  last_service?: string | null;

  purchase_date: string | null;

  licence_renewal_date?:
    string | null;

  last_inspection_renewal_date?:
    string | null;

  last_insurance_renewal_date?:
    string | null;

  front_view_photo?: UploadFile[];
  rear_view_photo?: UploadFile[];

  right_side_view_photo?: UploadFile[];
  left_side_view_photo?: UploadFile[];

  libre_document?: UploadFile[];

  inspection_document?: UploadFile[];

  insurance_document?: UploadFile[];

  asset_condition: AssetCondition;

  current_location?: string | null;
  assigned_to?: string | null;
  remarks?: string | null;

  status: FixedAssetStatus;
}

export interface FixedAssetFilters {
  page?: number;
  per_page?: number;

  search?: string;

  category_id?: number;

  status?: FixedAssetStatus;

  asset_condition?:
    AssetCondition;

  reading_type?: ReadingType;

  type_of_fuel?: string;

  has_gauge?: boolean;

  sort_by?: string;

  sort_direction?:
    | 'asc'
    | 'desc';
}

export interface FixedAssetStatistics {
  total: number;

  active: number;
  inactive: number;

  excellent: number;
  good: number;
  fair: number;
  poor: number;
  out_of_service: number;

  with_gauge: number;
  without_gauge: number;

  deleted: number;
}