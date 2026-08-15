import client from './client';

import {
  createCrudApi,
} from './crudApi';

import type {
  Purchaser,
  PurchaserFilters,
  PurchaserFormValues,
} from '../types/purchaser';

const purchaserCrudApi =
  createCrudApi<
    Purchaser,
    PurchaserFormValues,
    PurchaserFilters
  >({

    endpoint: '/api/admin/sales/purchasers',

    defaultExportFileName:
      'purchasers.csv',

  });

export const purchasersApi = {

  ...purchaserCrudApi,

  async nextPurchaserNumber() {

    const response =
      await client.get(
  '/api/admin/sales/purchasers/next-number',
);

    return response.data.data;

  },

};