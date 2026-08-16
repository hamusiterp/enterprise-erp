import api from './api';


export type FixedAssetStatus =
  | 'active'
  | 'inactive';


export type FixedAssetCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'out_of_service';


export type FixedAssetReadingType =
  | 'engine_horse_power'
  | 'km_reading';


export interface FixedAssetCategory {
  id: number;
  name: string;
  type?: string | null;
}


export interface FixedAsset {

  id: number;

  asset_no: string;

  vehicle_no: string;

  tag_no: string;

  plate_no: string;

  category_id: number;

  category?:
    | FixedAssetCategory
    | null;


  name_of_machinery: string;

  make_of_vehicle: string;

  model: string;

  make_of_year: string;

  chassis_no: string;

  engine_no: string;

  engine_model: string;

  make_of_engine: string;

  horse_power:
    | number
    | string;

  type_of_fuel: string;


  reading_type:
    FixedAssetReadingType;

  reading:
    | number
    | string;

  consumption?:
    | number
    | string
    | null;

  standard_consumption?:
    | number
    | string
    | null;

  tanker_capacity:
    | number
    | string;

  last_refill?:
    | string
    | null;


  has_gauge:
    | boolean
    | number
    | string;

  gauge_reading?:
    | number
    | string
    | null;


  service_interval?:
    | number
    | string
    | null;

  last_service: string;


  purchase_date: string;

  licence_renewal_date:
    string;

  last_inspection_renewal_date:
    string;

  last_insurance_renewal_date:
    string;


  front_view_photo?:
    | string
    | null;

  front_view_photo_url?:
    | string
    | null;

  rear_view_photo?:
    | string
    | null;

  rear_view_photo_url?:
    | string
    | null;

  right_side_view_photo?:
    | string
    | null;

  right_side_view_photo_url?:
    | string
    | null;

  left_side_view_photo?:
    | string
    | null;

  left_side_view_photo_url?:
    | string
    | null;


  libre_document?:
    | string
    | null;

  libre_document_url?:
    | string
    | null;

  inspection_document?:
    | string
    | null;

  inspection_document_url?:
    | string
    | null;

  insurance_document?:
    | string
    | null;

  insurance_document_url?:
    | string
    | null;


  asset_condition:
    FixedAssetCondition;

  current_location?:
    | string
    | null;

  assigned_to?:
    | string
    | null;

  remarks?:
    | string
    | null;

  status:
    FixedAssetStatus;


  registered_by?:
    | string
    | null;

  registered_by_user_id?:
    | number
    | null;

  registered_date?:
    | string
    | null;

  edited_by?:
    | string
    | null;

  edited_by_user_id?:
    | number
    | null;

  created_at?:
    | string
    | null;

  updated_at?:
    | string
    | null;

  deleted_at?:
    | string
    | null;
}


/*
|--------------------------------------------------------------------------
| Multipart File
|--------------------------------------------------------------------------
*/

export interface UploadFile {

  uri: string;

  name: string;

  type: string;
}


/*
|--------------------------------------------------------------------------
| Create / Update Payload
|--------------------------------------------------------------------------
*/

export interface FixedAssetPayload {

  vehicle_no: string;

  tag_no: string;

  plate_no: string;

  category_id: number;

  name_of_machinery: string;

  make_of_vehicle: string;

  model: string;

  make_of_year: string;

  chassis_no: string;

  engine_no: string;

  engine_model: string;

  make_of_engine: string;

  horse_power:
    | number
    | string;

  type_of_fuel: string;

  reading_type:
    FixedAssetReadingType;

  reading:
    | number
    | string;

  consumption?:
    | number
    | string
    | null;

  standard_consumption?:
    | number
    | string
    | null;

  tanker_capacity:
    | number
    | string;

  last_refill?:
    | string
    | null;

  has_gauge: boolean;

  gauge_reading?:
    | number
    | string
    | null;

  service_interval?:
    | number
    | string
    | null;

  last_service: string;

  purchase_date: string;

  licence_renewal_date:
    string;

  last_inspection_renewal_date:
    string;

  last_insurance_renewal_date:
    string;

  asset_condition:
    FixedAssetCondition;

  current_location?:
    | string
    | null;

  assigned_to?:
    | string
    | null;

  remarks?:
    | string
    | null;

  status:
    FixedAssetStatus;


  /*
  |--------------------------------------------------------------------------
  | Files
  |--------------------------------------------------------------------------
  */

  front_view_photo?:
    UploadFile | null;

  rear_view_photo?:
    UploadFile | null;

  right_side_view_photo?:
    UploadFile | null;

  left_side_view_photo?:
    UploadFile | null;

  libre_document?:
    UploadFile | null;

  inspection_document?:
    UploadFile | null;

  insurance_document?:
    UploadFile | null;
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


export interface FixedAssetPagination {

  current_page: number;

  last_page: number;

  per_page: number;

  total: number;

  from?:
    | number
    | null;

  to?:
    | number
    | null;
}


export interface FixedAssetListResponse {

  data:
    FixedAsset[];

  pagination:
    FixedAssetPagination;
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function appendIfDefined(
  formData: FormData,
  key: string,
  value: unknown
) {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return;
  }


  formData.append(
    key,
    String(value)
  );
}


function appendBoolean(
  formData: FormData,
  key: string,
  value: boolean
) {

  formData.append(
    key,
    value ? '1' : '0'
  );
}


function appendFile(
  formData: FormData,
  key: string,
  file?:
    | UploadFile
    | null
) {

  if (!file) {
    return;
  }


  formData.append(
    key,
    {
      uri:
        file.uri,

      name:
        file.name,

      type:
        file.type,
    } as any
  );
}


function buildFormData(
  data: FixedAssetPayload,
  includeFiles = true
) {

  const formData =
    new FormData();


  appendIfDefined(
    formData,
    'vehicle_no',
    data.vehicle_no
  );

  appendIfDefined(
    formData,
    'tag_no',
    data.tag_no
  );

  appendIfDefined(
    formData,
    'plate_no',
    data.plate_no
  );

  appendIfDefined(
    formData,
    'category_id',
    data.category_id
  );

  appendIfDefined(
    formData,
    'name_of_machinery',
    data.name_of_machinery
  );

  appendIfDefined(
    formData,
    'make_of_vehicle',
    data.make_of_vehicle
  );

  appendIfDefined(
    formData,
    'model',
    data.model
  );

  appendIfDefined(
    formData,
    'make_of_year',
    data.make_of_year
  );

  appendIfDefined(
    formData,
    'chassis_no',
    data.chassis_no
  );

  appendIfDefined(
    formData,
    'engine_no',
    data.engine_no
  );

  appendIfDefined(
    formData,
    'engine_model',
    data.engine_model
  );

  appendIfDefined(
    formData,
    'make_of_engine',
    data.make_of_engine
  );

  appendIfDefined(
    formData,
    'horse_power',
    data.horse_power
  );

  appendIfDefined(
    formData,
    'type_of_fuel',
    data.type_of_fuel
  );

  appendIfDefined(
    formData,
    'reading_type',
    data.reading_type
  );

  appendIfDefined(
    formData,
    'reading',
    data.reading
  );

  appendIfDefined(
    formData,
    'consumption',
    data.consumption
  );

  appendIfDefined(
    formData,
    'standard_consumption',
    data.standard_consumption
  );

  appendIfDefined(
    formData,
    'tanker_capacity',
    data.tanker_capacity
  );

  appendIfDefined(
    formData,
    'last_refill',
    data.last_refill
  );


  appendBoolean(
    formData,
    'has_gauge',
    data.has_gauge
  );


  if (
    data.has_gauge
  ) {

    appendIfDefined(
      formData,
      'gauge_reading',
      data.gauge_reading
    );

  }


  appendIfDefined(
    formData,
    'service_interval',
    data.service_interval
  );

  appendIfDefined(
    formData,
    'last_service',
    data.last_service
  );

  appendIfDefined(
    formData,
    'purchase_date',
    data.purchase_date
  );

  appendIfDefined(
    formData,
    'licence_renewal_date',
    data.licence_renewal_date
  );

  appendIfDefined(
    formData,
    'last_inspection_renewal_date',
    data.last_inspection_renewal_date
  );

  appendIfDefined(
    formData,
    'last_insurance_renewal_date',
    data.last_insurance_renewal_date
  );

  appendIfDefined(
    formData,
    'asset_condition',
    data.asset_condition
  );

  appendIfDefined(
    formData,
    'current_location',
    data.current_location
  );

  appendIfDefined(
    formData,
    'assigned_to',
    data.assigned_to
  );

  appendIfDefined(
    formData,
    'remarks',
    data.remarks
  );

  appendIfDefined(
    formData,
    'status',
    data.status
  );


  if (includeFiles) {

    appendFile(
      formData,
      'front_view_photo',
      data.front_view_photo
    );

    appendFile(
      formData,
      'rear_view_photo',
      data.rear_view_photo
    );

    appendFile(
      formData,
      'right_side_view_photo',
      data.right_side_view_photo
    );

    appendFile(
      formData,
      'left_side_view_photo',
      data.left_side_view_photo
    );

    appendFile(
      formData,
      'libre_document',
      data.libre_document
    );

    appendFile(
      formData,
      'inspection_document',
      data.inspection_document
    );

    appendFile(
      formData,
      'insurance_document',
      data.insurance_document
    );

  }


  return formData;
}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const fixedAssetsApi = {

  /*
  |--------------------------------------------------------------------------
  | List
  |--------------------------------------------------------------------------
  */

  async list(params?: {

    search?: string;

    category_id?: number;

    status?:
      FixedAssetStatus;

    asset_condition?:
      FixedAssetCondition;

    reading_type?:
      FixedAssetReadingType;

    type_of_fuel?:
      string;

    has_gauge?:
      boolean;

    sort_by?:
      string;

    sort_direction?:
      | 'asc'
      | 'desc';

    sort_order?:
      | 'asc'
      | 'desc';

    page?: number;

    per_page?: number;

  }): Promise<FixedAssetListResponse> {

    const response =
      await api.get(
        '/admin/fixed-assets',
        {
          params,
        }
      );


    const pagination =
      response.data?.pagination ??
      response.data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
      };


    return {

      data:
        response.data?.data ??
        [],

      pagination,

    };

  },


  /*
  |--------------------------------------------------------------------------
  | Show
  |--------------------------------------------------------------------------
  */

  async get(
    id: number
  ): Promise<FixedAsset> {

    const response =
      await api.get(
        `/admin/fixed-assets/${id}`
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(
    data: FixedAssetPayload
  ): Promise<FixedAsset> {

    const formData =
      buildFormData(
        data,
        true
      );


    const response =
      await api.post(
        '/admin/fixed-assets',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  |
  | Laravel / PHP multipart PUT can be troublesome in some setups.
  | Using POST + _method=PUT keeps file replacement reliable.
  |
  */

  async update(
    id: number,
    data: FixedAssetPayload
  ): Promise<FixedAsset> {

    const formData =
      buildFormData(
        data,
        true
      );


    formData.append(
      '_method',
      'PUT'
    );


    const response =
      await api.post(
        `/admin/fixed-assets/${id}`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  async changeStatus(
    id: number,
    status:
      FixedAssetStatus
  ): Promise<FixedAsset> {

    const response =
      await api.patch(
        `/admin/fixed-assets/${id}/status`,
        {
          status,
        }
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/fixed-assets/${id}`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Deleted Assets
  |--------------------------------------------------------------------------
  */

  async deleted(params?: {

    search?: string;

    page?: number;

    per_page?: number;

  }): Promise<FixedAssetListResponse> {

    const response =
      await api.get(
        '/admin/fixed-assets/deleted',
        {
          params,
        }
      );


    const pagination =
      response.data?.pagination ??
      response.data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
      };


    return {

      data:
        response.data?.data ??
        [],

      pagination,

    };

  },


  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(
    id: number
  ): Promise<FixedAsset> {

    const response =
      await api.patch(
        `/admin/fixed-assets/${id}/restore`
      );


    return (
      response.data?.data ??
      response.data
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Force Delete
  |--------------------------------------------------------------------------
  */

  async forceDelete(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/fixed-assets/${id}/force-delete`
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics():
    Promise<FixedAssetStatistics> {

    const response =
      await api.get(
        '/admin/fixed-assets/statistics'
      );


    return (
      response.data?.data ?? {

        total: 0,

        active: 0,

        inactive: 0,

        excellent: 0,

        good: 0,

        fair: 0,

        poor: 0,

        out_of_service: 0,

        with_gauge: 0,

        without_gauge: 0,

        deleted: 0,

      }
    );

  },


  /*
  |--------------------------------------------------------------------------
  | Next Asset Number
  |--------------------------------------------------------------------------
  */

  async nextNumber():
    Promise<string> {

    const response =
      await api.get(
        '/admin/fixed-assets/next-number'
      );


    return (
      response.data?.data
        ?.asset_no ??
      ''
    );

  },

};