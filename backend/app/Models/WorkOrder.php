<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    protected $table = 'sales_wor';

    public $timestamps = false;

    protected $fillable = [
        'source',
        'used_for',
        'from_department',
        'to_department',
        'category',
        'description',
        'work_order_no',
        'customer',
        'unit',
        'quantity',
        'project',
        'date_of_request',
        'work_location',
        'summery',
        'type_of_work',
        'priority',
        'e_d_date',
        'fa',
        'remark',
        'status',
        'registered_by',
        'date_registered',
        'proforma',
        'approved_by',
        'job_no',
    ];

    protected function casts(): array
    {
        return [
            'date_of_request' => 'date',
            'e_d_date' => 'date',
            'date_registered' => 'date',
        ];
    }

    public function scopeAvailableForProject(
        Builder $query
    ): Builder {
        return $query
            ->whereRaw(
                'LOWER(status) = ?',
                ['approved']
            )
            ->whereRaw(
                'LOWER(source) <> ?',
                ['ownuse']
            )
            ->whereNotNull('work_order_no')
            ->where('work_order_no', '<>', '');
    }
}