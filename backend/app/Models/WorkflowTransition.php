<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTransition extends Model
{
    protected $fillable = [
        'workflow_definition_id',
        'from_state_id',
        'to_state_id',
        'action',
        'name',
        'permission_name',
        'is_return',
        'requires_remarks',
        'is_active',
        'sequence',
        'description',
    ];

    protected $casts = [
        'is_return' => 'boolean',
        'requires_remarks' => 'boolean',
        'is_active' => 'boolean',
        'sequence' => 'integer',
    ];

    public function workflowDefinition(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowDefinition::class
        );
    }

    public function fromState(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowState::class,
            'from_state_id'
        );
    }

    public function toState(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowState::class,
            'to_state_id'
        );
    }
}