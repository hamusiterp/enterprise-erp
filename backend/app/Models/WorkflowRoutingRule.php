<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowRoutingRule extends Model
{
    protected $fillable = [
        'workflow_definition_id',
        'workflow_state_id',
        'workflow_transition_id',
        'assignment_type',
        'assigned_to_id',
        'assigned_to_key',
        'assignment_mode',
        'sla_minutes',
        'is_active',
        'priority',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'assigned_to_id' => 'integer',
        'sla_minutes' => 'integer',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function workflowDefinition(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowDefinition::class
        );
    }

    public function workflowState(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowState::class
        );
    }

    public function workflowTransition(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowTransition::class
        );
    }
}