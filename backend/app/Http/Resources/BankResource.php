<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,

            'name' => $this->name,
            'official_name' => $this->official_name,
            'account_number' => $this->account_number,
            'branch' => $this->branch,
            'contact_address' => $this->contact_address,

            'opening_balance' => $this->opening_balance,
            'opening_balance_remaining' =>
                $this->opening_balance_remaining,
            'minimum_balance' => $this->minimum_balance,

            'overdraft_available' =>
                $this->overdraft_available,

            'overdraft_start_date' =>
                $this->overdraft_start_date?->format('Y-m-d'),

            'overdraft_end_date' =>
                $this->overdraft_end_date?->format('Y-m-d'),

            'overdraft_amount' =>
                $this->overdraft_amount,

            'overdraft_amount_remaining' =>
                $this->overdraft_amount_remaining,

            'overdraft_limit' =>
                $this->overdraft_limit,

            'overdraft_status' =>
                $this->overdraft_status,

            'term_loan_available' =>
                $this->term_loan_available,

            'term_loan_start_date' =>
                $this->term_loan_start_date?->format('Y-m-d'),

            'term_loan_end_date' =>
                $this->term_loan_end_date?->format('Y-m-d'),

            'term_loan_amount' =>
                $this->term_loan_amount,

            'transfer_rate' =>
                $this->transfer_rate,

            'repayment_amount' =>
                $this->repayment_amount,

            'repayment_amount_remaining' =>
                $this->repayment_amount_remaining,

            'term_loan_relief' =>
                $this->term_loan_relief,

            'term_loan_relief_start_date' =>
                $this->term_loan_relief_start_date
                    ?->format('Y-m-d'),

            'term_loan_relief_end_date' =>
                $this->term_loan_relief_end_date
                    ?->format('Y-m-d'),

            'loan_status' => $this->loan_status,

            'period' => $this->period,

            'gregorian_date' =>
                $this->gregorian_date?->format('Y-m-d'),

            'ethiopian_date' =>
                $this->ethiopian_date,

            'cob_balance' =>
                $this->cob_balance,

            'ending_balance' =>
                $this->ending_balance,

            'suggestion' =>
                $this->suggestion,

            'credit_suggestion' =>
                $this->credit_suggestion,

            'category' =>
                $this->category,

            'start_month' =>
                $this->start_month,

            'status' =>
                $this->status,

            'last_activity' =>
                $this->last_activity,

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),

            'deleted_at' =>
                $this->deleted_at?->toISOString(),
        ];
    }
}