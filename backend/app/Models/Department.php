<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Department extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'department_id',
        'department_name',
        'description',
        'status',
        'registered_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by'
        );
    }

    public function users(): BelongsToMany
{
    return $this->belongsToMany(
        User::class,
        'user_departments'
    )
        ->withPivot([
            'is_primary',
            'is_active',
            'effective_from',
            'effective_to',
        ])
        ->withTimestamps();
}
}