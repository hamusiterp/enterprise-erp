<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentSequence extends Model
{
    protected $fillable = [
        'document_type',
        'name',
        'prefix',
        'fiscal_year_id',
        'current_number',
        'number_length',
        'format',
        'reset_per_fiscal_year',
        'is_active',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'current_number' => 'integer',
        'number_length' => 'integer',
        'reset_per_fiscal_year' => 'boolean',
        'is_active' => 'boolean',
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