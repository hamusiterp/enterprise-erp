<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sales_project';

    protected $fillable = [
        'project_no',
        'project_source',
        'bid_reference',
        'work_order_no',
        'project_name',
        'project_name_letter',
        'project_description',
        'location',
        'customer_id',
        'employer',
        'has_consultant',
        'consultant',
        'has_specified_area',
        'area',
        'construction_project_type',
        'business_unit',
        'contract_type',
        'contract_amount_before_vat',
        'contract_pricing_type',
        'contract_date',
'has_site_handover_date',
'site_handover_date',
'has_commencement_date',
'commencement_date',
'project_duration',
'duration_type',
'no_of_holidays',
'payment_term',
'has_advance_payment',
'advance_percent',
'has_advance_repayment',
'advance_repayment_complete_percent',
'advance_repayment_percent',
'advance_repayment_start',
'interim_payment_schedule',
'advance_payment_due_date',
'has_advance_bond',
'advance_bond_percent',
'advance_bond_type',
'advance_bond_start_date',
'advance_bond_end_date',

'has_performance_bond',
'performance_bond_percent',
'performance_bond_type',
'performance_bond_start_date',
'performance_bond_end_date',
'has_price_adjustment',
'price_adjustment_percent',

'has_retention',
'retention_percent',

'has_price_index',

'has_liquidity_damage',
'liquidity_percent',
'liquidity_limit',

'minimum_payment_time',
'engineering_facilities',
        'status',
        'registered_by',
        'registered_by_user_id',
        'date_registered',
    ];

    protected function casts(): array
    {
        return [
            'has_consultant' => 'boolean',
            'has_specified_area' => 'boolean',
            'contract_amount_before_vat' => 'decimal:2',
            'contract_date' => 'date',
'has_site_handover_date' => 'boolean',
'site_handover_date' => 'date',
'has_commencement_date' => 'boolean',
'commencement_date' => 'date',
'project_duration' => 'integer',
'no_of_holidays' => 'integer',
'has_advance_payment' => 'boolean',
'advance_percent' => 'decimal:2',

'has_advance_repayment' => 'boolean',
'advance_repayment_complete_percent' => 'decimal:2',
'advance_repayment_percent' => 'decimal:2',

'interim_payment_schedule' => 'integer',
'advance_payment_due_date' => 'date',
'has_advance_bond' => 'boolean',
'advance_bond_percent' => 'decimal:2',
'advance_bond_start_date' => 'date',
'advance_bond_end_date' => 'date',

'has_performance_bond' => 'boolean',
'performance_bond_percent' => 'decimal:2',
'performance_bond_start_date' => 'date',
'performance_bond_end_date' => 'date',
'has_price_adjustment' => 'boolean',
'price_adjustment_percent' => 'decimal:2',

'has_retention' => 'boolean',
'retention_percent' => 'decimal:2',

'has_price_index' => 'boolean',

'has_liquidity_damage' => 'boolean',
'liquidity_percent' => 'decimal:2',
'liquidity_limit' => 'decimal:2',

'minimum_payment_time' => 'integer',
'engineering_facilities' => 'array',
            'date_registered' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(
            Customer::class,
            'customer_id'
        );
    }

    public function scopeSearch(
        Builder $query,
        ?string $search
    ): Builder {
        $search = trim((string) $search);

        if ($search === '') {
            return $query;
        }

        return $query->where(
            function (Builder $builder) use ($search): void {
                $builder
                    ->where(
                        'project_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'project_name',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'project_description',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'location',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'employer',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'bid_reference',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'work_order_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'consultant',
                        'ilike',
                        "%{$search}%"
                    );
            }
        );
    }

    public function scopeActive(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'active'
        );
    }
}