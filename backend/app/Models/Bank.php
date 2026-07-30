<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bank extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sales_bank';

    protected $fillable = [
        'bank_id',
        'bank_name',
        'bank_name_orginal',
        'account_no',
        'branch',
        'contact_address',
        'begnning_amount',
        'begnning__amount_left',
        'od_available',
        'start_date',
        'end_date',
        'od_amount',
        'od_amount_left',
        'min_amount',
        'od_limit',
        'od_status',
        'term_loan',
        'term_loan_start_date',
        'term_loan_end_date',
        'term_loan_amount',
        'transfer_rate',
        'repayment_amount',
        'repayment_amount_left',
        'term_loan_relief',
        'term_loan_relief_start_date',
        'term_loan_relief_end_date',
        'period',
        'ethiopian_date',
        'date_registered',
        'cob_balance',
        'status',
        'last_activity',
        'suggestion',
        'end_balance',
        'loan_status',
        'credit_suggestion',
        'category',
        'start_month',
    ];

    protected function casts(): array
    {
        return [
            'begnning_amount' => 'decimal:2',
            'begnning__amount_left' => 'decimal:2',
            'od_amount' => 'decimal:2',
            'od_amount_left' => 'decimal:2',
            'min_amount' => 'decimal:2',
            'term_loan_amount' => 'decimal:2',
            'transfer_rate' => 'decimal:2',
            'repayment_amount' => 'decimal:2',
        ];
    }

    public function scopeSearch(
        Builder $query,
        ?string $search
    ): Builder {
        if (!$search) {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('bank_id', 'ilike', "%{$search}%")
                ->orWhere('bank_name', 'ilike', "%{$search}%")
                ->orWhere('bank_name_orginal', 'ilike', "%{$search}%")
                ->orWhere('account_no', 'ilike', "%{$search}%")
                ->orWhere('branch', 'ilike', "%{$search}%")
                ->orWhere('contact_address', 'ilike', "%{$search}%");
        });
    }
}