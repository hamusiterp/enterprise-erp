<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesCustomer extends Model
{
    use SoftDeletes;

    protected $table = 'sales_customer';

    protected $fillable = [
        'customer_no',
        'customer_type',
        'firstname',
        'lastname',
        'company_name',
        'email_address',
        'tin_number',
        'contact_person',
        'phone_number',
        'customer_status',
        'withhold',
        'withhold_percent',
        'location',
        'withhold_from_advance',
        'registered_by',
        'registered_by_user_id',
        'date_registered',
    ];

    protected function casts(): array
    {
        return [
            'withhold' => 'boolean',
            'withhold_percent' => 'decimal:2',
            'withhold_from_advance' => 'boolean',
            'date_registered' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->customer_type === 'company') {
            return trim((string) $this->company_name);
        }

        return trim(
            implode(' ', array_filter([
                $this->firstname,
                $this->lastname,
            ]))
        );
    }
}