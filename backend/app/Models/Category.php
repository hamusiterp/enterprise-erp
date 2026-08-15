<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sales_category';

    protected $fillable = [
        'category',
        'type',
        'status',
    ];

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
                        'category',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'type',
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

    public function suppliers()
{
    return $this->hasMany(
        SalesSupplier::class,
        'category_id'
    );
}
}