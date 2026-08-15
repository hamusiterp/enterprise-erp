<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesSubcontractor extends Model
{
    use SoftDeletes;

    protected $table = 'sales_subcontractor';

    protected $fillable = [
        'type',
        'firstname',
        'lastname',
        'company_name',
        'tin_no',
        'address',
        'contact_person',
        'phone_number',
        'tax_percent',
        'category_id',
        'status',

        'registered_by',
        'registered_by_user_id',
        'date_registered',
    ];

    protected $casts = [
        'tax_percent' => 'decimal:2',
        'date_registered' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class,
            'category_id'
        );
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where(
            'status',
            'active'
        );
    }

    public function scopeCompany($query)
    {
        return $query->where(
            'type',
            'company'
        );
    }

    public function scopeIndividual($query)
    {
        return $query->where(
            'type',
            'individual'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Display Name
    |--------------------------------------------------------------------------
    */

    public function getDisplayNameAttribute(): string
    {
        if ($this->type === 'company') {
            return $this->company_name ?? '';
        }

        return trim(
            ($this->firstname ?? '')
            . ' '
            . ($this->lastname ?? '')
        );
    }
}