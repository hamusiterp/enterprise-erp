<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChequeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'bank_id' => [

                'required',

                'exists:sales_bank,id',

            ],

            'branch' => [

                'required',

                'max:100',

            ],

            'cheque_no' => [

                'required',

                'max:50',

                'unique:erp_cheque,cheque_no',

            ],

            'signature_status' => [

                'required',

                'in:fully,partially',

            ],

            'status' => [
                'required',
                'in:active,void',
            ],

        ];
    }
}