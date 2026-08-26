<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnitOfMeasurement extends Model
{
    protected $table = 'units_of_measurement';

    protected $fillable = [
        'code',
        'name',
        'symbol',
        'category',
        'decimal_places',
        'is_active',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'decimal_places' => 'integer',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}