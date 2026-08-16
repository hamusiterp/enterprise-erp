<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadCompanyBrandingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('company-settings.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'logo' => [
                'nullable',
                'image',
                'mimes:png,jpg,jpeg,webp',
                'max:2048',
            ],

            'favicon' => [
                'nullable',
                'image',
                'mimes:png,jpg,jpeg,webp,ico',
                'max:1024',
            ],
        ];
    }
}