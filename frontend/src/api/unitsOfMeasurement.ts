import apiClient from './client';

export interface UnitOfMeasurement {
  id: number;
  code: string;
  name: string;
  symbol?: string | null;
  category?:
    | 'quantity'
    | 'weight'
    | 'volume'
    | 'length'
    | 'area'
    | 'package'
    | 'other'
    | null;

  decimal_places: number;
  is_active: boolean;
  description?: string | null;
}

export interface UnitOfMeasurementPayload {
  code: string;
  name: string;
  symbol?: string | null;
  category?:
    | 'quantity'
    | 'weight'
    | 'volume'
    | 'length'
    | 'area'
    | 'package'
    | 'other'
    | null;

  decimal_places: number;
  is_active: boolean;
  description?: string | null;
}

export async function fetchUnitsOfMeasurement(): Promise<
  UnitOfMeasurement[]
> {
  const response = await apiClient.get(
    '/api/units-of-measurement',
  );

  return response.data.data;
}

export async function createUnitOfMeasurement(
  values: UnitOfMeasurementPayload,
): Promise<UnitOfMeasurement> {
  const response = await apiClient.post(
    '/api/units-of-measurement',
    values,
  );

  return response.data.data;
}

export async function updateUnitOfMeasurement(
  id: number,
  values: UnitOfMeasurementPayload,
): Promise<UnitOfMeasurement> {
  const response = await apiClient.put(
    `/api/units-of-measurement/${id}`,
    values,
  );

  return response.data.data;
}