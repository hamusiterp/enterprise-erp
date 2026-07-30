<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDesignationRequest;
use App\Http\Requests\UpdateDesignationRequest;
use App\Http\Resources\DesignationResource;
use App\Models\Designation;
use App\Services\CodeGeneratorService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DesignationController extends Controller
{
    public function __construct(
        private readonly CodeGeneratorService $codeGenerator
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:150',
            ],

            'status' => [
                'nullable',
                Rule::in(['active', 'inactive']),
            ],

            'department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'level' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],

            'sort_by' => [
                'nullable',
                Rule::in([
                    'code',
                    'name',
                    'level',
                    'status',
                    'created_at',
                    'updated_at',
                ]),
            ],

            'sort_order' => [
                'nullable',
                Rule::in(['asc', 'desc']),
            ],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $query = Designation::query()
    ->with([
        'department:id,department_name',
    ])
            ->search($validated['search'] ?? null)
            ->when(
                $validated['status'] ?? null,
                fn (Builder $builder, string $status) =>
                    $builder->where('status', $status)
            )
            ->when(
                $validated['department_id'] ?? null,
                fn (Builder $builder, int $departmentId) =>
                    $builder->where(
                        'department_id',
                        $departmentId
                    )
            )
            ->when(
                $validated['level'] ?? null,
                fn (Builder $builder, int $level) =>
                    $builder->where('level', $level)
            )
            ->orderBy($sortBy, $sortOrder);

        $designations = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' =>
                'Designations retrieved successfully.',

            'data' => DesignationResource::collection(
                $designations->items()
            ),

            'pagination' => [
                'current_page' =>
                    $designations->currentPage(),

                'per_page' =>
                    $designations->perPage(),

                'total' =>
                    $designations->total(),

                'last_page' =>
                    $designations->lastPage(),

                'from' =>
                    $designations->firstItem(),

                'to' =>
                    $designations->lastItem(),
            ],
        ]);
    }

    public function store(
        StoreDesignationRequest $request
    ): JsonResponse {
        $designation = DB::transaction(function () use ($request) {
            $code = $this->codeGenerator->generate(
                table: 'designations',
                column: 'code',
                prefix: 'DES',
                padding: 3
            );

            return Designation::create([
                'code' => $code,
                'name' => $request->validated('name'),
                'department_id' =>
                    $request->validated('department_id'),

                'level' =>
                    $request->validated('level'),

                'status' =>
                    $request->validated('status'),

                'description' =>
                    $request->validated('description'),
            ]);
        });

        $designation->load('department');

        return response()->json([
            'success' => true,
            'message' =>
                'Designation created successfully.',

            'data' =>
                new DesignationResource($designation),
        ], 201);
    }

    public function show(
        Designation $designation
    ): JsonResponse {
        $designation->load('department');

        return response()->json([
            'success' => true,
            'data' =>
                new DesignationResource($designation),
        ]);
    }

    public function update(
        UpdateDesignationRequest $request,
        Designation $designation
    ): JsonResponse {
        $designation->update([
            'name' =>
                $request->validated('name'),

            'department_id' =>
                $request->validated('department_id'),

            'level' =>
                $request->validated('level'),

            'status' =>
                $request->validated('status'),

            'description' =>
                $request->validated('description'),
        ]);

        $designation->load('department');

        return response()->json([
            'success' => true,
            'message' =>
                'Designation updated successfully.',

            'data' =>
                new DesignationResource($designation),
        ]);
    }

    public function updateStatus(
        Request $request,
        Designation $designation
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        $designation->update([
            'status' => $validated['status'],
        ]);

        $designation->load('department');

        return response()->json([
            'success' => true,
            'message' =>
                'Designation status updated successfully.',

            'data' =>
                new DesignationResource($designation),
        ]);
    }

    public function destroy(
        Designation $designation
    ): JsonResponse {
        $designation->delete();

        return response()->json([
            'success' => true,
            'message' =>
                'Designation deleted successfully.',
        ]);
    }
}