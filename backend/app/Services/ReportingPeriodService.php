<?php

namespace App\Services;

use App\Models\ReportingPeriod;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Validation\ValidationException;

class ReportingPeriodService
{
    public function resolve(
        CarbonInterface|string $date,
        ?int $fiscalYearId = null
    ): ReportingPeriod {
        $date = $date instanceof CarbonInterface
            ? $date
            : Carbon::parse($date);

        $query = ReportingPeriod::query()
            ->where('is_active', true)
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date);

        if ($fiscalYearId) {
            $query->where(
                'fiscal_year_id',
                $fiscalYearId
            );
        }

        $period = $query
            ->orderBy('period_number')
            ->first();

        if (!$period) {
            throw ValidationException::withMessages([
                'reporting_period' =>
                    "No active reporting period is configured for {$date->toDateString()}.",
            ]);
        }

        return $period;
    }
}