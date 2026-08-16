<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CompanySettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'company_name' => $this->company_name,
            'trading_name' => $this->trading_name,
            'company_code' => $this->company_code,

            'logo' => $this->logo,
            'logo_url' => $this->logo
                ? Storage::disk('public')->url($this->logo)
                : null,

            'favicon' => $this->favicon,
            'favicon_url' => $this->favicon
                ? Storage::disk('public')->url($this->favicon)
                : null,

            'email' => $this->email,
            'phone' => $this->phone,
            'phone_2' => $this->phone_2,
            'website' => $this->website,

            'country' => $this->country,
            'country_code' => $this->country_code,
            'city' => $this->city,
            'state_region' => $this->state_region,
            'address' => $this->address,
            'postal_code' => $this->postal_code,

            'tin_number' => $this->tin_number,
            'vat_number' => $this->vat_number,
            'registration_number' => $this->registration_number,

            'default_currency' => $this->default_currency,
            'timezone' => $this->timezone,
            'date_format' => $this->date_format,

            'print_header' => $this->print_header,
            'print_footer' => $this->print_footer,

            'is_active' => $this->is_active,

            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}