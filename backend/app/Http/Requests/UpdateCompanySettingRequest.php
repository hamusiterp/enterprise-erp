<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanySettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('company-settings.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:200'],
            'trading_name' => ['nullable', 'string', 'max:200'],
            'company_code' => ['nullable', 'string', 'max:50'],

            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'phone_2' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:200'],

            'country' => ['nullable', 'string', 'max:100'],
            'country_code' => ['nullable', 'string', 'max:10'],
            'city' => ['nullable', 'string', 'max:100'],
            'state_region' => ['nullable', 'string', 'max:150'],
            'address' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'string', 'max:30'],

            'tin_number' => ['nullable', 'string', 'max:100'],
            'vat_number' => ['nullable', 'string', 'max:100'],
            'registration_number' => ['nullable', 'string', 'max:100'],

            'default_currency' => ['required', 'string', 'max:10'],
            'timezone' => ['required', 'string', 'max:100'],
            'date_format' => ['required', 'string', 'max:30'],

            'print_header' => ['nullable', 'string', 'max:255'],
            'print_footer' => ['nullable', 'string'],

            'is_active' => ['required', 'boolean'],
        ];
    }
}