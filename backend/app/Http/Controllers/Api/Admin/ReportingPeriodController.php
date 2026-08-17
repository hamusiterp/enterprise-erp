<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportingPeriodRequest;
use App\Http\Requests\UpdateReportingPeriodRequest;
use App\Models\ReportingPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportingPeriodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('reporting-periods.view'),
            403,
            'You do not have permission to view reporting periods.'
        );

        $query = ReportingPeriod::query()
            ->with('fiscalYear:id,name,code,start_date,end_date');

        if ($request->filled('fiscal_year_id')) {
            $query->where(
                'fiscal_year_id',
                $request->integer('fiscal_year_id')
            );
        }

        if ($request->filled('calendar_type')) {
            $query->where(
                'calendar_type',
                $request->string('calendar_type')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        $periods = $query
            ->orderBy('fiscal_year_id')
            ->orderBy('period_number')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $periods,
        ]);
    }

    public function store(
        StoreReportingPeriodRequest $request
    ): JsonResponse {
        $period = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            return ReportingPeriod::create($data);
        });

        return response()->json([
            'success' => true,
            'message' => 'Reporting period created successfully.',
            'data' => $period->load('fiscalYear'),
        ], 201);
    }

    public function show(
        Request $request,
        ReportingPeriod $reportingPeriod
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('reporting-periods.view'),
            403,
            'You do not have permission to view reporting periods.'
        );

        return response()->json([
            'success' => true,
            'data' => $reportingPeriod->load('fiscalYear'),
        ]);
    }

    public function update(
        UpdateReportingPeriodRequest $request,
        ReportingPeriod $reportingPeriod
    ): JsonResponse {
        $data = $request->validated();
        $data['updated_by'] = $request->user()->id;

        $reportingPeriod->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Reporting period updated successfully.',
            'data' => $reportingPeriod
                ->fresh()
                ->load('fiscalYear'),
        ]);
    }
}