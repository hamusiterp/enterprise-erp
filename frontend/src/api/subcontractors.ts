import client from './client';

import {
  createCrudApi,
} from './crudApi';

import type {
  Subcontractor,
  SubcontractorFilters,
  SubcontractorFormValues,
  SubcontractorStatistics,
} from '../types/subcontractor';

const subcontractorCrudApi =
  createCrudApi<
    Subcontractor,
    SubcontractorFormValues,
    SubcontractorFilters
  >({
    endpoint:
      '/api/admin/sales/subcontractors',

    defaultExportFileName:
      'subcontractors.csv',
  });

export const subcontractorsApi = {
  ...subcontractorCrudApi,

  async statistics():
    Promise<SubcontractorStatistics> {

    const response =
      await client.get(
        '/api/admin/sales/subcontractors/statistics',
      );

    return response.data.data;
  },

  async deleted(
    filters: {
      page?: number;
      per_page?: number;
      search?: string;
    } = {},
  ) {
    const response =
      await client.get(
        '/api/admin/sales/subcontractors/deleted',
        {
          params: filters,
        },
      );

    return response.data;
  },

  async restore(
    id: number,
  ) {
    return client.post(
      `/api/admin/sales/subcontractors/${id}/restore`,
    );
  },
};