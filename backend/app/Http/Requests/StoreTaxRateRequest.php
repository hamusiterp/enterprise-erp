<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaxRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('tax-rates.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:50',
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'type' => [
                'required',
                'string',
                'max:50',
            ],

            'rate' => [
                'required',
                'numeric',
                'min:0',
            ],

            'country_code' => [
                'nullable',
                'string',
                'max:10',
            ],

            'effective_from' => [
                'required',
                'date',
            ],

            'effective_to' => [
                'nullable',
                'date',
                'after_or_equal:effective_from',
            ],

            'fiscal_year_id' => [
                'nullable',
                'integer',
                'exists:fiscal_years,id',
            ],

            'calculation_method' => [
                'required',
                Rule::in([
                    'add',
                    'deduct',
                    'info',
                ]),
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'is_default' => [
                'required',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ];
    }
}