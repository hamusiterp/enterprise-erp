import { createCrudApi } from './crudApi';

import type {
  Bank,
  BankFilters,
  BankFormValues,
} from '../types/bank';

export const banksApi = createCrudApi<
  Bank,
  BankFormValues,
  BankFilters
>({
  endpoint: '/api/admin/banks',
  defaultExportFileName: 'banks.csv',
});