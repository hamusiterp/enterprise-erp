<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cheque extends Model
{
    use SoftDeletes;

    protected $table = 'erp_cheque';

    protected $fillable = [
    'bank_id',
    'branch',
    'cheque_no',
    'signature_status',
    'status',

    'is_used',
    'used_reference_type',
    'used_reference_id',
    'used_at',

    'registered_by',
    'registered_by_user_id',
    'date_registered',

    'void_by',
    'void_by_user_id',
    'void_date',

    'active_by',
    'active_by_user_id',
    'active_date',
];

    protected $casts = [
    'is_used' => 'boolean',

    'date_registered' => 'date',
    'void_date' => 'date',
    'active_date' => 'date',

    'used_at' => 'datetime',
];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function bank(): BelongsTo
    {
        return $this->belongsTo(

            Bank::class,

            'bank_id'

        );
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(

            User::class,

            'registered_by_user_id'

        );
    }

    public function voidByUser(): BelongsTo
    {
        return $this->belongsTo(

            User::class,

            'void_by_user_id'

        );
    }

    public function activeByUser(): BelongsTo
    {
        return $this->belongsTo(

            User::class,

            'active_by_user_id'

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

    public function scopeVoid($query)
    {
        return $query->where(

            'status',

            'void'

        );
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getIsVoidAttribute(): bool
    {
        return $this->status === 'void';
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }
}