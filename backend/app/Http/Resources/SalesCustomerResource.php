<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesCustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'customer_no' => $this->customer_no,

            'customer_type' => $this->customer_type,

            /*
            |--------------------------------------------------------------------------
            | Customer Name
            |--------------------------------------------------------------------------
            */

            'firstname' => $this->firstname,

            'lastname' => $this->lastname,

            'company_name' => $this->company_name,

            /*
             * Individual:
             * First Name + Last Name
             *
             * Company:
             * Company Name
             */
            'display_name' => $this->display_name,

            /*
            |--------------------------------------------------------------------------
            | Contact Information
            |--------------------------------------------------------------------------
            */

            'email_address' => $this->email_address,

            'contact_person' => $this->contact_person,

            'phone_number' => $this->phone_number,

            'location' => $this->location,

            /*
            |--------------------------------------------------------------------------
            | Tax Information
            |--------------------------------------------------------------------------
            */

            'tin_number' => $this->tin_number,

            'withhold' => $this->withhold,

            'withhold_percent' =>
                $this->withhold_percent,

            'withhold_from_advance' =>
                $this->withhold_from_advance,

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'customer_status' =>
                $this->customer_status,

            /*
            |--------------------------------------------------------------------------
            | Registration
            |--------------------------------------------------------------------------
            */

            'registered_by' =>
                $this->registered_by,

            'registered_by_user_id' =>
                $this->registered_by_user_id,

            'date_registered' =>
                $this->date_registered
                    ?->format('Y-m-d'),

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

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