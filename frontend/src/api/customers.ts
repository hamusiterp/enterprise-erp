import client from './client';

import {
  createCrudApi,
} from './crudApi';

import type {
  Customer,
  CustomerFilters,
  CustomerFormValues,
  CustomerOption,
  CustomerStatistics,
} from '../types/customer';

const customerCrudApi = createCrudApi<
  Customer,
  CustomerFormValues,
  CustomerFilters
>({
  endpoint: '/api/admin/customers',
  defaultExportFileName: 'customers.csv',
});

export const customersApi = {
  ...customerCrudApi,

  async nextCustomerNumber(): Promise<string> {
    const response = await client.get(
      '/api/admin/customers/next-number',
    );

    const body = response.data;

    const customerNumber =
      body?.data?.customer_no
      ?? body?.customer_no;

    if (!customerNumber) {
      throw new Error(
        'Customer number was not returned by the server.',
      );
    }

    return customerNumber;
  },

  async statistics(): Promise<CustomerStatistics> {
    const response = await client.get(
      '/api/admin/customers/statistics',
    );

    return response.data?.data
      ?? response.data;
  },

  async options(
    customerType?: string,
    search?: string,
  ): Promise<CustomerOption[]> {
    const response = await client.get(
      '/api/admin/customers/options',
      {
        params: {
          customer_type:
            customerType?.trim()
            || undefined,

          search:
            search?.trim()
            || undefined,
        },
      },
    );

    const body = response.data;

    const options =
      body?.data
      ?? body
      ?? [];

    return Array.isArray(options)
      ? options
      : [];
  },
};