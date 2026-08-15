<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSalesSubcontractorRequest;
use App\Http\Requests\UpdateSalesSubcontractorRequest;
use App\Http\Resources\SalesSubcontractorResource;
use App\Models\SalesSubcontractor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesSubcontractorController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'type',
        'firstname',
        'lastname',
        'company_name',
        'tin_no',
        'phone_number',
        'tax_percent',
        'category_id',
        'status',
        'date_registered',
        'created_at',
        'updated_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'type' => [
                'nullable',
                'in:company,individual',
            ],

            'category_id' => [
                'nullable',
                'integer',
            ],

            'tax_percent' => [
                'nullable',
                'numeric',
                'in:0,2,10,15',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],

            'sort_by' => [
                'nullable',
                'string',
            ],

            'sort_direction' => [
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
            ?? 'desc';

        $subcontractors = $this
            ->buildFilteredQuery($validated)
            ->with([
                'category',
                'registeredByUser',
            ])
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->paginate(
                $validated['per_page']
                ?? 10
            );

        $pagination = [
            'current_page' =>
                $subcontractors->currentPage(),

            'last_page' =>
                $subcontractors->lastPage(),

            'per_page' =>
                $subcontractors->perPage(),

            'total' =>
                $subcontractors->total(),

            'from' =>
                $subcontractors->firstItem(),

            'to' =>
                $subcontractors->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractors loaded successfully.',

            'data' =>
                SalesSubcontractorResource::collection(
                    $subcontractors->items()
                ),

            'pagination' =>
                $pagination,

            'meta' =>
                $pagination,
        ]);
    }

    public function store(
        StoreSalesSubcontractorRequest $request
    ): JsonResponse {
        $subcontractor = DB::transaction(
            function () use ($request): SalesSubcontractor {
                $data =
                    $request->validated();

                $user =
                    $request->user();

                $data['registered_by'] =
                    $user?->name
                    ?? $user?->email
                    ?? 'System';

                $data[
                    'registered_by_user_id'
                ] = $user?->id;

                $data['date_registered'] =
                    now()->toDateString();

                return SalesSubcontractor::create(
                    $data
                );
            }
        );

        $subcontractor->load([
            'category',
            'registeredByUser',
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractor created successfully.',

            'data' =>
                new SalesSubcontractorResource(
                    $subcontractor
                ),
        ], 201);
    }

    public function show(
        SalesSubcontractor $salesSubcontractor
    ): JsonResponse {
        $salesSubcontractor->load([
            'category',
            'registeredByUser',
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractor loaded successfully.',

            'data' =>
                new SalesSubcontractorResource(
                    $salesSubcontractor
                ),
        ]);
    }

    public function update(
        UpdateSalesSubcontractorRequest $request,
        SalesSubcontractor $salesSubcontractor
    ): JsonResponse {
        DB::transaction(
            function () use (
                $request,
                $salesSubcontractor
            ): void {
                $salesSubcontractor->update(
                    $request->validated()
                );
            }
        );

        $salesSubcontractor->load([
            'category',
            'registeredByUser',
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractor updated successfully.',

            'data' =>
                new SalesSubcontractorResource(
                    $salesSubcontractor
                        ->fresh([
                            'category',
                            'registeredByUser',
                        ])
                ),
        ]);
    }

    public function destroy(
        SalesSubcontractor $salesSubcontractor
    ): JsonResponse {
        $salesSubcontractor->delete();

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractor moved to the recycle bin.',
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

        $search = trim(
            (string) (
                $validated['search']
                ?? ''
            )
        );

        $query =
            SalesSubcontractor::onlyTrashed()
                ->with([
                    'category',
                    'registeredByUser',
                ]);

        if ($search !== '') {
            $this->applySearch(
                $query,
                $search
            );
        }

        $subcontractors = $query
            ->orderByDesc(
                'deleted_at'
            )
            ->paginate(
                $validated['per_page']
                ?? 10
            );

        $pagination = [
            'current_page' =>
                $subcontractors->currentPage(),

            'last_page' =>
                $subcontractors->lastPage(),

            'per_page' =>
                $subcontractors->perPage(),

            'total' =>
                $subcontractors->total(),

            'from' =>
                $subcontractors->firstItem(),

            'to' =>
                $subcontractors->lastItem(),
        ];

        return response()->json([
            'success' => true,

            'message' =>
                'Deleted subcontractors loaded successfully.',

            'data' =>
                SalesSubcontractorResource::collection(
                    $subcontractors->items()
                ),

            'pagination' =>
                $pagination,

            'meta' =>
                $pagination,
        ]);
    }

    public function restore(
        int $id
    ): JsonResponse {
        $subcontractor =
            SalesSubcontractor::onlyTrashed()
                ->findOrFail($id);

        $subcontractor->restore();

        $subcontractor->load([
            'category',
            'registeredByUser',
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Subcontractor restored successfully.',

            'data' =>
                new SalesSubcontractorResource(
                    $subcontractor
                ),
        ]);
    }

    public function statistics(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'data' => [
                'total' =>
                    SalesSubcontractor::count(),

                'active' =>
                    SalesSubcontractor::where(
                        'status',
                        'active'
                    )->count(),

                'inactive' =>
                    SalesSubcontractor::where(
                        'status',
                        'inactive'
                    )->count(),

                'companies' =>
                    SalesSubcontractor::where(
                        'type',
                        'company'
                    )->count(),

                'individuals' =>
                    SalesSubcontractor::where(
                        'type',
                        'individual'
                    )->count(),

                'tax_0' =>
                    SalesSubcontractor::where(
                        'tax_percent',
                        0
                    )->count(),

                'tax_2' =>
                    SalesSubcontractor::where(
                        'tax_percent',
                        2
                    )->count(),

                'tax_10' =>
                    SalesSubcontractor::where(
                        'tax_percent',
                        10
                    )->count(),

                'tax_15' =>
                    SalesSubcontractor::where(
                        'tax_percent',
                        15
                    )->count(),

                'deleted' =>
                    SalesSubcontractor::onlyTrashed()
                        ->count(),
            ],
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

            'type' => [
                'nullable',
                'in:company,individual',
            ],

            'category_id' => [
                'nullable',
                'integer',
            ],

            'tax_percent' => [
                'nullable',
                'numeric',
                'in:0,2,10,15',
            ],

            'status' => [
                'nullable',
                'in:active,inactive',
            ],
        ]);

        $fileName =
            'subcontractors_'
            . now()->format(
                'Y-m-d_H-i-s'
            )
            . '.csv';

        return response()->streamDownload(
            function () use (
                $validated
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

                fputcsv(
                    $handle,
                    [
                        'ID',
                        'Type',
                        'Name',
                        'Company Name',
                        'TIN No',
                        'Address',
                        'Contact Person',
                        'Phone Number',
                        'Tax Percent',
                        'Category',
                        'Status',
                        'Registered By',
                        'Date Registered',
                    ]
                );

                $records = $this
                    ->buildFilteredQuery(
                        $validated
                    )
                    ->with('category')
                    ->orderBy('id')
                    ->cursor();

                foreach (
                    $records
                    as $record
                ) {
                    fputcsv(
                        $handle,
                        [
                            $record->id,

                            ucfirst(
                                $record->type
                            ),

                            $record
                                ->display_name,

                            $record
                                ->company_name,

                            $record
                                ->tin_no,

                            $record
                                ->address,

                            $record
                                ->contact_person,

                            $record
                                ->phone_number,

                            $record
                                ->tax_percent,

                            $record
                                ->category
                                ?->category_name
                            ?? $record
                                ->category
                                ?->name
                            ?? '',

                            ucfirst(
                                $record->status
                            ),

                            $record
                                ->registered_by,

                            $record
                                ->date_registered
                                ?->format(
                                    'Y-m-d'
                                ),
                        ]
                    );
                }

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
        $search = trim(
            (string) (
                $filters['search']
                ?? ''
            )
        );

        return SalesSubcontractor::query()
            ->when(
                $search !== '',
                function (
                    Builder $query
                ) use ($search): void {
                    $this->applySearch(
                        $query,
                        $search
                    );
                }
            )
            ->when(
                $filters['type']
                ?? null,
                fn (
                    Builder $query,
                    string $type
                ): Builder =>
                    $query->where(
                        'type',
                        $type
                    )
            )
            ->when(
                $filters['category_id']
                ?? null,
                fn (
                    Builder $query,
                    int|string $categoryId
                ): Builder =>
                    $query->where(
                        'category_id',
                        $categoryId
                    )
            )
            ->when(
                array_key_exists(
                    'tax_percent',
                    $filters
                )
                && $filters[
                    'tax_percent'
                ] !== null,
                fn (
                    Builder $query
                ): Builder =>
                    $query->where(
                        'tax_percent',
                        $filters[
                            'tax_percent'
                        ]
                    )
            )
            ->when(
                $filters['status']
                ?? null,
                fn (
                    Builder $query,
                    string $status
                ): Builder =>
                    $query->where(
                        'status',
                        $status
                    )
            );
    }

    private function applySearch(
        Builder $query,
        string $search
    ): void {
        $query->where(
            function (
                Builder $builder
            ) use ($search): void {
                $builder
                    ->where(
                        'firstname',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'lastname',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'company_name',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'tin_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'contact_person',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'phone_number',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'address',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhereHas(
                        'category',
                        function (
                            Builder $categoryQuery
                        ) use ($search): void {
                            $categoryQuery
                                ->where(
                                    'category_name',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'name',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
            }
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
}