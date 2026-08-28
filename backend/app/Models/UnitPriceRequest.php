<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnitPriceRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'request_no',
        'request_date',
        'source_type',
        'source_id',
        'source_reference',
        'workflow_instance_id',
        'workflow_task_id',
        'status',
        'remarks',
        'requested_by',
        'requested_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'request_date' => 'date',
        'requested_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(UnitPriceRequestItem::class);
    }

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class);
    }

    public function workflowTask(): BelongsTo
    {
        return $this->belongsTo(WorkflowTask::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}