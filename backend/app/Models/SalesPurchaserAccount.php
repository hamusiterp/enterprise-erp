<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesPurchaserAccount extends Model
{
    use SoftDeletes;

    protected $table = 'sales_purchaser_account';

    protected $fillable = [
        'purchaser_id',
        'bank_id',
        'account_number',
        'account_name',
        'currency',
        'is_primary',
        'status',
        'registered_by',
        'registered_by_user_id',
        'date_registered',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'date_registered' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function purchaser(): BelongsTo
    {
        return $this->belongsTo(
            SalesPurchaser::class,
            'purchaser_id'
        );
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(
            Bank::class,
            'bank_id'
        );
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }
}