<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFiscalYearRequest;
use App\Http\Requests\UpdateFiscalYearRequest;
use App\Models\FiscalYear;
use App\Services\FiscalYearService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FiscalYearController extends Controller
{
    public function __construct(
        private readonly FiscalYearService $fiscalYearService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('fiscal-years.view'),
            403,
            'You do not have permission to view fiscal years.'
        );

        $fiscalYears = FiscalYear::query()
            ->orderByDesc('start_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $fiscalYears,
        ]);
    }

    public function store(
        StoreFiscalYearRequest $request
    ): JsonResponse {
        $fiscalYear = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $makeCurrent = (bool) ($data['is_current'] ?? false);

            unset($data['is_current']);

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            $fiscalYear = FiscalYear::create($data);

            if ($makeCurrent) {
                return $this->fiscalYearService
                    ->setCurrent($fiscalYear);
            }

            return $fiscalYear;
        });

        return response()->json([
            'success' => true,
            'message' => 'Fiscal year created successfully.',
            'data' => $fiscalYear,
        ], 201);
    }

    public function show(
        Request $request,
        FiscalYear $fiscalYear
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('fiscal-years.view'),
            403,
            'You do not have permission to view fiscal years.'
        );

        return response()->json([
            'success' => true,
            'data' => $fiscalYear,
        ]);
    }

    public function update(
        UpdateFiscalYearRequest $request,
        FiscalYear $fiscalYear
    ): JsonResponse {
        if ($fiscalYear->is_locked) {
            return response()->json([
                'success' => false,
                'message' => 'Locked fiscal year cannot be edited.',
            ], 422);
        }

        $fiscalYear->update([
            ...$request->validated(),
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fiscal year updated successfully.',
            'data' => $fiscalYear->fresh(),
        ]);
    }

    public function setCurrent(
        Request $request,
        FiscalYear $fiscalYear
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('fiscal-years.manage'),
            403,
            'You do not have permission to manage fiscal years.'
        );

        $fiscalYear->updated_by = $request->user()->id;
        $fiscalYear->save();

        $fiscalYear = $this->fiscalYearService
            ->setCurrent($fiscalYear);

        return response()->json([
            'success' => true,
            'message' => 'Current fiscal year updated successfully.',
            'data' => $fiscalYear,
        ]);
    }

    public function close(
        Request $request,
        FiscalYear $fiscalYear
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('fiscal-years.close'),
            403,
            'You do not have permission to close fiscal years.'
        );

        $fiscalYear->updated_by = $request->user()->id;
        $fiscalYear->save();

        $fiscalYear = $this->fiscalYearService
            ->close($fiscalYear);

        return response()->json([
            'success' => true,
            'message' => 'Fiscal year closed successfully.',
            'data' => $fiscalYear,
        ]);
    }

    public function lock(
        Request $request,
        FiscalYear $fiscalYear
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('fiscal-years.lock'),
            403,
            'You do not have permission to lock fiscal years.'
        );

        $fiscalYear->updated_by = $request->user()->id;
        $fiscalYear->save();

        $fiscalYear = $this->fiscalYearService
            ->lock($fiscalYear);

        return response()->json([
            'success' => true,
            'message' => 'Fiscal year locked successfully.',
            'data' => $fiscalYear,
        ]);
    }

    public function copySequences(
    Request $request,
    FiscalYear $fiscalYear
): JsonResponse {
    abort_unless(
        $request->user()?->can('document-sequences.manage'),
        403,
        'You do not have permission to manage document sequences.'
    );

    $validated = $request->validate([
        'source_fiscal_year_id' => [
            'required',
            'integer',
            'exists:fiscal_years,id',
            'different:' . $fiscalYear->id,
        ],
    ]);

    $sourceFiscalYear = FiscalYear::findOrFail(
        $validated['source_fiscal_year_id']
    );

    $created = $this->fiscalYearService
        ->cloneDocumentSequences(
            $sourceFiscalYear,
            $fiscalYear
        );

    return response()->json([
        'success' => true,
        'message' => $created > 0
            ? "{$created} document sequence(s) copied successfully."
            : 'No new document sequences were copied.',
        'data' => [
            'created_count' => $created,
        ],
    ]);
}
}