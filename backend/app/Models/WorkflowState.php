<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowState extends Model
{
    protected $fillable = [
        'workflow_definition_id',
        'code',
        'name',
        'sequence',
        'is_initial',
        'is_final',
        'is_editable',
        'is_active',
        'color',
        'description',
    ];

    protected $casts = [
        'sequence' => 'integer',
        'is_initial' => 'boolean',
        'is_final' => 'boolean',
        'is_editable' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function workflowDefinition(): BelongsTo
    {
        return $this->belongsTo(
            WorkflowDefinition::class
        );
    }

    public function outgoingTransitions(): HasMany
    {
        return $this->hasMany(
            WorkflowTransition::class,
            'from_state_id'
        )->orderBy('sequence');
    }

    public function incomingTransitions(): HasMany
    {
        return $this->hasMany(
            WorkflowTransition::class,
            'to_state_id'
        )->orderBy('sequence');
    }
}