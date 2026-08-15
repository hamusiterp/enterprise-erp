import client from './client';

import {
  createCrudApi,
} from './crudApi';

import type {
  Category,
  CategoryFilters,
  CategoryFormValues,
  CategoryOption,
} from '../types/category';

const categoryCrudApi = createCrudApi<
  Category,
  CategoryFormValues,
  CategoryFilters
>({
  endpoint: '/api/admin/categories',
  defaultExportFileName: 'categories.csv',
});

export const categoriesApi = {
  ...categoryCrudApi,

  async options(
    type?: string,
    search?: string,
  ): Promise<CategoryOption[]> {
    const response = await client.get(
      '/api/admin/categories/options',
      {
        params: {
          type:
            type?.trim()
            || undefined,

          search:
            search?.trim()
            || undefined,
        },
      },
    );

    /*
     * Supports both wrapped and unwrapped
     * Axios response formats.
     */
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