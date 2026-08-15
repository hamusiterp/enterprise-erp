<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChequeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cheque = $this->route('cheque');

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
    'string',
    'max:50',

    Rule::unique(
        'erp_cheque',
        'cheque_no'
    )->ignore(
        $this->route('cheque')?->id
        ?? $this->route('cheque')
    ),
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