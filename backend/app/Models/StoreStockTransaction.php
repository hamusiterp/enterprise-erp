<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreStockTransaction extends Model
{
    protected $fillable = [
        'store_stock_id',
        'item_id',
        'transaction_type',
        'quantity',
        'balance_before',
        'balance_after',
        'reference_type',
        'reference_id',
        'reference_no',
        'remarks',
        'performed_by',
        'transaction_date',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:4',
            'balance_before' => 'decimal:4',
            'balance_after' => 'decimal:4',
            'transaction_date' => 'datetime',
        ];
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(
            StoreStock::class,
            'store_stock_id'
        );
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(
            Item::class,
            'item_id'
        );
    }

    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'performed_by'
        );
    }
}