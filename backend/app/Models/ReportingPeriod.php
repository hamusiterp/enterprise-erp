<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportingPeriod extends Model
{
    protected $fillable = [
        'fiscal_year_id',
        'name',
        'code',
        'period_number',
        'start_date',
        'end_date',
        'calendar_type',
        'display_start_date',
        'display_end_date',
        'is_active',
        'is_closed',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'period_number' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_closed' => 'boolean',
    ];

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
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