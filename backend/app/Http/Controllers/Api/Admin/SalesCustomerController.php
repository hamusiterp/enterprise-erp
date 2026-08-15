<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalesCustomerRequest;
use App\Http\Resources\SalesCustomerResource;
use App\Models\SalesCustomer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesCustomerController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'customer_no',
        'customer_type',
        'firstname',
        'lastname',
        'company_name',
        'email_address',
        'tin_number',
        'contact_person',
        'phone_number',
        'customer_status',
        'withhold',
        'withhold_percent',
        'location',
        'withhold_from_advance',
        'registered_by',
        'date_registered',
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

            'customer_type' => [
                'nullable',
                'in:individual,company',
            ],

            'customer_status' => [
                'nullable',
                'in:active,inactive',
            ],

            'withhold' => [
                'nullable',
                'boolean',
            ],

            'withhold_from_advance' => [
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

        $customers = $this
            ->buildFilteredQuery($validated)
            ->orderBy(
                $sortBy,
                $sortDirection
            )
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $customers,
            'Customers loaded successfully.'
        );
    }

    public function store(
        SalesCustomerRequest $request
    ): JsonResponse {
        $customer = DB::transaction(
            function () use ($request): SalesCustomer {
                /*
                 * Prevent duplicate customer numbers
                 * during simultaneous registration.
                 */
                DB::statement(
                    'SELECT pg_advisory_xact_lock(1005001)'
                );

                $data = $request->validated();

                unset($data['customer_no']);

                $data['customer_no'] =
                    $this->generateNextCustomerNumber();

                $data = $this->prepareCustomerData(
                    $data,
                    true,
                    $request
                );

                return SalesCustomer::create($data);
            }
        );

        return response()->json([
            'success' => true,

            'message' =>
                'Customer created successfully.',

            'data' =>
                new SalesCustomerResource($customer),
        ], 201);
    }

    public function show(
        SalesCustomer $salesCustomer
    ): JsonResponse {
        return response()->json([
            'success' => true,

            'message' =>
                'Customer loaded successfully.',

            'data' =>
                new SalesCustomerResource(
                    $salesCustomer
                ),
        ]);
    }

    public function update(
        SalesCustomerRequest $request,
        SalesCustomer $salesCustomer
    ): JsonResponse {
        $data = $request->validated();

        unset(
            $data['customer_no'],
            $data['registered_by'],
            $data['registered_by_user_id'],
            $data['date_registered']
        );

        $data = $this->prepareCustomerData(
            $data,
            false,
            $request
        );

        $salesCustomer->update($data);

        return response()->json([
            'success' => true,

            'message' =>
                'Customer updated successfully.',

            'data' =>
                new SalesCustomerResource(
                    $salesCustomer->fresh()
                ),
        ]);
    }

    public function destroy(
        SalesCustomer $salesCustomer
    ): JsonResponse {
        $salesCustomer->delete();

        return response()->json([
            'success' => true,

            'message' =>
                'Customer moved to the recycle bin.',
        ]);
    }

    public function changeStatus(
        Request $request,
        SalesCustomer $salesCustomer
    ): JsonResponse {
        $validated = $request->validate([
            'customer_status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $salesCustomer->update([
            'customer_status' =>
                $validated['customer_status'],
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Customer status updated successfully.',

            'data' =>
                new SalesCustomerResource(
                    $salesCustomer->fresh()
                ),
        ]);
    }

    public function nextCustomerNumber(): JsonResponse
    {
        return response()->json([
            'success' => true,

            'message' =>
                'Next customer number loaded successfully.',

            'data' => [
                'customer_no' =>
                    $this->generateNextCustomerNumber(),
            ],
        ]);
    }

    public function statistics(): JsonResponse
    {
        $statistics = SalesCustomer::query()
            ->selectRaw('COUNT(*) AS total')
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE customer_status = 'active'
                ) AS active"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE customer_status = 'inactive'
                ) AS inactive"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE customer_type = 'individual'
                ) AS individuals"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE customer_type = 'company'
                ) AS companies"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE withhold = true
                ) AS with_withhold"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE withhold = false
                ) AS without_withhold"
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

                'individuals' => (int) (
                    $statistics?->individuals ?? 0
                ),

                'companies' => (int) (
                    $statistics?->companies ?? 0
                ),

                'with_withhold' => (int) (
                    $statistics?->with_withhold ?? 0
                ),

                'without_withhold' => (int) (
                    $statistics?->without_withhold ?? 0
                ),

                'deleted' =>
                    SalesCustomer::onlyTrashed()
                        ->count(),
            ],
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
                $validated['search'] ?? ''
            )
        );

        $customers = SalesCustomer::onlyTrashed()
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
                                    'customer_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
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
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tin_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'email_address',
                                    'ilike',
                                    "%{$search}%"
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
            $customers,
            'Deleted customers loaded successfully.'
        );
    }

    public function restore(
        int $id
    ): JsonResponse {
        $customer = SalesCustomer::onlyTrashed()
            ->findOrFail($id);

        $customer->restore();

        return response()->json([
            'success' => true,

            'message' =>
                'Customer restored successfully.',

            'data' =>
                new SalesCustomerResource(
                    $customer->fresh()
                ),
        ]);
    }

    public function forceDelete(
        int $id
    ): JsonResponse {
        $customer = SalesCustomer::onlyTrashed()
            ->findOrFail($id);

        $customer->forceDelete();

        return response()->json([
            'success' => true,

            'message' =>
                'Customer permanently deleted.',
        ]);
    }

    /**
     * Used by Project and other customer dropdowns.
     */
    public function options(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],

            'customer_type' => [
                'nullable',
                'in:individual,company',
            ],
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $customers = SalesCustomer::query()
            ->where(
                'customer_status',
                'active'
            )
            ->when(
                $validated['customer_type'] ?? null,
                fn (
                    Builder $query,
                    string $type
                ): Builder => $query->where(
                    'customer_type',
                    $type
                )
            )
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
                                    'customer_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
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
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->orderBy('customer_no')
            ->limit(300)
            ->get()
            ->map(
                function (
                    SalesCustomer $customer
                ): array {
                    return [
                        'value' =>
                            $customer->id,

                        'label' =>
                            $customer->customer_no
                            . ' - '
                            . $customer->display_name,

                        'id' =>
                            $customer->id,

                        'customer_no' =>
                            $customer->customer_no,

                        'name' =>
                            $customer->display_name,

                        'customer_type' =>
                            $customer->customer_type,

                        'phone_number' =>
                            $customer->phone_number,

                        'tin_number' =>
                            $customer->tin_number,

                        'location' =>
                            $customer->location,
                    ];
                }
            )
            ->values();

        return response()->json([
            'success' => true,

            'message' =>
                'Customer options loaded successfully.',

            'data' => $customers,
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

            'customer_type' => [
                'nullable',
                'in:individual,company',
            ],

            'customer_status' => [
                'nullable',
                'in:active,inactive',
            ],

            'withhold' => [
                'nullable',
                'boolean',
            ],

            'withhold_from_advance' => [
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
            'customers_'
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
                    'Customer Number',
                    'Customer Type',
                    'Display Name',
                    'First Name',
                    'Last Name',
                    'Company Name',
                    'Email Address',
                    'TIN Number',
                    'Contact Person',
                    'Phone Number',
                    'Location',
                    'Status',
                    'Withhold',
                    'Withhold Percent',
                    'Withhold From Advance',
                    'Registered By',
                    'Date Registered',
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
                        function ($customers) use (
                            $handle
                        ): void {
                            foreach (
                                $customers as $customer
                            ) {
                                fputcsv($handle, [
                                    $customer->id,
                                    $customer->customer_no,
                                    $customer->customer_type,
                                    $customer->display_name,
                                    $customer->firstname,
                                    $customer->lastname,
                                    $customer->company_name,
                                    $customer->email_address,
                                    $customer->tin_number,
                                    $customer->contact_person,
                                    $customer->phone_number,
                                    $customer->location,
                                    $customer->customer_status,

                                    $customer->withhold
                                        ? 'Yes'
                                        : 'No',

                                    $customer->withhold_percent,

                                    $customer
                                        ->withhold_from_advance
                                        ? 'Yes'
                                        : 'No',

                                    $customer->registered_by,

                                    $customer->date_registered
                                        ?->format('Y-m-d'),

                                    $customer->created_at
                                        ?->format(
                                            'Y-m-d H:i:s'
                                        ),

                                    $customer->updated_at
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

    private function prepareCustomerData(
        array $data,
        bool $creating,
        Request $request
    ): array {
        $customerType =
            $data['customer_type'];

        $data['withhold'] = filter_var(
            $data['withhold'] ?? false,
            FILTER_VALIDATE_BOOLEAN
        );

        $data['withhold_from_advance'] =
            filter_var(
                $data['withhold_from_advance']
                    ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

        if ($customerType === 'individual') {
            $data['company_name'] = null;
            $data['tin_number'] = null;
        }

        if ($customerType === 'company') {
            $data['firstname'] = null;
            $data['lastname'] = null;
        }

        if (! $data['withhold']) {
            $data['withhold_percent'] = null;
        }

        if ($creating) {
            $user = $request->user();

            $data['registered_by_user_id'] =
                $user?->id;

            $data['registered_by'] =
                $user?->name
                ?? $user?->email
                ?? 'System';

            $data['date_registered'] =
                now()->toDateString();
        }

        return $data;
    }

    private function buildFilteredQuery(
        array $filters
    ): Builder {
        $search = trim(
            (string) (
                $filters['search'] ?? ''
            )
        );

        return SalesCustomer::query()
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
                                    'customer_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
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
                                    'email_address',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tin_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'contact_person',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'location',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $filters['customer_type']
                    ?? null,
                fn (
                    Builder $query,
                    string $type
                ): Builder => $query->where(
                    'customer_type',
                    $type
                )
            )
            ->when(
                $filters['customer_status']
                    ?? null,
                fn (
                    Builder $query,
                    string $status
                ): Builder => $query->where(
                    'customer_status',
                    $status
                )
            )
            ->when(
                array_key_exists(
                    'withhold',
                    $filters
                )
                && $filters['withhold'] !== null,
                fn (
                    Builder $query
                ): Builder => $query->where(
                    'withhold',
                    filter_var(
                        $filters['withhold'],
                        FILTER_VALIDATE_BOOLEAN
                    )
                )
            )
            ->when(
                array_key_exists(
                    'withhold_from_advance',
                    $filters
                )
                && $filters[
                    'withhold_from_advance'
                ] !== null,
                fn (
                    Builder $query
                ): Builder => $query->where(
                    'withhold_from_advance',
                    filter_var(
                        $filters[
                            'withhold_from_advance'
                        ],
                        FILTER_VALIDATE_BOOLEAN
                    )
                )
            );
    }

    private function generateNextCustomerNumber(): string
    {
        $lastNumber = SalesCustomer::withTrashed()
            ->where(
                'customer_no',
                'like',
                'CUS%'
            )
            ->whereRaw(
                "SUBSTRING(customer_no FROM 4) ~ '^[0-9]+$'"
            )
            ->selectRaw(
                '
                MAX(
                    CAST(
                        SUBSTRING(customer_no FROM 4)
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

        return 'CUS' . str_pad(
            (string) $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
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

            'data' =>
                SalesCustomerResource::collection(
                    $paginator->items()
                ),

            'pagination' => $pagination,

            'meta' => $pagination,
        ]);
    }
}