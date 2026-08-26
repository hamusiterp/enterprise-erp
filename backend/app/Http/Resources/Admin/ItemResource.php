<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' =>
                $this->id,

            'item_no' =>
                $this->item_no,

            'item_description' =>
                $this->item_description,

            'category' =>
                $this->category,

            /*
             * New UOM relationship
             */
            'uom_id' =>
                $this->uom_id,

            'uom' => $this->unitOfMeasurement
                ? [
                    'id' =>
                        $this->unitOfMeasurement->id,

                    'code' =>
                        $this->unitOfMeasurement->code,

                    'name' =>
                        $this->unitOfMeasurement->name,

                    'symbol' =>
                        $this->unitOfMeasurement->symbol,

                    'decimal_places' =>
                        $this->unitOfMeasurement->decimal_places,
                ]
                : null,

            /*
             * Keep legacy value temporarily.
             */
            'unit' =>
                $this->unit,

            'status' =>
                $this->status,

            'product_date' =>
                $this->product_date
                    ?->format('Y-m-d'),

            'type' =>
                $this->type,

            'inventory' =>
                $this->inventory,

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