import client from './client';

import type {
  FixedAsset,
  FixedAssetFilters,
  FixedAssetFormValues,
  FixedAssetStatistics,
} from '../types/fixedAsset';

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface FixedAssetListResponse {
  success: boolean;
  message: string;

  data: FixedAsset[];

  pagination: PaginationData;
  meta?: PaginationData;
}

interface FixedAssetResponse {
  success: boolean;
  message: string;
  data: FixedAsset;
}

interface NextAssetNumberResponse {
  success: boolean;
  message: string;

  data: {
    asset_no: string;
  };
}

interface StatisticsResponse {
  success: boolean;

  data: FixedAssetStatistics;
}

const endpoint =
  '/api/admin/fixed-assets';

function appendText(
  formData: FormData,
  key: string,
  value:
    | string
    | number
    | boolean
    | null
    | undefined,
): void {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  formData.append(
    key,
    String(value),
  );
}

function getUploadFile(
  fileList:
    | FixedAssetFormValues[
        'front_view_photo'
      ]
    | undefined,
): File | null {
  const item = fileList?.[0];

  if (!item?.originFileObj) {
    return null;
  }

  return item.originFileObj as File;
}

function appendFile(
  formData: FormData,
  key: string,
  fileList:
    | FixedAssetFormValues[
        'front_view_photo'
      ]
    | undefined,
): void {
  const file =
    getUploadFile(fileList);

  if (file) {
    formData.append(
      key,
      file,
    );
  }
}

function createFixedAssetFormData(
  values: FixedAssetFormValues,
): FormData {
  const formData = new FormData();

  appendText(
    formData,
    'vehicle_no',
    values.vehicle_no,
  );

  appendText(
    formData,
    'tag_no',
    values.tag_no,
  );

  appendText(
    formData,
    'plate_no',
    values.plate_no,
  );

  appendText(
    formData,
    'category_id',
    values.category_id,
  );

  appendText(
    formData,
    'name_of_machinery',
    values.name_of_machinery,
  );

  appendText(
    formData,
    'make_of_vehicle',
    values.make_of_vehicle,
  );

  appendText(
    formData,
    'model',
    values.model,
  );

  appendText(
    formData,
    'make_of_year',
    values.make_of_year,
  );

  appendText(
    formData,
    'chassis_no',
    values.chassis_no,
  );

  appendText(
    formData,
    'engine_no',
    values.engine_no,
  );

  appendText(
    formData,
    'engine_model',
    values.engine_model,
  );

  appendText(
    formData,
    'make_of_engine',
    values.make_of_engine,
  );

  appendText(
    formData,
    'horse_power',
    values.horse_power,
  );

  appendText(
    formData,
    'type_of_fuel',
    values.type_of_fuel,
  );

  appendText(
    formData,
    'reading_type',
    values.reading_type,
  );

  appendText(
    formData,
    'reading',
    values.reading,
  );

  appendText(
    formData,
    'consumption',
    values.consumption,
  );

  appendText(
    formData,
    'standard_consumption',
    values.standard_consumption,
  );

  appendText(
    formData,
    'tanker_capacity',
    values.tanker_capacity,
  );

  appendText(
    formData,
    'last_refill',
    values.last_refill,
  );

  appendText(
    formData,
    'has_gauge',
    values.has_gauge
      ? '1'
      : '0',
  );

  appendText(
    formData,
    'gauge_reading',
    values.has_gauge
      ? values.gauge_reading
      : null,
  );

  appendText(
    formData,
    'service_interval',
    values.service_interval,
  );

  appendText(
    formData,
    'last_service',
    values.last_service,
  );

  appendText(
    formData,
    'purchase_date',
    values.purchase_date,
  );

  appendText(
    formData,
    'licence_renewal_date',
    values.licence_renewal_date,
  );

  appendText(
    formData,
    'last_inspection_renewal_date',
    values.last_inspection_renewal_date,
  );

  appendText(
    formData,
    'last_insurance_renewal_date',
    values.last_insurance_renewal_date,
  );

  appendText(
    formData,
    'asset_condition',
    values.asset_condition,
  );

  appendText(
    formData,
    'current_location',
    values.current_location,
  );

  appendText(
    formData,
    'assigned_to',
    values.assigned_to,
  );

  appendText(
    formData,
    'remarks',
    values.remarks,
  );

  appendText(
    formData,
    'status',
    values.status,
  );

  appendFile(
    formData,
    'front_view_photo',
    values.front_view_photo,
  );

  appendFile(
    formData,
    'rear_view_photo',
    values.rear_view_photo,
  );

  appendFile(
    formData,
    'right_side_view_photo',
    values.right_side_view_photo,
  );

  appendFile(
    formData,
    'left_side_view_photo',
    values.left_side_view_photo,
  );

  appendFile(
    formData,
    'libre_document',
    values.libre_document,
  );

  appendFile(
    formData,
    'inspection_document',
    values.inspection_document,
  );

  appendFile(
    formData,
    'insurance_document',
    values.insurance_document,
  );

  return formData;
}

export const fixedAssetsApi = {
  async list(
    filters: FixedAssetFilters,
  ): Promise<FixedAssetListResponse> {
    const response =
      await client.get<FixedAssetListResponse>(
        endpoint,
        {
          params: filters,
        },
      );

    return response.data;
  },

  async show(
    id: number,
  ): Promise<FixedAsset> {
    const response =
      await client.get<FixedAssetResponse>(
        `${endpoint}/${id}`,
      );

    return response.data.data;
  },

  async create(
    values: FixedAssetFormValues,
  ): Promise<FixedAsset> {
    const formData =
      createFixedAssetFormData(
        values,
      );

    const response =
      await client.post<FixedAssetResponse>(
        endpoint,
        formData,
      );

    return response.data.data;
  },

  async update(
    id: number,
    values: FixedAssetFormValues,
  ): Promise<FixedAsset> {
    const formData =
      createFixedAssetFormData(
        values,
      );

    /*
     * Laravel handles multipart PUT more reliably
     * through POST with method spoofing.
     */
    formData.append(
      '_method',
      'PUT',
    );

    const response =
      await client.post<FixedAssetResponse>(
        `${endpoint}/${id}`,
        formData,
      );

    return response.data.data;
  },

  async remove(
    id: number,
  ): Promise<void> {
    await client.delete(
      `${endpoint}/${id}`,
    );
  },

  async nextAssetNumber():
    Promise<string> {
    const response =
      await client.get<NextAssetNumberResponse>(
        `${endpoint}/next-number`,
      );

    const assetNumber =
      response.data?.data?.asset_no;

    if (!assetNumber) {
      throw new Error(
        'Asset number was not returned by the server.',
      );
    }

    return assetNumber;
  },

  async statistics():
    Promise<FixedAssetStatistics> {
    const response =
      await client.get<StatisticsResponse>(
        `${endpoint}/statistics`,
      );

    return response.data.data;
  },

  async export(
    filters: FixedAssetFilters,
  ): Promise<Blob> {
    const response =
      await client.get(
        `${endpoint}/export`,
        {
          params: filters,
          responseType: 'blob',
        },
      );

    return response.data;
  },

  async deleted(
    filters: FixedAssetFilters,
  ): Promise<FixedAssetListResponse> {
    const response =
      await client.get<FixedAssetListResponse>(
        `${endpoint}/deleted`,
        {
          params: filters,
        },
      );

    return response.data;
  },

  async restore(
    id: number,
  ): Promise<FixedAsset> {
    const response =
      await client.patch<FixedAssetResponse>(
        `${endpoint}/${id}/restore`,
      );

    return response.data.data;
  },

  async forceDelete(
    id: number,
  ): Promise<void> {
    await client.delete(
      `${endpoint}/${id}/force-delete`,
    );
  },
};