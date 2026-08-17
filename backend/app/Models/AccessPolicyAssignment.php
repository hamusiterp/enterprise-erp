<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccessPolicyAssignment extends Model
{
    protected $fillable = [
        'access_policy_id',
        'target_type',
        'target_key',
        'target_id',
        'is_active',
        'effective_from',
        'effective_to',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'target_id' => 'integer',
        'is_active' => 'boolean',
        'effective_from' => 'datetime',
        'effective_to' => 'datetime',
    ];

    public function accessPolicy(): BelongsTo
    {
        return $this->belongsTo(AccessPolicy::class);
    }
}