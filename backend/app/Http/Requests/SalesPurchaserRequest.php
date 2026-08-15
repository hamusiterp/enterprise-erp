<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesPurchaserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'purchaser_name' => trim(
                (string) $this->input('purchaser_name')
            ),

            'status' => strtolower(
                trim(
                    (string) $this->input(
                        'status',
                        'active'
                    )
                )
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            'purchaser_name' => [
                'required',
                'string',
                'max:100',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'purchaser_name.required' =>
                'Purchaser name is required.',

            'purchaser_name.max' =>
                'Purchaser name cannot exceed 100 characters.',

            'status.required' =>
                'Status is required.',

            'status.in' =>
                'Status must be active or inactive.',
        ];
    }

    public function attributes(): array
    {
        return [
            'purchaser_name' => 'Purchaser Name',
            'status' => 'Status',
        ];
    }
}