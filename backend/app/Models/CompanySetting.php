<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'trading_name',
        'company_code',
        'logo',
        'favicon',
        'email',
        'phone',
        'phone_2',
        'website',
        'country',
        'country_code',
        'city',
        'state_region',
        'address',
        'postal_code',
        'tin_number',
        'vat_number',
        'registration_number',
        'default_currency',
        'timezone',
        'date_format',
        'print_header',
        'print_footer',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}