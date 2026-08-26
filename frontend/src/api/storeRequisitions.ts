import apiClient from './client';

import type {
  StoreRequisition,
  StoreRequisitionListResponse,
  StoreRequisitionPayload,
  StoreRequisitionResponse,
} from '../pages/store/store-requisitions/types';

export interface StoreRequisitionListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

function removeEmpty(
  values: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '',
    ),
  );
}

export async function fetchStoreRequisitions(
  parameters: StoreRequisitionListParams = {},
): Promise<StoreRequisitionListResponse> {
  const response =
    await apiClient.get<StoreRequisitionListResponse>(
      '/api/store-requisitions',
      {
        params:
          removeEmpty(
            parameters as Record<
              string,
              unknown
            >,
          ),
      },
    );

  return response.data;
}

export async function fetchStoreRequisition(
  id: number,
): Promise<StoreRequisition> {
  const response =
    await apiClient.get<StoreRequisitionResponse>(
      `/api/store-requisitions/${id}`,
    );

  return response.data.data;
}

export async function createStoreRequisition(
  values: StoreRequisitionPayload,
): Promise<StoreRequisitionResponse> {
  const response =
    await apiClient.post<StoreRequisitionResponse>(
      '/api/store-requisitions',
      values,
    );

  return response.data;
}

export async function updateStoreRequisition(
  id: number,
  values: StoreRequisitionPayload,
): Promise<StoreRequisitionResponse> {
  const response =
    await apiClient.put<StoreRequisitionResponse>(
      `/api/store-requisitions/${id}`,
      values,
    );

  return response.data;
}