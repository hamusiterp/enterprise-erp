<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreStock extends Model
{
    protected $fillable = [
        'item_id',
        'uom_id',
        'quantity_on_hand',
        'reserved_quantity',
        'available_quantity',
        'minimum_stock_level',
        'maximum_stock_level',
        'location',
        'status',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'quantity_on_hand' => 'decimal:4',
            'reserved_quantity' => 'decimal:4',
            'available_quantity' => 'decimal:4',
            'minimum_stock_level' => 'decimal:4',
            'maximum_stock_level' => 'decimal:4',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(
            Item::class,
            'item_id'
        );
    }

    public function unitOfMeasurement(): BelongsTo
    {
        return $this->belongsTo(
            UnitOfMeasurement::class,
            'uom_id'
        );
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(
            StoreStockTransaction::class,
            'store_stock_id'
        );
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}