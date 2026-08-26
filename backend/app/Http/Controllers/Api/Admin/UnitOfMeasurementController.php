<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\UnitOfMeasurement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UnitOfMeasurementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('units-of-measurement.view'),
            403,
            'You do not have permission to view units of measurement.'
        );

        $query = UnitOfMeasurement::query();

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($query) use ($search) {
                $query
                    ->where('code', 'ilike', "%{$search}%")
                    ->orWhere('name', 'ilike', "%{$search}%")
                    ->orWhere('symbol', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where(
                'category',
                $request->string('category')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        $units = $query
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $units,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('units-of-measurement.manage'),
            403,
            'You do not have permission to manage units of measurement.'
        );

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:30',
                'unique:units_of_measurement,code',
            ],

            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'symbol' => [
                'nullable',
                'string',
                'max:30',
            ],

            'category' => [
                'nullable',
                Rule::in([
                    'quantity',
                    'weight',
                    'volume',
                    'length',
                    'area',
                    'package',
                    'other',
                ]),
            ],

            'decimal_places' => [
                'required',
                'integer',
                'min:0',
                'max:6',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $unit = DB::transaction(function () use (
            $validated,
            $request
        ) {
            return UnitOfMeasurement::create([
                ...$validated,
                'code' => strtoupper(
                    trim($validated['code'])
                ),
                'created_by' =>
                    $request->user()->id,
                'updated_by' =>
                    $request->user()->id,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' =>
                'Unit of measurement created successfully.',
            'data' => $unit,
        ], 201);
    }

    public function update(
        Request $request,
        UnitOfMeasurement $unitOfMeasurement
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('units-of-measurement.manage'),
            403,
            'You do not have permission to manage units of measurement.'
        );

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:30',

                Rule::unique(
                    'units_of_measurement',
                    'code'
                )->ignore(
                    $unitOfMeasurement->id
                ),
            ],

            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'symbol' => [
                'nullable',
                'string',
                'max:30',
            ],

            'category' => [
                'nullable',
                Rule::in([
                    'quantity',
                    'weight',
                    'volume',
                    'length',
                    'area',
                    'package',
                    'other',
                ]),
            ],

            'decimal_places' => [
                'required',
                'integer',
                'min:0',
                'max:6',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $unitOfMeasurement->update([
            ...$validated,
            'code' => strtoupper(
                trim($validated['code'])
            ),
            'updated_by' =>
                $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Unit of measurement updated successfully.',
            'data' =>
                $unitOfMeasurement->fresh(),
        ]);
    }
}