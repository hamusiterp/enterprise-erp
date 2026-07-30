import apiClient from './client';

import type {
  ListResponse,
  MessageResponse,
  RecordStatus,
  SingleResponse,
} from '../types/api';

interface CrudApiConfig {
  endpoint: string;
  defaultExportFileName?: string;
}

export interface CrudApi<
  TRecord,
  TFormValues,
  TFilters extends object,
> {
  list: (
    filters?: TFilters,
  ) => Promise<ListResponse<TRecord>>;

  deleted: (
    filters?: TFilters,
  ) => Promise<ListResponse<TRecord>>;

  get: (
    id: number,
  ) => Promise<SingleResponse<TRecord>>;

  create: (
    payload: TFormValues,
  ) => Promise<SingleResponse<TRecord>>;

  update: (
    id: number,
    payload: TFormValues,
  ) => Promise<SingleResponse<TRecord>>;

  remove: (
    id: number,
  ) => Promise<MessageResponse>;

  restore: (
    id: number,
  ) => Promise<SingleResponse<TRecord>>;

  forceDelete: (
    id: number,
  ) => Promise<MessageResponse>;

  changeStatus: (
    id: number,
    status: RecordStatus,
  ) => Promise<SingleResponse<TRecord>>;

  exportFile: (
    filters?: TFilters,
  ) => Promise<void>;
}

export function createCrudApi<
  TRecord,
  TFormValues,
  TFilters extends object,
>(
  config: CrudApiConfig,
): CrudApi<TRecord, TFormValues, TFilters> {
  const {
    endpoint,
    defaultExportFileName = 'export.csv',
  } = config;

  async function list(
    filters?: TFilters,
  ): Promise<ListResponse<TRecord>> {
    const response =
      await apiClient.get<ListResponse<TRecord>>(
        endpoint,
        {
          params: filters,
        },
      );

    return response.data;
  }

  async function deleted(
    filters?: TFilters,
  ): Promise<ListResponse<TRecord>> {
    const response =
      await apiClient.get<ListResponse<TRecord>>(
        `${endpoint}/deleted`,
        {
          params: filters,
        },
      );

    return response.data;
  }

  async function get(
    id: number,
  ): Promise<SingleResponse<TRecord>> {
    const response =
      await apiClient.get<SingleResponse<TRecord>>(
        `${endpoint}/${id}`,
      );

    return response.data;
  }

  async function create(
    payload: TFormValues,
  ): Promise<SingleResponse<TRecord>> {
    const response =
      await apiClient.post<SingleResponse<TRecord>>(
        endpoint,
        payload,
      );

    return response.data;
  }

  async function update(
    id: number,
    payload: TFormValues,
  ): Promise<SingleResponse<TRecord>> {
    const response =
      await apiClient.put<SingleResponse<TRecord>>(
        `${endpoint}/${id}`,
        payload,
      );

    return response.data;
  }

  async function remove(
    id: number,
  ): Promise<MessageResponse> {
    const response =
      await apiClient.delete<MessageResponse>(
        `${endpoint}/${id}`,
      );

    return response.data;
  }

  async function restore(
    id: number,
  ): Promise<SingleResponse<TRecord>> {
    const response =
      await apiClient.post<SingleResponse<TRecord>>(
        `${endpoint}/${id}/restore`,
      );

    return response.data;
  }

  async function forceDelete(
    id: number,
  ): Promise<MessageResponse> {
    const response =
      await apiClient.delete<MessageResponse>(
        `${endpoint}/${id}/force-delete`,
      );

    return response.data;
  }

  async function changeStatus(
    id: number,
    status: RecordStatus,
  ): Promise<SingleResponse<TRecord>> {
    const response =
      await apiClient.patch<SingleResponse<TRecord>>(
        `${endpoint}/${id}/status`,
        {
          status,
        },
      );

    return response.data;
  }

  async function exportFile(
    filters?: TFilters,
  ): Promise<void> {
    const response = await apiClient.get(
      `${endpoint}/export`,
      {
        params: filters,
        responseType: 'blob',
      },
    );

    const contentDisposition =
      response.headers['content-disposition'];

    let fileName = defaultExportFileName;

    if (typeof contentDisposition === 'string') {
      const utf8Match = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i,
      );

      const normalMatch = contentDisposition.match(
        /filename="?([^";]+)"?/i,
      );

      const receivedName =
        utf8Match?.[1] ?? normalMatch?.[1];

      if (receivedName) {
        fileName = decodeURIComponent(receivedName);
      }
    }

    const blob = new Blob([response.data], {
      type:
        response.headers['content-type'] ??
        'application/octet-stream',
    });

    const downloadUrl =
      window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  }

  return {
    list,
    deleted,
    get,
    create,
    update,
    remove,
    restore,
    forceDelete,
    changeStatus,
    exportFile,
  };
}