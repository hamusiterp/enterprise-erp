import client from './client';

import {
    createCrudApi,
} from './crudApi';

import type {

    Cheque,

    ChequeFilters,

    ChequeFormValues,

    ChequeStatistics,

} from '../types/cheque';

const chequeCrudApi =
    createCrudApi<
        Cheque,
        ChequeFormValues,
        ChequeFilters
    >({

        endpoint:
            '/api/admin/finance/cheques',

        defaultExportFileName:
            'cheques.csv',

    });

export const chequesApi = {

    ...chequeCrudApi,

    async statistics():
        Promise<ChequeStatistics> {

        const response =
            await client.get(

                '/api/admin/finance/cheques/statistics'

            );

        return response.data.data;
    },

    async deleted(filters = {}) {

        const response =
            await client.get(

                '/api/admin/finance/cheques/deleted',

                {

                    params: filters,

                }

            );

        return response.data;
    },

    async restore(
        id: number,
    ) {

        return client.post(

            `/api/admin/finance/cheques/${id}/restore`

        );
    },

    async void(
        id: number,
    ) {

        return client.patch(

            `/api/admin/finance/cheques/${id}/void`

        );
    },

    async activate(
        id: number,
    ) {

        return client.patch(

            `/api/admin/finance/cheques/${id}/activate`

        );
    },

};