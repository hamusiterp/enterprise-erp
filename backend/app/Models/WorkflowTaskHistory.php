<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTaskHistory extends Model
{
    protected $table = 'workflow_task_history';

    protected $fillable = [
        'workflow_instance_id',
        'workflow_task_id',
        'from_state_id',
        'to_state_id',
        'action',
        'performed_by',
        'performed_at',
        'remarks',
        'metadata',
    ];

    protected $casts = [
        'performed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowInstance::class
        );
    }

    public function workflowTask(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowTask::class
        );
    }
}