<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesPurchaser extends Model
{
    use SoftDeletes;

    protected $table = 'sales_purchaser';

    protected $fillable = [
        'purchaser_no',
        'purchaser_name',
        'status',
        'registered_by',
        'registered_by_user_id',
        'date_registered',
    ];

    protected function casts(): array
    {
        return [
            'date_registered' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(
            SalesPurchaserAccount::class,
            'purchaser_id'
        );
    }

    public function activeAccounts(): HasMany
    {
        return $this->hasMany(
            SalesPurchaserAccount::class,
            'purchaser_id'
        )->where('status', 'active');
    }

    public function primaryAccount(): HasOne
    {
        return $this->hasOne(
            SalesPurchaserAccount::class,
            'purchaser_id'
        )->where('is_primary', true);
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }
}