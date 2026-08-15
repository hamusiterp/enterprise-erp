<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesFixedAsset extends Model
{
    use SoftDeletes;

    protected $table = 'sales_fa';

    protected $fillable = [
        'asset_no',
        'vehicle_no',
        'tag_no',
        'plate_no',
        'category_id',

        'name_of_machinery',
        'make_of_vehicle',
        'model',
        'make_of_year',

        'chassis_no',
        'engine_no',
        'engine_model',
        'make_of_engine',
        'horse_power',

        'type_of_fuel',
        'reading_type',
        'reading',

        'consumption',
        'standard_consumption',
        'tanker_capacity',
        'last_refill',

        'has_gauge',
        'gauge_reading',

        'service_interval',
        'last_service',

        'purchase_date',
        'licence_renewal_date',
        'last_inspection_renewal_date',
        'last_insurance_renewal_date',

        'front_view_photo',
        'rear_view_photo',
        'right_side_view_photo',
        'left_side_view_photo',

        'libre_document',
        'inspection_document',
        'insurance_document',

        'asset_condition',
        'current_location',
        'assigned_to',
        'remarks',
        'status',

        'registered_by',
        'registered_by_user_id',
        'registered_date',

        'edited_by',
        'edited_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'horse_power' => 'decimal:2',
            'reading' => 'decimal:2',

            'consumption' => 'decimal:2',
            'standard_consumption' => 'decimal:2',
            'tanker_capacity' => 'decimal:2',

            'has_gauge' => 'boolean',
            'gauge_reading' => 'decimal:2',

            'service_interval' => 'integer',

            'last_refill' => 'date',
            'last_service' => 'date',

            'purchase_date' => 'date',
            'licence_renewal_date' => 'date',
            'last_inspection_renewal_date' => 'date',
            'last_insurance_renewal_date' => 'date',

            'registered_date' => 'date',

            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class,
            'category_id'
        );
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }

    public function editedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'edited_by_user_id'
        );
    }
}