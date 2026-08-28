<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequisition extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pr_no',
        'pr_date',
        'store_requisition_id',
        'workflow_instance_id',
        'used_for',
        'project_id',
        'used_for_department_id',
        'from_department_id',
        'to_location',
        'remarks',
        'status',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'pr_date' => 'date',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(
            PurchaseRequisitionItem::class
        );
    }

    public function storeRequisition(): BelongsTo
    {
        return $this->belongsTo(
            StoreRequisition::class
        );
    }

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowInstance::class
        );
    }

    public function project(): BelongsTo
{
    return $this->belongsTo(Project::class, 'project_id');
}

    public function usedForDepartment(): BelongsTo
    {
        return $this->belongsTo(
            Department::class,
            'used_for_department_id'
        );
    }

    public function fromDepartment(): BelongsTo
    {
        return $this->belongsTo(
            Department::class,
            'from_department_id'
        );
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}