<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Department;

class Designation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'department_id',
        'level',
        'status',
        'description',
    ];

    public function department()
    {
        return $this->belongsTo(
            Department::class,
            'department_id'
        );
    }

    public function scopeSearch(
        Builder $query,
        ?string $search
    ): Builder {
        if (blank($search)) {
            return $query;
        }

        $search = trim($search);

        return $query->where(function (Builder $query) use ($search) {
            $query
                ->where('code', 'ilike', "%{$search}%")
                ->orWhere('name', 'ilike', "%{$search}%")
                ->orWhere('description', 'ilike', "%{$search}%")
                ->orWhereHas('department', function (Builder $departmentQuery) use ($search) {
                    $departmentQuery
                        ->where('name', 'ilike', "%{$search}%")
                        ->orWhere('code', 'ilike', "%{$search}%");
                });
        });
    }
}