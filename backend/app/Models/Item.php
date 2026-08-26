<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\UnitOfMeasurement;
use Illuminate\Database\Eloquent\Relations\HasMany;
//use Spatie\Activitylog\LogOptions;
//use Spatie\Activitylog\Traits\LogsActivity;

class Item extends Model
{
    use HasFactory;
    //use LogsActivity;
    use SoftDeletes;

    protected $table = 'sales_item';

    protected $fillable = [
    'item_no',
    'item_description',
    'category',
    'uom_id',
    'unit',
    'status',
    'product_date',
    'type',
    'inventory',
    'registered_by',
    'registered_by_user_id',
    'date_registered',
];

    protected function casts(): array
    {
        return [
            'product_date' => 'date',
            'date_registered' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function unitOfMeasurement(): BelongsTo
{
    return $this->belongsTo(
        UnitOfMeasurement::class,
        'uom_id'
    );
}

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
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
                        'item_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'item_description',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'category',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'unit',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'type',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'inventory',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'registered_by',
                        'ilike',
                        "%{$search}%"
                    );
            }
        );
    }

    public function scopeActive(
        Builder $query
    ): Builder {
        return $query->where('status', 'active');
    }

    public function storeStocks(): HasMany
{
    return $this->hasMany(
        StoreStock::class,
        'item_id'
    );
}

   
}