<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalesSupplierRequest;
use App\Http\Resources\SalesSupplierResource;
use App\Models\SalesSupplier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesSupplierController extends Controller
{
    /**
     * Columns allowed for server-side sorting.
     */
    private const SORTABLE_COLUMNS = [
        'id',
        'supplier_no',
        'supplier_name',
        'category_id',
        'address',
        'phone_number',
        'has_tin',
        'tin',
        'status',
        'registered_by',
        'date_registered',
        'approved_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Display a paginated list of suppliers.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],

            'category_id' => [
                'nullable',
                'integer',
                'exists:sales_category,id',
            ],

            'has_tin' => [
                'nullable',
                'boolean',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
                'nullable',
                'in:asc,desc',
            ],

            'sort_order' => [
                'nullable',
                'in:asc,desc',
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
        ]);

        $sortBy = $this->resolveSortColumn(
            $validated['sort_by'] ?? null
        );

        $sortDirection =
            $validated['sort_direction']
            ?? $validated['sort_order']
            ?? 'desc';

        $suppliers = $this
            ->buildFilteredQuery($validated)
            ->with('category')
            ->orderBy($sortBy, $sortDirection)
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $suppliers,
            'Suppliers loaded successfully.'
        );
    }

    /**
     * Store a newly created supplier.
     */
    public function store(
        SalesSupplierRequest $request
    ): JsonResponse {
        $supplier = DB::transaction(
            function () use ($request): SalesSupplier {
                /*
                 * Prevent duplicate supplier numbers when
                 * multiple users save simultaneously.
                 */
                DB::statement(
                    'SELECT pg_advisory_xact_lock(1004001)'
                );

                $data = $request->validated();

                /*
                 * Supplier number must always be generated
                 * by the backend.
                 */
                unset($data['supplier_no']);

                $data['supplier_no'] =
                    $this->generateNextSupplierNumber();

                $data['has_tin'] = filter_var(
                    $data['has_tin'] ?? false,
                    FILTER_VALIDATE_BOOLEAN
                );

                if (! $data['has_tin']) {
                    $data['tin'] = null;
                }

                $user = $request->user();

                $data['registered_by_user_id'] =
                    $user?->id;

                $data['registered_by'] =
                    $user?->name
                    ?? $user?->email
                    ?? 'System';

                $data['date_registered'] =
                    now()->toDateString();

                /*
                 * Approval workflow will be added later.
                 */
                $data['approved_by'] =
                    $data['approved_by'] ?? null;

                return SalesSupplier::create($data);
            }
        );

        $supplier->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier created successfully.',

            'data' =>
                new SalesSupplierResource($supplier),
        ], 201);
    }

    /**
     * Display one supplier.
     */
    public function show(
        SalesSupplier $salesSupplier
    ): JsonResponse {
        $salesSupplier->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier loaded successfully.',

            'data' =>
                new SalesSupplierResource(
                    $salesSupplier
                ),
        ]);
    }

    /**
     * Update an existing supplier.
     */
    public function update(
        SalesSupplierRequest $request,
        SalesSupplier $salesSupplier
    ): JsonResponse {
        $data = $request->validated();

        /*
         * These fields are controlled by the backend.
         */
        unset(
            $data['supplier_no'],
            $data['registered_by'],
            $data['registered_by_user_id'],
            $data['date_registered']
        );

        $data['has_tin'] = filter_var(
            $data['has_tin'] ?? false,
            FILTER_VALIDATE_BOOLEAN
        );

        if (! $data['has_tin']) {
            $data['tin'] = null;
        }

        $salesSupplier->update($data);

        $salesSupplier->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier updated successfully.',

            'data' =>
                new SalesSupplierResource(
                    $salesSupplier->fresh('category')
                ),
        ]);
    }

    /**
     * Soft-delete a supplier.
     */
    public function destroy(
        SalesSupplier $salesSupplier
    ): JsonResponse {
        $salesSupplier->delete();

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier moved to the recycle bin.',
        ]);
    }

    /**
     * Change supplier active/inactive status.
     */
    public function changeStatus(
        Request $request,
        SalesSupplier $salesSupplier
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $salesSupplier->update([
            'status' => $validated['status'],
        ]);

        $salesSupplier->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier status updated successfully.',

            'data' =>
                new SalesSupplierResource(
                    $salesSupplier
                ),
        ]);
    }

    /**
     * Return the next expected supplier number.
     *
     * This is for display only. The number is generated
     * again during store().
     */
    public function nextSupplierNumber(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'message' =>
                'Next supplier number loaded successfully.',

            'data' => [
                'supplier_no' =>
                    $this->generateNextSupplierNumber(),
            ],
        ]);
    }

    /**
     * Supplier summary statistics.
     */
    public function statistics(): JsonResponse
    {
        $statistics = SalesSupplier::query()
            ->selectRaw('COUNT(*) AS total')
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE status = 'active'
                ) AS active"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE status = 'inactive'
                ) AS inactive"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE has_tin = true
                ) AS with_tin"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE has_tin = false
                ) AS without_tin"
            )
            ->first();

        return response()->json([
            'success' => true,

            'data' => [
                'total' => (int) (
                    $statistics?->total ?? 0
                ),

                'active' => (int) (
                    $statistics?->active ?? 0
                ),

                'inactive' => (int) (
                    $statistics?->inactive ?? 0
                ),

                'with_tin' => (int) (
                    $statistics?->with_tin ?? 0
                ),

                'without_tin' => (int) (
                    $statistics?->without_tin ?? 0
                ),

                'deleted' =>
                    SalesSupplier::onlyTrashed()
                        ->count(),
            ],
        ]);
    }

    /**
     * Display suppliers in the recycle bin.
     */
    public function deleted(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
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
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $suppliers = SalesSupplier::onlyTrashed()
            ->with('category')
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $query->where(
                        function (
                            Builder $builder
                        ) use ($search): void {
                            $builder
                                ->where(
                                    'supplier_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'supplier_name',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tin',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'category',
                                    function (
                                        Builder $categoryQuery
                                    ) use ($search): void {
                                        $categoryQuery->where(
                                            'category',
                                            'ilike',
                                            "%{$search}%"
                                        );
                                    }
                                );
                        }
                    );
                }
            )
            ->orderByDesc('deleted_at')
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $suppliers,
            'Deleted suppliers loaded successfully.'
        );
    }

    /**
     * Restore a deleted supplier.
     */
    public function restore(int $id): JsonResponse
    {
        $supplier = SalesSupplier::onlyTrashed()
            ->findOrFail($id);

        $supplier->restore();

        $supplier->load('category');

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier restored successfully.',

            'data' =>
                new SalesSupplierResource($supplier),
        ]);
    }

    /**
     * Permanently delete a supplier.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $supplier = SalesSupplier::onlyTrashed()
            ->findOrFail($id);

        $supplier->forceDelete();

        return response()->json([
            'success' => true,

            'message' =>
                'Supplier permanently deleted.',
        ]);
    }

    /**
     * Export suppliers as an Excel-compatible CSV file.
     */
    public function export(
        Request $request
    ): StreamedResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],

            'category_id' => [
                'nullable',
                'integer',
                'exists:sales_category,id',
            ],

            'has_tin' => [
                'nullable',
                'boolean',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
                'nullable',
                'in:asc,desc',
            ],
        ]);

        $sortBy = $this->resolveSortColumn(
            $validated['sort_by'] ?? null
        );

        $sortDirection =
            $validated['sort_direction'] ?? 'asc';

        $fileName =
            'suppliers_'
            . now()->format('Y-m-d_H-i-s')
            . '.csv';

        return response()->streamDownload(
            function () use (
                $validated,
                $sortBy,
                $sortDirection
            ): void {
                $handle = fopen(
                    'php://output',
                    'wb'
                );

                if ($handle === false) {
                    return;
                }

                /*
                 * UTF-8 BOM improves compatibility with Excel.
                 */
                fwrite(
                    $handle,
                    "\xEF\xBB\xBF"
                );

                fputcsv($handle, [
                    'ID',
                    'Supplier Number',
                    'Supplier Name',
                    'Category',
                    'Address',
                    'Phone Number',
                    'Has TIN',
                    'TIN',
                    'Status',
                    'Registered By',
                    'Date Registered',
                    'Approved By',
                    'Created At',
                    'Updated At',
                ]);

                $this
                    ->buildFilteredQuery($validated)
                    ->with('category')
                    ->orderBy(
                        $sortBy,
                        $sortDirection
                    )
                    ->chunkById(
                        500,
                        function ($suppliers) use (
                            $handle
                        ): void {
                            foreach (
                                $suppliers as $supplier
                            ) {
                                fputcsv($handle, [
                                    $supplier->id,

                                    $supplier->supplier_no,

                                    $supplier->supplier_name,

                                    $supplier->category
                                        ?->category,

                                    $supplier->address,

                                    $supplier->phone_number,

                                    $supplier->has_tin
                                        ? 'Yes'
                                        : 'No',

                                    $supplier->tin,

                                    $supplier->status,

                                    $supplier->registered_by,

                                    $supplier->date_registered
                                        ?->format('Y-m-d'),

                                    $supplier->approved_by,

                                    $supplier->created_at
                                        ?->format(
                                            'Y-m-d H:i:s'
                                        ),

                                    $supplier->updated_at
                                        ?->format(
                                            'Y-m-d H:i:s'
                                        ),
                                ]);
                            }
                        }
                    );

                fclose($handle);
            },
            $fileName,
            [
                'Content-Type' =>
                    'text/csv; charset=UTF-8',
            ]
        );
    }

    /**
     * Build the filtered supplier query.
     */
    private function buildFilteredQuery(
        array $filters
    ): Builder {
        $search = trim(
            (string) (
                $filters['search'] ?? ''
            )
        );

        return SalesSupplier::query()
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $query->where(
                        function (
                            Builder $builder
                        ) use ($search): void {
                            $builder
                                ->where(
                                    'supplier_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'supplier_name',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tin',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'category',
                                    function (
                                        Builder $categoryQuery
                                    ) use ($search): void {
                                        $categoryQuery->where(
                                            'category',
                                            'ilike',
                                            "%{$search}%"
                                        );
                                    }
                                );
                        }
                    );
                }
            )
            ->when(
                $filters['status'] ?? null,
                fn (
                    Builder $query,
                    string $status
                ): Builder => $query->where(
                    'status',
                    $status
                )
            )
            ->when(
                $filters['category_id'] ?? null,
                fn (
                    Builder $query,
                    int|string $categoryId
                ): Builder => $query->where(
                    'category_id',
                    $categoryId
                )
            )
            ->when(
                array_key_exists(
                    'has_tin',
                    $filters
                )
                && $filters['has_tin'] !== null,
                fn (
                    Builder $query
                ): Builder => $query->where(
                    'has_tin',
                    filter_var(
                        $filters['has_tin'],
                        FILTER_VALIDATE_BOOLEAN
                    )
                )
            );
    }

    /**
     * Generate SUP000001, SUP000002, SUP000003...
     */
    private function generateNextSupplierNumber(): string
    {
        $lastNumber = SalesSupplier::withTrashed()
            ->where(
                'supplier_no',
                'like',
                'SUP%'
            )
            ->whereRaw(
                "SUBSTRING(supplier_no FROM 4) ~ '^[0-9]+$'"
            )
            ->selectRaw(
                '
                MAX(
                    CAST(
                        SUBSTRING(supplier_no FROM 4)
                        AS INTEGER
                    )
                ) AS max_number
                '
            )
            ->value('max_number');

        $nextNumber = max(
            (int) $lastNumber + 1,
            1
        );

        return 'SUP' . str_pad(
            (string) $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
        );
    }

    /**
     * Prevent arbitrary database-column sorting.
     */
    private function resolveSortColumn(
        ?string $sortBy
    ): string {
        if (
            $sortBy === null
            || ! in_array(
                $sortBy,
                self::SORTABLE_COLUMNS,
                true
            )
        ) {
            return 'id';
        }

        return $sortBy;
    }

    /**
     * Return pagination in the format expected by createCrudApi().
     */
    private function paginatedResponse(
        $paginator,
        string $message
    ): JsonResponse {
        $pagination = [
            'current_page' =>
                $paginator->currentPage(),

            'last_page' =>
                $paginator->lastPage(),

            'per_page' =>
                $paginator->perPage(),

            'total' =>
                $paginator->total(),

            'from' =>
                $paginator->firstItem(),

            'to' =>
                $paginator->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' => $message,

            'data' =>
                SalesSupplierResource::collection(
                    $paginator->items()
                ),

            'pagination' => $pagination,

            'meta' => $pagination,
        ]);
    }
}