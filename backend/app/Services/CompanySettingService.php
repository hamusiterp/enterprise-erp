<?php

namespace App\Services;

use App\Models\CompanySetting;

class CompanySettingService
{
    public function get(): ?CompanySetting
    {
        return CompanySetting::query()
            ->where('is_active', true)
            ->first();
    }

    public function getOrCreate(): CompanySetting
    {
        return CompanySetting::query()->firstOrCreate(
            [],
            [
                'company_name' => 'Enterprise ERP',
                'default_currency' => 'ETB',
                'timezone' => 'Africa/Addis_Ababa',
                'date_format' => 'Y-m-d',
                'is_active' => true,
            ]
        );
    }
}