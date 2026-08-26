<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTask extends Model
{
    protected $fillable = [
        'workflow_instance_id',
        'workflow_state_id',
        'assignment_type',
        'assigned_to_id',
        'assigned_to_key',
        'status',
        'received_by',
        'completed_by',
        'received_at',
        'started_at',
        'completed_at',
        'due_at',
        'remarks',
    ];

    protected $casts = [
        'assigned_to_id' => 'integer',
        'received_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'due_at' => 'datetime',
    ];

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowInstance::class
        );
    }

    public function workflowState(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowState::class
        );
    }
}