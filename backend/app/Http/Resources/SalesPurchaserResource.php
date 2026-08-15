<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesPurchaserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' =>
                $this->id,

            'purchaser_no' =>
                $this->purchaser_no,

            'purchaser_name' =>
                $this->purchaser_name,

            'status' =>
                $this->status,

            /*
            |--------------------------------------------------------------------------
            | Account Summary
            |--------------------------------------------------------------------------
            */

            'accounts_count' =>
                $this->whenCounted(
                    'accounts'
                ),

            'active_accounts_count' =>
                $this->whenCounted(
                    'activeAccounts'
                ),

            'primary_account' =>
                $this->whenLoaded(
                    'primaryAccount',
                    function () {
                        return $this->primaryAccount
                            ? new SalesPurchaserAccountResource(
                                $this->primaryAccount
                            )
                            : null;
                    }
                ),

            'accounts' =>
                SalesPurchaserAccountResource::collection(
                    $this->whenLoaded(
                        'accounts'
                    )
                ),

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