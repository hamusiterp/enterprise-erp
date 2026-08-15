<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesPurchaserAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'account_number' => trim(
                (string) $this->input('account_number')
            ),

            'account_name' => $this->filled('account_name')
                ? trim(
                    (string) $this->input('account_name')
                )
                : null,

            'currency' => $this->filled('currency')
                ? strtoupper(
                    trim(
                        (string) $this->input('currency')
                    )
                )
                : null,

            'is_primary' => filter_var(
                $this->input('is_primary', false),
                FILTER_VALIDATE_BOOLEAN
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
        $accountRouteValue = $this->route(
            'salesPurchaserAccount'
        );

        $accountId = is_object($accountRouteValue)
            ? $accountRouteValue->id
            : $accountRouteValue;

        return [
            'bank_id' => [
                'required',
                'integer',

                /*
                 * Change "banks" if your actual Bank
                 * module table has another name.
                 */
                'exists:sales_bank,id',
            ],

            'account_number' => [
                'required',
                'string',
                'max:50',

                Rule::unique(
                    'sales_purchaser_account'
                )
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'bank_id',
                                $this->input('bank_id')
                            )
                    )
                    ->ignore($accountId),
            ],

            'account_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'currency' => [
                'nullable',
                'string',
                'size:3',
                Rule::in([
                    'ETB',
                    'USD',
                    'EUR',
                    'GBP',
                    'AED',
                    'JPY',
                    'CNY',
                ]),
            ],

            'is_primary' => [
                'required',
                'boolean',
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
            'bank_id.required' =>
                'Bank is required.',

            'bank_id.exists' =>
                'Please select a valid bank.',

            'account_number.required' =>
                'Account number is required.',

            'account_number.unique' =>
                'This account number is already registered for the selected bank.',

            'account_number.max' =>
                'Account number cannot exceed 50 characters.',

            'account_name.max' =>
                'Account name cannot exceed 100 characters.',

            'currency.size' =>
                'Currency must use a three-letter code.',

            'currency.in' =>
                'Please select a valid currency.',

            'is_primary.required' =>
                'Please select whether this is the primary account.',

            'status.required' =>
                'Account status is required.',

            'status.in' =>
                'Account status must be active or inactive.',
        ];
    }

    public function attributes(): array
    {
        return [
            'bank_id' => 'Bank',
            'account_number' => 'Account Number',
            'account_name' => 'Account Name',
            'currency' => 'Currency',
            'is_primary' => 'Primary Account',
            'status' => 'Status',
        ];
    }
}