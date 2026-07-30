<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'bank_id' => $this->bank_id,
            'bank_name' => $this->bank_name,
            'bank_name_orginal' => $this->bank_name_orginal,
            'account_no' => $this->account_no,
            'branch' => $this->branch,
            'contact_address' => $this->contact_address,

            'begnning_amount' => $this->begnning_amount,
            'begnning__amount_left' => $this->begnning__amount_left,

            'od_available' => $this->od_available,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'od_amount' => $this->od_amount,
            'od_amount_left' => $this->od_amount_left,
            'min_amount' => $this->min_amount,
            'od_limit' => $this->od_limit,
            'od_status' => $this->od_status,

            'term_loan' => $this->term_loan,
            'term_loan_start_date' => $this->term_loan_start_date,
            'term_loan_end_date' => $this->term_loan_end_date,
            'term_loan_amount' => $this->term_loan_amount,
            'transfer_rate' => $this->transfer_rate,
            'repayment_amount' => $this->repayment_amount,
            'repayment_amount_left' => $this->repayment_amount_left,

            'term_loan_relief' => $this->term_loan_relief,
            'term_loan_relief_start_date' =>
                $this->term_loan_relief_start_date,
            'term_loan_relief_end_date' =>
                $this->term_loan_relief_end_date,

            'period' => $this->period,
            'ethiopian_date' => $this->ethiopian_date,
            'date_registered' => $this->date_registered,

            'cob_balance' => $this->cob_balance,
            'status' => $this->status,
            'last_activity' => $this->last_activity,
            'suggestion' => $this->suggestion,
            'end_balance' => $this->end_balance,
            'loan_status' => $this->loan_status,
            'credit_suggestion' => $this->credit_suggestion,
            'category' => $this->category,
            'start_month' => $this->start_month,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}