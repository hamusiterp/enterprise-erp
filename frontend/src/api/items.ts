import { createCrudApi } from './crudApi';

import type {
  Item,
  ItemFilters,
  ItemFormValues,
} from '../types/item';

export const itemsApi = createCrudApi<
  Item,
  ItemFormValues,
  ItemFilters
>({
  endpoint: '/api/admin/items',
  defaultExportFileName: 'items.csv',
});