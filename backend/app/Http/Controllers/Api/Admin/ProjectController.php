<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Http\Resources\Admin\ProjectResource;
use App\Models\Bid;
use App\Models\Customer;
use App\Models\Project;
use App\Models\WorkOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'id',
        'project_no',
        'project_source',
        'bid_reference',
        'work_order_no',
        'project_name',
        'location',
        'employer',
        'construction_project_type',
        'business_unit',
'contract_type',
'contract_amount_before_vat',
'contract_pricing_type',
        'status',
        'date_registered',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | Project CRUD
    |--------------------------------------------------------------------------
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

            'project_source' => [
                'nullable',
                'in:Bid,Work Order',
            ],

            'construction_project_type' => [
                'nullable',
                'in:Private Project,Federal Project',
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

        $projects = $this
            ->buildFilteredQuery($validated)
            ->orderBy($sortBy, $sortDirection)
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $projects,
            'Projects loaded successfully.'
        );
    }

    public function store(
        ProjectRequest $request
    ): JsonResponse {
        $project = DB::transaction(
            function () use ($request): Project {
                /*
                 * Prevent duplicate project numbers when two users
                 * register projects simultaneously.
                 */
                DB::statement(
                    'SELECT pg_advisory_xact_lock(1003001)'
                );

                $data = $request->validated();

                unset($data['project_no']);

                $data['project_no'] =
                    $this->generateNextProjectNumber();

                $data = $this->prepareProjectData(
                    $data,
                    true
                );

                return Project::create($data);
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => new ProjectResource(
                $project->fresh()
            ),
        ], 201);
    }

    public function show(
        Project $project
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => 'Project loaded successfully.',
            'data' => new ProjectResource($project),
        ]);
    }

    public function update(
        ProjectRequest $request,
        Project $project
    ): JsonResponse {
        $data = $request->validated();

        /*
         * These fields are generated once and should not
         * be changed through normal project editing.
         */
        unset(
            $data['project_no'],
            $data['registered_by'],
            $data['registered_by_user_id'],
            $data['date_registered']
        );

        $data = $this->prepareProjectData(
            $data,
            false
        );

        $project->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => new ProjectResource(
                $project->fresh()
            ),
        ]);
    }

    public function destroy(
        Project $project
    ): JsonResponse {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' =>
                'Project moved to the recycle bin.',
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

        $projects = Project::onlyTrashed()
            ->search(
                $validated['search'] ?? null
            )
            ->orderByDesc('deleted_at')
            ->paginate(
                $validated['per_page'] ?? 10
            );

        return $this->paginatedResponse(
            $projects,
            'Deleted projects loaded successfully.'
        );
    }

    public function restore(
        int $id
    ): JsonResponse {
        $project = Project::onlyTrashed()
            ->findOrFail($id);

        $project->restore();

        return response()->json([
            'success' => true,
            'message' =>
                'Project restored successfully.',
            'data' => new ProjectResource(
                $project->fresh()
            ),
        ]);
    }

    public function forceDelete(
        int $id
    ): JsonResponse {
        $project = Project::onlyTrashed()
            ->findOrFail($id);

        $project->forceDelete();

        return response()->json([
            'success' => true,
            'message' =>
                'Project permanently deleted.',
        ]);
    }

    public function changeStatus(
        Request $request,
        Project $project
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,inactive',
            ],
        ]);

        $project->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' =>
                'Project status updated successfully.',
            'data' => new ProjectResource(
                $project->fresh()
            ),
        ]);
    }

    public function statistics(): JsonResponse
    {
        $statistics = Project::query()
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
                    WHERE project_source = 'Bid'
                ) AS bid_projects"
            )
            ->selectRaw(
                "COUNT(*) FILTER (
                    WHERE project_source = 'Work Order'
                ) AS work_order_projects"
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
                    Project::onlyTrashed()->count(),

                'bid_projects' => (int) (
                    $statistics?->bid_projects ?? 0
                ),

                'work_order_projects' => (int) (
                    $statistics?->work_order_projects ?? 0
                ),
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Project Form Options
    |--------------------------------------------------------------------------
    */

    public function bidOptions(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $bids = Bid::query()
            ->availableForProject()
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
                                ->whereRaw(
                                    'CAST(id AS TEXT) ILIKE ?',
                                    ["%{$search}%"]
                                )
                                ->orWhere(
                                    'client',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'place_of_project',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'project_type',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->select([
                'id',
                'client',
                'place_of_project',
                'project_type',
                'win_amount',
            ])
            ->orderByDesc('id')
            ->limit(200)
            ->get()
            ->map(
                function (Bid $bid): array {
                    $client = trim(
                        (string) $bid->client
                    );

                    $place = trim(
                        (string) $bid->place_of_project
                    );

                    return [
                        'value' => (string) $bid->id,

                        'label' => implode(
                            ' - ',
                            array_filter([
                                (string) $bid->id,
                                $client,
                                $place,
                            ])
                        ),

                        'id' => $bid->id,
                        'client' => $client,

                        'place_of_project' =>
                            $place,

                        'project_type' =>
                            $bid->project_type,

                        'win_amount' =>
                            $bid->win_amount,
                    ];
                }
            )
            ->values();

        return response()->json([
            'success' => true,
            'message' =>
                'Bid options loaded successfully.',
            'data' => $bids,
        ]);
    }

    public function workOrderOptions(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $workOrders = WorkOrder::query()
            ->availableForProject()
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
                                    'work_order_no',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'project',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'customer',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'work_location',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->selectRaw(
                '
                work_order_no,
                MAX(project) AS project,
                MAX(customer) AS customer,
                MAX(work_location) AS work_location,
                MAX(type_of_work) AS type_of_work,
                MAX(date_of_request) AS date_of_request
                '
            )
            ->groupBy('work_order_no')
            ->orderByDesc('work_order_no')
            ->limit(200)
            ->get()
            ->map(
                function ($workOrder): array {
                    $workOrderNo = trim(
                        (string) $workOrder->work_order_no
                    );

                    $projectName = trim(
                        (string) $workOrder->project
                    );

                    $customer = trim(
                        (string) $workOrder->customer
                    );

                    return [
                        'value' => $workOrderNo,

                        'label' => implode(
                            ' - ',
                            array_filter([
                                $workOrderNo,
                                $projectName,
                            ])
                        ),

                        'work_order_no' =>
                            $workOrderNo,

                        'project' =>
                            $projectName,

                        'customer' =>
                            $customer,

                        'work_location' =>
                            $workOrder->work_location,

                        'type_of_work' =>
                            $workOrder->type_of_work,

                        'date_of_request' =>
                            $workOrder->date_of_request,
                    ];
                }
            )
            ->values();

        return response()->json([
            'success' => true,
            'message' =>
                'Work order options loaded successfully.',
            'data' => $workOrders,
        ]);
    }

    public function customerOptions(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:200',
            ],
        ]);

        $search = trim(
            (string) (
                $validated['search'] ?? ''
            )
        );

        $customers = Customer::query()
            ->active()
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
                                    'company_name',
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
                                    'phone_number',
                                    'ilike',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'tin_number',
                                    'ilike',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->select([
                'id',
                'customer_no',
                'type',
                'firstname',
                'lastname',
                'company_name',
                'phone_number',
                'tin_number',
                'location',
            ])
            ->orderBy('customer_no')
            ->limit(300)
            ->get()
            ->map(
                function (Customer $customer): array {
                    $name = $customer->display_name;

                    return [
                        'value' => $customer->id,

                        'label' => implode(
                            ' - ',
                            array_filter([
                                $customer->customer_no,
                                $name,
                            ])
                        ),

                        'id' => $customer->id,

                        'customer_no' =>
                            $customer->customer_no,

                        'name' => $name,

                        'type' =>
                            $customer->type,

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

    public function nextProjectNumber(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' =>
                'Next project number loaded successfully.',
            'data' => [
                'project_no' =>
                    $this->generateNextProjectNumber(),
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
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

            'project_source' => [
                'nullable',
                'in:Bid,Work Order',
            ],

            'construction_project_type' => [
                'nullable',
                'in:Private Project,Federal Project',
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
            'projects_'
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
                    'Project Number',
                    'Project Source',
                    'Bid Reference',
                    'Work Order Number',
                    'Project Name',
                    'Project Description',
                    'Location',
                    'Employer',
                    'Consultant',
                    'Specified Area',
                    'Construction Project Type',
                    'Business Unit',
'Contract Type',
'Contract Amount Before VAT',
'Contract Pricing Type',
                    'Status',
                    'Registered By',
                    'Date Registered',
                ]);

                $this
                    ->buildFilteredQuery($validated)
                    ->orderBy(
                        $sortBy,
                        $sortDirection
                    )
                    ->chunkById(
                        300,
                        function ($projects) use (
                            $handle
                        ): void {
                            foreach (
                                $projects as $project
                            ) {
                                fputcsv($handle, [
                                    $project->id,
                                    $project->project_no,
                                    $project->project_source,
                                    $project->bid_reference,
                                    $project->work_order_no,
                                    $project->project_name,
                                    $project->project_description,
                                    $project->location,
                                    $project->employer,
                                    $project->consultant,
                                    $project->area,
                                    $project
                                        ->construction_project_type,
                                        $project->business_unit,
$project->contract_type,
$project->contract_amount_before_vat,
$project->contract_pricing_type,
                                    $project->status,
                                    $project->registered_by,
                                    $project->date_registered
                                        ?->format('Y-m-d'),
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

    /*
    |--------------------------------------------------------------------------
    | Private Helpers
    |--------------------------------------------------------------------------
    */

    private function prepareProjectData(
        array $data,
        bool $creating
    ): array {
        /*
         * Always derive the employer from sales_customer.
         * Never trust the employer text sent by the browser.
         */
        $customer = Customer::query()
            ->findOrFail($data['customer_id']);

        $data['employer'] =
            $customer->display_name;

        $data['has_consultant'] =
            filter_var(
                $data['has_consultant'] ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

        $data['has_specified_area'] =
            filter_var(
                $data['has_specified_area'] ?? false,
                FILTER_VALIDATE_BOOLEAN
            );

        if (! $data['has_consultant']) {
            $data['consultant'] = null;
        }

        if (! $data['has_specified_area']) {
            $data['area'] = null;
        }

        if (
            ($data['project_source'] ?? null)
            === 'Bid'
        ) {
            $data['work_order_no'] = null;
        } else {
            $data['bid_reference'] = null;
        }

        $data['project_name_letter'] =
            $data['project_name_letter'] ?? null;

        if ($creating) {
            $user = request()->user();

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
        return Project::query()
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
                $filters['project_source'] ?? null,
                fn (
                    Builder $query,
                    string $source
                ): Builder => $query->where(
                    'project_source',
                    $source
                )
            )
            ->when(
                $filters[
                    'construction_project_type'
                ] ?? null,
                fn (
                    Builder $query,
                    string $type
                ): Builder => $query->where(
                    'construction_project_type',
                    $type
                )
            );
    }

    private function generateNextProjectNumber(): string
    {
        $lastNumber = Project::withTrashed()
            ->where(
                'project_no',
                'like',
                'PRJ%'
            )
            ->whereRaw(
                "SUBSTRING(project_no FROM 4) ~ '^[0-9]+$'"
            )
            ->selectRaw(
                '
                MAX(
                    CAST(
                        SUBSTRING(project_no FROM 4)
                        AS INTEGER
                    )
                ) AS max_number
                '
            )
            ->value('max_number');

        $nextNumber = max(
            (int) $lastNumber + 1,
            1001
        );

        return 'PRJ' . $nextNumber;
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

            'data' => ProjectResource::collection(
                $paginator->items()
            ),

            'pagination' => $pagination,
            'meta' => $pagination,
        ]);
    }
}