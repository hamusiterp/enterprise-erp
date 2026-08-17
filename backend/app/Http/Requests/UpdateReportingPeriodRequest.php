<?php

namespace App\Http\Requests;

use App\Models\FiscalYear;
use App\Models\ReportingPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateReportingPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('reporting-periods.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'fiscal_year_id' => [
                'required',
                'integer',
                'exists:fiscal_years,id',
            ],

            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'code' => [
                'required',
                'string',
                'max:30',
            ],

            'period_number' => [
                'required',
                'integer',
                'min:1',
            ],

            'start_date' => [
                'required',
                'date',
            ],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'calendar_type' => [
                'required',
                Rule::in([
                    'gregorian',
                    'ethiopian',
                    'custom',
                ]),
            ],

            'display_start_date' => [
                'nullable',
                'string',
                'max:50',
            ],

            'display_end_date' => [
                'nullable',
                'string',
                'max:50',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'is_closed' => [
                'required',
                'boolean',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if (
                    !$this->filled('fiscal_year_id') ||
                    !$this->filled('start_date') ||
                    !$this->filled('end_date')
                ) {
                    return;
                }

                $reportingPeriod = $this->route(
                    'reportingPeriod'
                );

                $reportingPeriodId =
                    $reportingPeriod instanceof ReportingPeriod
                        ? $reportingPeriod->id
                        : $reportingPeriod;

                $fiscalYear = FiscalYear::find(
                    $this->integer('fiscal_year_id')
                );

                if (!$fiscalYear) {
                    return;
                }

                $startDate = $this->input('start_date');
                $endDate = $this->input('end_date');

                if (
                    $startDate < $fiscalYear->start_date->toDateString() ||
                    $endDate > $fiscalYear->end_date->toDateString()
                ) {
                    $validator->errors()->add(
                        'start_date',
                        'Reporting period dates must fall inside the selected fiscal year.'
                    );
                }

                $overlapExists = ReportingPeriod::query()
                    ->where(
                        'fiscal_year_id',
                        $fiscalYear->id
                    )
                    ->where(
                        'id',
                        '!=',
                        $reportingPeriodId
                    )
                    ->whereDate(
                        'start_date',
                        '<=',
                        $endDate
                    )
                    ->whereDate(
                        'end_date',
                        '>=',
                        $startDate
                    )
                    ->exists();

                if ($overlapExists) {
                    $validator->errors()->add(
                        'start_date',
                        'The reporting period overlaps with an existing period.'
                    );
                }
            },
        ];
    }
}