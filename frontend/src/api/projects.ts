import axios from 'axios';

import {
  createCrudApi,
} from './crudApi';

import type {
  BidProjectOption,
  CustomerOption,
  Project,
  ProjectFilters,
  ProjectFormValues,
  WorkOrderProjectOption,
} from '../types/project';

interface OptionsResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

interface NextNumberResponse {
  success: boolean;
  message: string;

  data: {
    project_no: string;
  };
}

const projectCrudApi = createCrudApi<
  Project,
  ProjectFormValues,
  ProjectFilters
>({
  endpoint: '/api/admin/projects',
  defaultExportFileName: 'projects.csv',
});

export const projectsApi = {
  ...projectCrudApi,

  async bidOptions(
    search?: string,
  ): Promise<BidProjectOption[]> {
    const response =
      await axios.get<
        OptionsResponse<BidProjectOption>
      >(
        '/api/admin/projects/bid-options',
        {
          params: {
            search:
              search?.trim()
              || undefined,
          },
        },
      );

    return response.data.data ?? [];
  },

  async workOrderOptions(
    search?: string,
  ): Promise<WorkOrderProjectOption[]> {
    const response =
      await axios.get<
        OptionsResponse<WorkOrderProjectOption>
      >(
        '/api/admin/projects/work-order-options',
        {
          params: {
            search:
              search?.trim()
              || undefined,
          },
        },
      );

    return response.data.data ?? [];
  },

  async customerOptions(
    search?: string,
  ): Promise<CustomerOption[]> {
    const response =
      await axios.get<
        OptionsResponse<CustomerOption>
      >(
        '/api/admin/projects/customer-options',
        {
          params: {
            search:
              search?.trim()
              || undefined,
          },
        },
      );

    return response.data.data ?? [];
  },

  async nextProjectNumber(): Promise<string> {
    const response =
      await axios.get<NextNumberResponse>(
        '/api/admin/projects/next-number',
      );

    return response.data.data.project_no;
  },
};