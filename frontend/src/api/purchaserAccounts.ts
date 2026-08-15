import client from './client';

import type {
  PurchaserAccount,
  PurchaserAccountFormValues,
} from '../types/purchaser';

const purchaserEndpoint =
  '/api/admin/sales/purchasers';

export const purchaserAccountsApi = {
  async list(
    purchaserId: number,
  ): Promise<PurchaserAccount[]> {
    const response = await client.get(
      `${purchaserEndpoint}/${purchaserId}/accounts`,
    );

    const records =
      response.data?.data
      ?? response.data
      ?? [];

    return Array.isArray(records)
      ? records
      : [];
  },

  async create(
    purchaserId: number,
    values: PurchaserAccountFormValues,
  ): Promise<PurchaserAccount> {
    const response = await client.post(
      `${purchaserEndpoint}/${purchaserId}/accounts`,
      values,
    );

    return response.data?.data
      ?? response.data;
  },

  async update(
    purchaserId: number,
    accountId: number,
    values: PurchaserAccountFormValues,
  ): Promise<PurchaserAccount> {
    const response = await client.put(
      `${purchaserEndpoint}/${purchaserId}/accounts/${accountId}`,
      values,
    );

    return response.data?.data
      ?? response.data;
  },

  async remove(
    purchaserId: number,
    accountId: number,
  ): Promise<void> {
    await client.delete(
      `${purchaserEndpoint}/${purchaserId}/accounts/${accountId}`,
    );
  },

  async setPrimary(
    purchaserId: number,
    accountId: number,
  ): Promise<void> {
    await client.patch(
      `${purchaserEndpoint}/${purchaserId}/accounts/${accountId}/primary`,
    );
  },
};