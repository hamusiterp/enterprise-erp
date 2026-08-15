import client from './client';

import {
  createCrudApi,
} from './crudApi';

import type {
  Supplier,
  SupplierFilters,
  SupplierFormData,
  SupplierStatistics,
} from '../types/supplier';

const supplierCrudApi = createCrudApi<
  Supplier,
  SupplierFormData,
  SupplierFilters
>({
  endpoint: '/api/admin/suppliers',
  defaultExportFileName: 'suppliers.csv',
});

export const suppliersApi = {
  ...supplierCrudApi,

  async nextSupplierNumber(): Promise<string> {
    const response = await client.get(
      '/api/admin/suppliers/next-number',
    );

    /*
     * Supports both:
     * {data: {supplier_no: "..."}}
     * and
     * {supplier_no: "..."}
     */
    const body = response.data;

    const supplierNumber =
      body?.data?.supplier_no
      ?? body?.supplier_no;

    if (!supplierNumber) {
      throw new Error(
        'Supplier number was not returned by the server.',
      );
    }

    return supplierNumber;
  },

  async statistics(): Promise<SupplierStatistics> {
    const response = await client.get(
      '/api/admin/suppliers/statistics',
    );

    return response.data?.data
      ?? response.data;
  },
};