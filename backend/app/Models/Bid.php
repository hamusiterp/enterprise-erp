<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    protected $table = 'sales_bid';

    public $timestamps = false;

    protected $fillable = [
        'info_found',
        'nature_of_bid',
        'client',
        'published_date',
        'contractor_category',
        'bid_bond',
        'bid_bond_type',
        'project_type',
        'place_of_project',
        'bid_doc_price',
        'bid_purchase_place',
        'contact_address',
        'bid_sub_date',
        'bid_sub_time',
        'bid_opening_date',
        'bid_opening_time',
        'letter_app',
        'vat_registered',
        'tax_clear',
        'urban_dev',
        'business_license',
        'invest_permit',
        'tin_certificate',
        'certificate_of_comp',
        'quarry_license',
        'steel_wood_licence',
        'online_supplier_reg',
        'month',
        'status',
        'status_follow',
        'approved_by',
        'registered_by',
        'date_registered',
        'win_amount',
    ];

    public function scopeAvailableForProject(
        Builder $query
    ): Builder {
        return $query
            ->whereRaw(
                'LOWER(status_follow) = ?',
                ['win']
            )
            ->whereRaw(
                'LOWER(status) = ?',
                ['approved']
            );
    }
}