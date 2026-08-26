<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseRequisitionItem extends Model
{
    protected $fillable = [
        'purchase_requisition_id',
        'store_requisition_item_id',
        'item_id',
        'uom_id',
        'sr_qty',
        'available_qty',
        'pr_qty',
        'expected_delivery_date',
        'priority',
        'delivery_type',
        'remark',
    ];

    protected function casts(): array
    {
        return [
            'sr_qty' => 'decimal:4',
            'available_qty' => 'decimal:4',
            'pr_qty' => 'decimal:4',
            'expected_delivery_date' => 'date',
        ];
    }

    public function purchaseRequisition(): BelongsTo
    {
        return $this->belongsTo(
            PurchaseRequisition::class
        );
    }

    public function storeRequisitionItem(): BelongsTo
    {
        return $this->belongsTo(
            StoreRequisitionItem::class
        );
    }

    public function item(): BelongsTo
{
    return $this->belongsTo(
        Item::class,
        'item_id'
    );
}

public function uom(): BelongsTo
{
    return $this->belongsTo(
        UnitOfMeasurement::class,
        'uom_id'
    );
}
}