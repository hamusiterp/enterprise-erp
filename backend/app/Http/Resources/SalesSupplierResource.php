<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesSupplierResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'supplier_no' => $this->supplier_no,

            'supplier_name' => $this->supplier_name,

            /*
            |--------------------------------------------------------------------------
            | Category
            |--------------------------------------------------------------------------
            */

            'category_id' => $this->category_id,

            'category' => $this->whenLoaded('category', function () {

                return [
                    'id'   => $this->category->id,
                    'name' => $this->category->category,
                    'type' => $this->category->type,
                ];

            }),

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */

            'address' => $this->address,

            'phone_number' => $this->phone_number,

            /*
            |--------------------------------------------------------------------------
            | Tax
            |--------------------------------------------------------------------------
            */

            'has_tin' => $this->has_tin,

            'tin' => $this->tin,

            /*
            |--------------------------------------------------------------------------
            | Registration
            |--------------------------------------------------------------------------
            */

            'registered_by' => $this->registered_by,

            'date_registered' => optional(
                $this->date_registered
            )->format('Y-m-d'),

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => $this->status,

            'approved_by' => $this->approved_by,

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            'created_at' => optional(
                $this->created_at
            )->format('Y-m-d H:i:s'),

            'updated_at' => optional(
                $this->updated_at
            )->format('Y-m-d H:i:s'),

        ];
    }
}