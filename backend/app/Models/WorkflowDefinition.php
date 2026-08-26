<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowDefinition extends Model
{
    protected $fillable = [
        'code',
        'name',
        'module_key',
        'description',
        'version',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_active' => 'boolean',
    ];

    public function states(): HasMany
    {
        return $this->hasMany(
            WorkflowState::class
        )->orderBy('sequence');
    }

    public function transitions(): HasMany
    {
        return $this->hasMany(
            WorkflowTransition::class
        )->orderBy('sequence');
    }
}