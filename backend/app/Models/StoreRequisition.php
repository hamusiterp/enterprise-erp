<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class StoreRequisition extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sr_no',
        'request_type',
        'mr_requested',
        'used_for',
        'project_id',
        'used_for_department_id',
        'from_department_id',
        'to_location',
        'voucher_sr_type',
        'fuel_oil_source',
        'status',
        'workflow_instance_id',
        'fiscal_year_id',
        'requested_by',
        'requested_department_id',
        'sr_date',
        'posted_at',
        'posted_by',
        'sr_received_date',
        'sr_received_by',
    ];

    protected $casts = [
        'mr_requested' => 'boolean',
        'sr_date' => 'datetime',
        'posted_at' => 'datetime',
        'sr_received_date' => 'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(
            StoreRequisitionItem::class
        )->orderBy('line_no');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(
            Project::class
        );
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

    public function requestedDepartment(): BelongsTo
    {
        return $this->belongsTo(
            Department::class,
            'requested_department_id'
        );
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'requested_by'
        );
    }

    public function postedByUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'posted_by'
        );
    }

    public function workflowInstance(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowInstance::class
        );
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(
            FiscalYear::class
        );
    }

    public function receivedBy()
{
    return $this->belongsTo(
        User::class,
        'sr_received_by'
    );
}
}