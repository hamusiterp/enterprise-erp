<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'customer_type' => strtolower((string) $this->customer_type),

            'withhold' => filter_var(
                $this->withhold,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),

            'withhold_from_advance' => filter_var(
                $this->withhold_from_advance,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
        ]);
    }

    public function rules(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Customer Type
            |--------------------------------------------------------------------------
            */

            'customer_type' => [
                'required',
                Rule::in([
                    'individual',
                    'company',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Individual
            |--------------------------------------------------------------------------
            */

            'firstname' => [
                Rule::requiredIf(
                    $this->customer_type === 'individual'
                ),
                'nullable',
                'string',
                'max:50',
            ],

            'lastname' => [
                Rule::requiredIf(
                    $this->customer_type === 'individual'
                ),
                'nullable',
                'string',
                'max:50',
            ],

            /*
            |--------------------------------------------------------------------------
            | Company
            |--------------------------------------------------------------------------
            */

            'company_name' => [
                Rule::requiredIf(
                    $this->customer_type === 'company'
                ),
                'nullable',
                'string',
                'max:200',
            ],

            'tin_number' => [
                Rule::requiredIf(
                    $this->customer_type === 'company'
                ),
                'nullable',
                'string',
                'max:50',
            ],

            /*
            |--------------------------------------------------------------------------
            | Common
            |--------------------------------------------------------------------------
            */

            'email_address' => [
                'nullable',
                'email',
                'max:100',
            ],

            'contact_person' => [
                'nullable',
                'string',
                'max:100',
            ],

            'phone_number' => [
                'required',
                'string',
                'max:50',
            ],

            'location' => [
                'required',
                'string',
                'max:100',
            ],

            'customer_status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Withhold
            |--------------------------------------------------------------------------
            */

            'withhold' => [
                'required',
                'boolean',
            ],

            'withhold_percent' => [
                Rule::requiredIf(
                    $this->boolean('withhold')
                ),
                'nullable',
                'numeric',
                'between:0,100',
            ],

            'withhold_from_advance' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'firstname.required' =>
                'First name is required for individual customers.',

            'lastname.required' =>
                'Last name is required for individual customers.',

            'company_name.required' =>
                'Company name is required for company customers.',

            'tin_number.required' =>
                'TIN number is required for company customers.',

            'withhold_percent.required' =>
                'Withhold percent is required when Withhold is Yes.',

            'phone_number.required' =>
                'Phone number is required.',

            'location.required' =>
                'Location is required.',
        ];
    }
}