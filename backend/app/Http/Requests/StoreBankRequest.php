<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBankRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name)
                ? trim($this->name)
                : $this->name,

            'official_name' => is_string($this->official_name)
                ? trim($this->official_name)
                : $this->official_name,

            'account_number' => is_string($this->account_number)
                ? trim($this->account_number)
                : $this->account_number,

            'branch' => is_string($this->branch)
                ? trim($this->branch)
                : $this->branch,

            'status' => $this->status ?: 'active',

            'overdraft_available' => $this->boolean(
                'overdraft_available'
            ),

            'term_loan_available' => $this->boolean(
                'term_loan_available'
            ),

            'term_loan_relief' => $this->boolean(
                'term_loan_relief'
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'official_name' => [
                'nullable',
                'string',
                'max:200',
            ],

            'account_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('banks', 'account_number')
                    ->withoutTrashed(),
            ],

            'branch' => [
                'nullable',
                'string',
                'max:100',
            ],

            'contact_address' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | Opening Balance
            |--------------------------------------------------------------------------
            */

            'opening_balance' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'opening_balance_remaining' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'minimum_balance' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            /*
            |--------------------------------------------------------------------------
            | Overdraft
            |--------------------------------------------------------------------------
            */

            'overdraft_available' => [
                'required',
                'boolean',
            ],

            'overdraft_start_date' => [
                'nullable',
                'required_if:overdraft_available,true',
                'date_format:Y-m-d',
            ],

            'overdraft_end_date' => [
                'nullable',
                'required_if:overdraft_available,true',
                'date_format:Y-m-d',
                'after_or_equal:overdraft_start_date',
            ],

            'overdraft_amount' => [
                'nullable',
                'required_if:overdraft_available,true',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_amount_remaining' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_limit' => [
                'nullable',
                'required_if:overdraft_available,true',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'expired',
                    'closed',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Term Loan
            |--------------------------------------------------------------------------
            */

            'term_loan_available' => [
                'required',
                'boolean',
            ],

            'term_loan_start_date' => [
                'nullable',
                'required_if:term_loan_available,true',
                'date_format:Y-m-d',
            ],

            'term_loan_end_date' => [
                'nullable',
                'required_if:term_loan_available,true',
                'date_format:Y-m-d',
                'after_or_equal:term_loan_start_date',
            ],

            'term_loan_amount' => [
                'nullable',
                'required_if:term_loan_available,true',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'transfer_rate' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,4',
            ],

            'repayment_amount' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'repayment_amount_remaining' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            /*
            |--------------------------------------------------------------------------
            | Term Loan Relief
            |--------------------------------------------------------------------------
            */

            'term_loan_relief' => [
                'required',
                'boolean',
            ],

            'term_loan_relief_start_date' => [
                'nullable',
                'required_if:term_loan_relief,true',
                'date_format:Y-m-d',
            ],

            'term_loan_relief_end_date' => [
                'nullable',
                'required_if:term_loan_relief,true',
                'date_format:Y-m-d',
                'after_or_equal:term_loan_relief_start_date',
            ],

            'loan_status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'completed',
                    'defaulted',
                    'closed',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Date and Balance
            |--------------------------------------------------------------------------
            */

            'period' => [
                'nullable',
                'string',
                'max:20',
            ],

            'gregorian_date' => [
                'nullable',
                'date_format:Y-m-d',
            ],

            'ethiopian_date' => [
                'nullable',
                'string',
                'max:20',
            ],

            'cob_balance' => [
                'nullable',
                'numeric',
                'decimal:0,2',
            ],

            'ending_balance' => [
                'nullable',
                'numeric',
                'decimal:0,2',
            ],

            /*
            |--------------------------------------------------------------------------
            | Other Information
            |--------------------------------------------------------------------------
            */

            'suggestion' => [
                'nullable',
                'string',
                'max:100',
            ],

            'credit_suggestion' => [
                'nullable',
                'string',
                'max:100',
            ],

            'category' => [
                'nullable',
                'string',
                'max:500',
            ],

            'start_month' => [
                'nullable',
                'string',
                'max:50',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'last_activity' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>
                'The bank name is required.',

            'account_number.unique' =>
                'This account number is already registered.',

            'overdraft_start_date.required_if' =>
                'The overdraft start date is required when overdraft is available.',

            'overdraft_end_date.required_if' =>
                'The overdraft end date is required when overdraft is available.',

            'overdraft_amount.required_if' =>
                'The overdraft amount is required when overdraft is available.',

            'overdraft_limit.required_if' =>
                'The overdraft limit is required when overdraft is available.',

            'term_loan_start_date.required_if' =>
                'The term-loan start date is required when a term loan is available.',

            'term_loan_end_date.required_if' =>
                'The term-loan end date is required when a term loan is available.',

            'term_loan_amount.required_if' =>
                'The term-loan amount is required when a term loan is available.',

            'term_loan_relief_start_date.required_if' =>
                'The relief start date is required when loan relief is enabled.',

            'term_loan_relief_end_date.required_if' =>
                'The relief end date is required when loan relief is enabled.',
        ];
    }
}