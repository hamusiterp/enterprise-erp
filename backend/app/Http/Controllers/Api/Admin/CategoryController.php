<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\Admin\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CategoryController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'category',
        'type',
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function index(
        Request $request
    ): JsonResponse {
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

            'type' => [
                'nullable',
                'string',
                'max:20',
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

        $categories = $this
            ->buildFilteredQuery($validated)
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $categories,
            'Categories loaded successfully.'
        );
    }

    public function store(
        CategoryRequest $request
    ): JsonResponse {
        $category = Category::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Category created successfully.',

            'data' => new CategoryResource(
                $category
            ),
        ], 201);
    }

    public function show(
        Category $category
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' =>
                'Category loaded successfully.',

            'data' =>
                new CategoryResource($category),
        ]);
    }

    public function update(
        CategoryRequest $request,
        Category $category
    ): JsonResponse {
        $category->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Category updated successfully.',

            'data' => new CategoryResource(
                $category->fresh()
            ),
        ]);
    }

    public function destroy(
        Category $category
    ): JsonResponse {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' =>
                'Category moved to the recycle bin.',
        ]);
    }

    public function changeStatus(
        Request $request,
        Category $category
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $category->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Category status updated successfully.',

            'data' => new CategoryResource(
                $category->fresh()
            ),
        ]);
    }

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

        $categories = Category::onlyTrashed()
            ->search(
                $validated['search'] ?? null
            )
            ->orderByDesc('deleted_at')
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $categories,
            'Deleted categories loaded successfully.'
        );
    }

    public function restore(
        int $id
    ): JsonResponse {
        $category = Category::onlyTrashed()
            ->findOrFail($id);

        $category->restore();

        return response()->json([
            'success' => true,
            'message' =>
                'Category restored successfully.',

            'data' => new CategoryResource(
                $category->fresh()
            ),
        ]);
    }

    public function forceDelete(
        int $id
    ): JsonResponse {
        $category = Category::onlyTrashed()
            ->findOrFail($id);

        $category->forceDelete();

        return response()->json([
            'success' => true,
            'message' =>
                'Category permanently deleted.',
        ]);
    }

    public function statistics(): JsonResponse
    {
        $statistics = Category::query()
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

                'deleted' =>
                    Category::onlyTrashed()->count(),
            ],
        ]);
    }

    /**
     * Used by Supplier and other forms.
     */
    public function options(Request $request): JsonResponse
{
    $validated = $request->validate([
        'type' => [
            'nullable',
            'string',
            'max:20',
        ],

        'search' => [
            'nullable',
            'string',
            'max:200',
        ],
    ]);

    $type = strtolower(
        trim((string) ($validated['type'] ?? ''))
    );

    $search = trim(
        (string) ($validated['search'] ?? '')
    );

    $categories = Category::query()
        ->whereRaw(
            'LOWER(status) = ?',
            ['active']
        )
        ->when(
            $type !== '',
            function (Builder $query) use ($type): void {
                $query->whereRaw(
                    'LOWER(type) = ?',
                    [$type]
                );
            }
        )
        ->when(
            $search !== '',
            function (Builder $query) use ($search): void {
                $query->where(
                    function (Builder $builder) use ($search): void {
                        $builder
                            ->where(
                                'category',
                                'ilike',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'type',
                                'ilike',
                                "%{$search}%"
                            );
                    }
                );
            }
        )
        ->orderBy('category')
        ->get()
        ->map(
            fn (Category $category): array => [
                'value' => $category->id,
                'label' => $category->category,
                'id' => $category->id,
                'category' => $category->category,
                'name' => $category->category,
                'type' => $category->type,
            ]
        )
        ->values();

    return response()->json([
        'success' => true,
        'message' => 'Category options loaded successfully.',
        'data' => $categories,
    ]);
}

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

            'type' => [
                'nullable',
                'string',
                'max:20',
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
            $validated['sort_direction']
            ?? 'asc';

        $fileName =
            'categories_'
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

                fwrite(
                    $handle,
                    "\xEF\xBB\xBF"
                );

                fputcsv($handle, [
                    'ID',
                    'Category',
                    'Type',
                    'Status',
                    'Created At',
                    'Updated At',
                ]);

                $this
                    ->buildFilteredQuery($validated)
                    ->orderBy(
                        $sortBy,
                        $sortDirection
                    )
                    ->chunkById(
                        500,
                        function ($categories) use (
                            $handle
                        ): void {
                            foreach (
                                $categories as $category
                            ) {
                                fputcsv($handle, [
                                    $category->id,
                                    $category->category,
                                    $category->type,
                                    $category->status,

                                    $category->created_at
                                        ?->format(
                                            'Y-m-d H:i:s'
                                        ),

                                    $category->updated_at
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

    private function buildFilteredQuery(
        array $filters
    ): Builder {
        return Category::query()
            ->search(
                $filters['search'] ?? null
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
                $filters['type'] ?? null,
                fn (
                    Builder $query,
                    string $type
                ): Builder => $query->where(
                    'type',
                    $type
                )
            );
    }

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

            'data' => CategoryResource::collection(
                $paginator->items()
            ),

            'pagination' => $pagination,
            'meta' => $pagination,
        ]);
    }
}