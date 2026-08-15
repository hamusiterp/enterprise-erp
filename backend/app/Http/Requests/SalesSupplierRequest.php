<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'supplier_name' => [
                'required',
                'string',
                'max:200',
            ],

            'category_id' => [
                'required',
                'exists:sales_category,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */

            'address' => [
                'nullable',
                'string',
            ],

            'phone_number' => [
                'required',
                'string',
                'max:50',
            ],

            /*
            |--------------------------------------------------------------------------
            | Tax Information
            |--------------------------------------------------------------------------
            */

            'has_tin' => [
                'required',
                'boolean',
            ],

            'tin' => [
                Rule::requiredIf(
                    $this->boolean('has_tin')
                ),
                'nullable',
                'string',
                'max:50',
            ],

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

        ];
    }

    /**
     * Friendly field names.
     */
    public function attributes(): array
    {
        return [

            'supplier_name' => 'Supplier Name',

            'category_id' => 'Category',

            'phone_number' => 'Phone Number',

            'has_tin' => 'Have a TIN Number',

            'tin' => 'TIN Number',

        ];
    }

    /**
     * Custom messages.
     */
    public function messages(): array
    {
        return [

            'category_id.exists' =>
                'Please select a valid supplier category.',

            'tin.required' =>
                'TIN Number is required when "Have a TIN Number" is Yes.',

        ];
    }
}