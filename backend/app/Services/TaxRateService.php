<?php

namespace App\Services;

use App\Models\TaxRate;
use Carbon\CarbonInterface;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class TaxRateService
{
    public function resolve(
        string $code,
        CarbonInterface|string|null $date = null,
        ?string $countryCode = null,
        ?int $fiscalYearId = null
    ): TaxRate {
        $date = $date
        ? Carbon::parse($date)
        : now();

        $query = TaxRate::query()
            ->where('code', $code)
            ->where('is_active', true)
            ->whereDate('effective_from', '<=', $date)
            ->where(function ($query) use ($date) {
                $query
                    ->whereNull('effective_to')
                    ->orWhereDate(
                        'effective_to',
                        '>=',
                        $date
                    );
            });

        if ($countryCode) {
            $query->where(function ($query) use ($countryCode) {
                $query
                    ->whereNull('country_code')
                    ->orWhere(
                        'country_code',
                        $countryCode
                    );
            });
        }

        if ($fiscalYearId) {
            $query->where(function ($query) use ($fiscalYearId) {
                $query
                    ->whereNull('fiscal_year_id')
                    ->orWhere(
                        'fiscal_year_id',
                        $fiscalYearId
                    );
            });
        }

        $rate = $query
            ->orderByDesc('fiscal_year_id')
            ->orderByDesc('country_code')
            ->orderByDesc('effective_from')
            ->first();

        if (!$rate) {
            throw ValidationException::withMessages([
                'tax_rate' =>
                    "No active tax rate is configured for {$code} on {$date->toDateString()}.",
            ]);
        }

        return $rate;
    }

    public function percentage(
        string $code,
        CarbonInterface|string|null $date = null,
        ?string $countryCode = null,
        ?int $fiscalYearId = null
    ): float {
        return (float) $this->resolve(
            $code,
            $date,
            $countryCode,
            $fiscalYearId
        )->rate;
    }

    public function calculate(
        float $baseAmount,
        TaxRate $taxRate
    ): float {
        return round(
            $baseAmount * ((float) $taxRate->rate / 100),
            2
        );
    }
}