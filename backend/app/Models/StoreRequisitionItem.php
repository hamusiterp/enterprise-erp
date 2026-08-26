<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreRequisitionItem extends Model
{
    protected $fillable = [
        'store_requisition_id',
        'item_id',
        'uom_id',
        'mr_date',
        'mr_no',
        'mr_qty',
        'sr_qty',
        'expected_delivery_date',
        'delivery_type',
        'priority',
        'urgency_reason',
        'remark',
        'available_qty',
        'issued_qty',
        'shortage_qty',
        'stock_status',
        'line_no',
    ];

    protected $casts = [
        'mr_date' => 'date',
        'mr_qty' => 'decimal:4',
        'sr_qty' => 'decimal:4',
        'expected_delivery_date' => 'date',
        'available_qty' => 'decimal:4',
        'issued_qty' => 'decimal:4',
        'shortage_qty' => 'decimal:4',
        'line_no' => 'integer',
    ];

    public function storeRequisition(): BelongsTo
    {
        return $this->belongsTo(
            StoreRequisition::class
        );
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(
            Item::class
        );
    }

    public function unitOfMeasurement(): BelongsTo
    {
        return $this->belongsTo(
            UnitOfMeasurement::class,
            'uom_id'
        );
    }

    public function stockCheckedBy()
{
    return $this->belongsTo(
        User::class,
        'stock_checked_by'
    );
}
}