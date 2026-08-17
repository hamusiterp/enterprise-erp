<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccessPolicy extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'policy_type',
        'is_active',
        'priority',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(AccessPolicySchedule::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(AccessPolicyAssignment::class);
    }
}