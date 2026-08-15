<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesPurchaserAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'purchaser_id' =>
                $this->purchaser_id,

            /*
            |--------------------------------------------------------------------------
            | Bank
            |--------------------------------------------------------------------------
            */

            'bank_id' => $this->bank_id,

'bank' => $this->whenLoaded(
    'bank',
    function (): ?array {
        if (! $this->bank) {
            return null;
        }

        return [
            'id' => $this->bank->id,

            'name' =>
                $this->bank->bank_name_original
                ?? $this->bank->bank_name_orginal
                ?? $this->bank->bank_name
                ?? $this->bank->name
                ?? 'Bank',
        ];
    }
),

            /*
            |--------------------------------------------------------------------------
            | Account Details
            |--------------------------------------------------------------------------
            */

            'account_number' =>
                $this->account_number,

            'account_name' =>
                $this->account_name,

            'currency' =>
                $this->currency,

            'is_primary' =>
                $this->is_primary,

            'status' =>
                $this->status,

            /*
            |--------------------------------------------------------------------------
            | Registration and Audit
            |--------------------------------------------------------------------------
            */

            'registered_by' =>
                $this->registered_by,

            'registered_by_user_id' =>
                $this->registered_by_user_id,

            'date_registered' =>
                $this->date_registered
                    ?->format('Y-m-d'),

            'created_at' =>
                $this->created_at
                    ?->format('Y-m-d H:i:s'),

            'updated_at' =>
                $this->updated_at
                    ?->format('Y-m-d H:i:s'),

            'deleted_at' =>
                $this->deleted_at
                    ?->format('Y-m-d H:i:s'),
        ];
    }
}