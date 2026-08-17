<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccessPolicySchedule extends Model
{
    protected $fillable = [
        'access_policy_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_allowed_day',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_allowed_day' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function accessPolicy(): BelongsTo
    {
        return $this->belongsTo(AccessPolicy::class);
    }
}