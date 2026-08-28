<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnitPriceRequestItem extends Model
{
    protected $fillable = [
        'unit_price_request_id',
        'source_item_type',
        'source_item_id',
        'item_id',
        'uom_id',
        'quantity',
        'previous_unit_price',
        'unit_price',
        'vat_percentage',
        'tax_amount',
        'line_total',
        'grand_total',
        'supplier_id',
        'supplier_name',
        'supplier_stock',
        'status',
        'price_updated_by',
        'price_updated_at',
        'price_confirmed_by',
        'price_confirmed_at',
        'confirmation_notes',
        'is_out_of_stock',
        'out_of_stock_reason',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'previous_unit_price' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'vat_percentage' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'line_total' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'supplier_stock' => 'decimal:4',
        'is_out_of_stock' => 'boolean',
        'price_updated_at' => 'datetime',
        'price_confirmed_at' => 'datetime',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(UnitPriceRequest::class, 'unit_price_request_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function uom(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasurement::class, 'uom_id');
    }

    public function priceUpdatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'price_updated_by');
    }

    public function priceConfirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'price_confirmed_by');
    }
}