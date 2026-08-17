<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaxRateRequest;
use App\Http\Requests\UpdateTaxRateRequest;
use App\Models\TaxRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaxRateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('tax-rates.view'),
            403,
            'You do not have permission to view tax rates.'
        );

        $query = TaxRate::query()
            ->with('fiscalYear:id,name,code');

        if ($request->filled('type')) {
            $query->where(
                'type',
                $request->string('type')
            );
        }

        if ($request->filled('country_code')) {
            $query->where(
                'country_code',
                $request->string('country_code')
            );
        }

        if ($request->filled('fiscal_year_id')) {
            $query->where(
                'fiscal_year_id',
                $request->integer('fiscal_year_id')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        $taxRates = $query
            ->orderBy('code')
            ->orderByDesc('effective_from')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $taxRates,
        ]);
    }

    public function store(
        StoreTaxRateRequest $request
    ): JsonResponse {
        $taxRate = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            return TaxRate::create($data);
        });

        return response()->json([
            'success' => true,
            'message' => 'Tax rate created successfully.',
            'data' => $taxRate->load('fiscalYear'),
        ], 201);
    }

    public function show(
        Request $request,
        TaxRate $taxRate
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('tax-rates.view'),
            403,
            'You do not have permission to view tax rates.'
        );

        return response()->json([
            'success' => true,
            'data' => $taxRate->load('fiscalYear'),
        ]);
    }

    public function update(
        UpdateTaxRateRequest $request,
        TaxRate $taxRate
    ): JsonResponse {
        $data = $request->validated();

        $data['updated_by'] = $request->user()->id;

        $taxRate->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Tax rate updated successfully.',
            'data' => $taxRate
                ->fresh()
                ->load('fiscalYear'),
        ]);
    }
}