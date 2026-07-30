<?php

namespace App\Http\Requests;

use App\Models\Bank;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBankRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('name')) {
            $data['name'] = is_string($this->name)
                ? trim($this->name)
                : $this->name;
        }

        if ($this->has('official_name')) {
            $data['official_name'] =
                is_string($this->official_name)
                    ? trim($this->official_name)
                    : $this->official_name;
        }

        if ($this->has('account_number')) {
            $data['account_number'] =
                is_string($this->account_number)
                    ? trim($this->account_number)
                    : $this->account_number;
        }

        if ($this->has('branch')) {
            $data['branch'] =
                is_string($this->branch)
                    ? trim($this->branch)
                    : $this->branch;
        }

        if ($this->has('overdraft_available')) {
            $data['overdraft_available'] =
                $this->boolean('overdraft_available');
        }

        if ($this->has('term_loan_available')) {
            $data['term_loan_available'] =
                $this->boolean('term_loan_available');
        }

        if ($this->has('term_loan_relief')) {
            $data['term_loan_relief'] =
                $this->boolean('term_loan_relief');
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        /** @var Bank|null $bank */
        $bank = $this->route('bank');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'official_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:200',
            ],

            'account_number' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('banks', 'account_number')
                    ->ignore($bank?->id)
                    ->withoutTrashed(),
            ],

            'branch' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'contact_address' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'opening_balance' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'opening_balance_remaining' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'minimum_balance' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_available' => [
                'sometimes',
                'boolean',
            ],

            'overdraft_start_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
            ],

            'overdraft_end_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:overdraft_start_date',
            ],

            'overdraft_amount' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_amount_remaining' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_limit' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'overdraft_status' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'expired',
                    'closed',
                ]),
            ],

            'term_loan_available' => [
                'sometimes',
                'boolean',
            ],

            'term_loan_start_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
            ],

            'term_loan_end_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:term_loan_start_date',
            ],

            'term_loan_amount' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'transfer_rate' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,4',
            ],

            'repayment_amount' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'repayment_amount_remaining' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'term_loan_relief' => [
                'sometimes',
                'boolean',
            ],

            'term_loan_relief_start_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
            ],

            'term_loan_relief_end_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:term_loan_relief_start_date',
            ],

            'loan_status' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'completed',
                    'defaulted',
                    'closed',
                ]),
            ],

            'period' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],

            'gregorian_date' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
            ],

            'ethiopian_date' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],

            'cob_balance' => [
                'sometimes',
                'nullable',
                'numeric',
                'decimal:0,2',
            ],

            'ending_balance' => [
                'sometimes',
                'nullable',
                'numeric',
                'decimal:0,2',
            ],

            'suggestion' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'credit_suggestion' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'category' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],

            'start_month' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
            ],

            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],

            'last_activity' => [
                'sometimes',
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

            'overdraft_end_date.after_or_equal' =>
                'The overdraft end date must be after or equal to the start date.',

            'term_loan_end_date.after_or_equal' =>
                'The term-loan end date must be after or equal to the start date.',

            'term_loan_relief_end_date.after_or_equal' =>
                'The relief end date must be after or equal to the relief start date.',
        ];
    }
}