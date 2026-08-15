<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesSubcontractorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'type' => $this->type,

            'firstname' => $this->firstname,

            'lastname' => $this->lastname,

            'company_name' => $this->company_name,

            /*
             * One field the frontend can use
             * regardless of subcontractor type.
             */
            'display_name' => $this->display_name,

            'tin_no' => $this->tin_no,

            'address' => $this->address,

            'contact_person' => $this->contact_person,

            'phone_number' => $this->phone_number,

            'tax_percent' => (float) $this->tax_percent,

            'category_id' => $this->category_id,

            'category' => $this->whenLoaded(
                'category',
                function (): ?array {
                    if (! $this->category) {
                        return null;
                    }

                    return [
                        'id' => $this->category->id,
                        'name' => $this->category->category,
                        'type' => $this->category->type,
                        'status' => $this->category->status,
                    ];
                }
            ),

            'status' => $this->status,

            'registered_by' => $this->registered_by,

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