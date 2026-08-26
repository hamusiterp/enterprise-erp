<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowInstance extends Model
{
    protected $fillable = [
        'workflow_definition_id',
        'subject_type',
        'subject_id',
        'reference_no',
        'current_state_id',
        'status',
        'started_by',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'subject_id' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function workflowDefinition(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowDefinition::class
        );
    }

    public function currentState(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowState::class,
            'current_state_id'
        );
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(
            WorkflowTask::class
        );
    }

    public function history(): HasMany
    {
        return $this->hasMany(
            WorkflowTaskHistory::class
        );
    }
}