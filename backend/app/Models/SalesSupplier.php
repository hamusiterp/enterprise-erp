<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;

class SalesSupplier extends Model
{
    use SoftDeletes;

    protected $table = 'sales_supplier';

    protected $fillable = [
        'supplier_no',
        'supplier_name',
        'category_id',
        'address',
        'phone_number',
        'has_tin',
        'tin',
        'registered_by',
        'registered_by_user_id',
        'date_registered',
        'status',
        'approved_by',
    ];

    protected $casts = [
        'has_tin' => 'boolean',
        'date_registered' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function category()
{
    return $this->belongsTo(
        Category::class,
        'category_id'
    );
}

    public function registeredBy()
    {
        return $this->belongsTo(
            User::class,
            'registered_by_user_id'
        );
    }
}