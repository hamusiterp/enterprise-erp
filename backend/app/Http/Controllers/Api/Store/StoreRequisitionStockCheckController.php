<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use App\Models\StoreRequisition;
use App\Models\StoreStock;
use App\Models\WorkflowTask;
use App\Services\WorkflowRuntimeService;
use App\Services\WorkflowService;
use App\Services\WorkflowTaskOwnershipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreRequisitionStockCheckController extends Controller
{
    public function __construct(
        private readonly WorkflowRuntimeService $workflowRuntimeService,
        private readonly WorkflowTaskOwnershipService $ownershipService,
        private readonly WorkflowService $workflowService,
    ) {
    }

    public function index(
        Request $request
    ): JsonResponse {
        abort_unless(
            $request->user()?->can(
                'store-requisitions.stock-check'
            ),
            403,
            'You do not have permission to perform Stock Balance Check.'
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:150',
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

        $user =
            $request->user();

        $page =
            (int) (
                $validated['page']
                ?? 1
            );

        $perPage =
            (int) (
                $validated['per_page']
                ?? 10
            );

        $tasks =
            WorkflowTask::query()
                ->with([
                    'workflowState',

                    'workflowInstance.workflowDefinition.states',

                    'workflowInstance.workflowDefinition.transitions.fromState',

                    'workflowInstance.workflowDefinition.transitions.toState',

                    'workflowInstance.currentState',
                ])

                ->whereIn(
                    'status',
                    [
                        'pending',
                        'in_progress',
                    ]
                )

                ->whereHas(
                    'workflowState',
                    fn ($query) =>
                        $query->where(
                            'code',
                            'stock_balance_check'
                        )
                )

                ->whereHas(
                    'workflowInstance',
                    fn ($query) =>
                        $query
                            ->where(
                                'subject_type',
                                'store_requisition'
                            )
                            ->where(
                                'status',
                                'running'
                            )
                )

                ->orderByDesc(
                    'received_at'
                )

                ->get();

        $tasks =
            $tasks
                ->filter(
                    fn (
                        WorkflowTask $task
                    ) =>
                        $this
                            ->ownershipService
                            ->userCanHandle(
                                $user,
                                $task
                            )
                )
                ->values();

        $subjectIds =
            $tasks
                ->pluck(
                    'workflowInstance.subject_id'
                )
                ->filter()
                ->unique()
                ->values();

        $requisitions =
            StoreRequisition::query()
                ->whereIn(
                    'id',
                    $subjectIds
                )
                ->with([
                    'items.item',
                    'items.unitOfMeasurement',

                    'requester',
                    'fromDepartment',
                    'usedForDepartment',
                    'project',

                    'workflowInstance.currentState',
                ])
                ->get()
                ->keyBy('id');

        $company =
            CompanySetting::query()
                ->first();

        $stockManagementEnabled =
            (bool) (
                $company
                    ?->stock_management_enabled
                ?? false
            );

        $records =
            $tasks
                ->map(
                    function (
                        WorkflowTask $task
                    ) use (
                        $requisitions,
                        $user,
                        $stockManagementEnabled
                    ) {
                        $instance =
                            $task
                                ->workflowInstance;

                        if (!$instance) {
                            return null;
                        }

                        $requisition =
                            $requisitions->get(
                                $instance->subject_id
                            );

                        if (!$requisition) {
                            return null;
                        }

                        /*
                         * Automatic stock mode:
                         * read current balance from store_stocks.
                         */
                        if ($stockManagementEnabled) {
                            foreach (
                                $requisition->items
                                as $line
                            ) {
                                $stock =
                                    StoreStock::query()
                                        ->where(
                                            'item_id',
                                            $line->item_id
                                        )
                                        ->where(
                                            'location',
                                            'Main Store'
                                        )
                                        ->where(
                                            'status',
                                            'active'
                                        )
                                        ->first();

                                $availableQty =
                                    (float) (
                                        $stock
                                            ?->available_quantity
                                        ?? 0
                                    );

                                $line->setAttribute(
                                    'system_available_qty',
                                    $availableQty
                                );
                            }
                        }

                        $availableTransitions =
                            $this
                                ->workflowService
                                ->availableTransitions(
                                    $instance
                                        ->workflowDefinition,

                                    $instance
                                        ->currentState,

                                    $user
                                );

                        return [
                            'task' => [
                                'id' =>
                                    $task->id,

                                'status' =>
                                    $task->status,

                                'received_at' =>
                                    $task
                                        ->received_at
                                        ?->toISOString(),

                                'assignment_type' =>
                                    $task
                                        ->assignment_type,
                            ],

                            'stock_management_enabled' =>
                                $stockManagementEnabled,

                            'actions' =>
                                $availableTransitions
                                    ->map(
                                        fn (
                                            $transition
                                        ) => [
                                            'action' =>
                                                $transition
                                                    ->action,

                                            'name' =>
                                                $transition
                                                    ->name,

                                            'is_return' =>
                                                (bool)
                                                $transition
                                                    ->is_return,

                                            'requires_remarks' =>
                                                (bool)
                                                $transition
                                                    ->requires_remarks,
                                        ]
                                    )
                                    ->values(),

                            'requisition' =>
                                $requisition,
                        ];
                    }
                )
                ->filter()
                ->values();

        if (
            !empty(
                $validated['search']
            )
        ) {
            $search =
                mb_strtolower(
                    trim(
                        $validated['search']
                    )
                );

            $records =
                $records
                    ->filter(
                        function (
                            array $record
                        ) use (
                            $search
                        ) {
                            $sr =
                                $record[
                                    'requisition'
                                ];

                            $srNo =
                                mb_strtolower(
                                    (string)
                                    $sr->sr_no
                                );

                            $requester =
                                mb_strtolower(
                                    (string)
                                    (
                                        $sr
                                            ->requester
                                            ?->name
                                        ?? ''
                                    )
                                );

                            return str_contains(
                                $srNo,
                                $search
                            )
                            ||
                            str_contains(
                                $requester,
                                $search
                            );
                        }
                    )
                    ->values();
        }

        $total =
            $records->count();

        $pagedRecords =
            $records
                ->forPage(
                    $page,
                    $perPage
                )
                ->values();

        $paginator =
            new LengthAwarePaginator(
                $pagedRecords,
                $total,
                $perPage,
                $page
            );

        return response()->json([
            'success' => true,

            'data' =>
                $paginator->items(),

            'meta' => [
                'current_page' =>
                    $paginator
                        ->currentPage(),

                'last_page' =>
                    $paginator
                        ->lastPage(),

                'per_page' =>
                    $paginator
                        ->perPage(),

                'total' =>
                    $paginator
                        ->total(),
            ],
        ]);
    }

    public function check(
        Request $request,
        WorkflowTask $task
    ): JsonResponse {
        abort_unless(
            $request->user()?->can(
                'store-requisitions.stock-check'
            ),
            403,
            'You do not have permission to perform Stock Balance Check.'
        );

        $validated =
            $request->validate([
                'action' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'items' => [
                    'required',
                    'array',
                    'min:1',
                ],

                'items.*.line_id' => [
                    'required',
                    'integer',
                ],

                'items.*.available_qty' => [
                    'nullable',
                    'numeric',
                    'min:0',
                ],

                'items.*.stock_check_remark' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],
            ]);

        $this->validateStockCheckTask(
            $request,
            $task
        );

        $task->load([
            'workflowState',

            'workflowInstance.workflowDefinition.transitions',

            'workflowInstance.currentState',
        ]);

        $instance =
            $task->workflowInstance;

        if (!$instance) {
            throw ValidationException::withMessages([
                'workflow' =>
                    'Workflow instance could not be found.',
            ]);
        }

        $transition =
            $instance
                ->workflowDefinition
                ->transitions
                ->where(
                    'from_state_id',
                    $instance
                        ->current_state_id
                )
                ->where(
                    'action',
                    $validated['action']
                )
                ->where(
                    'is_active',
                    true
                )
                ->first();

        if (!$transition) {
            throw ValidationException::withMessages([
                'workflow' =>
                    'This workflow action is not available for Stock Balance Check.',
            ]);
        }

        $storeRequisition =
            StoreRequisition::query()
                ->with([
                    'items',
                ])
                ->findOrFail(
                    $instance
                        ->subject_id
                );

        $company =
            CompanySetting::query()
                ->first();

        $stockManagementEnabled =
            (bool) (
                $company
                    ?->stock_management_enabled
                ?? false
            );

        DB::transaction(
            function () use (
                $request,
                $validated,
                $instance,
                $storeRequisition,
                $stockManagementEnabled
            ) {
                foreach (
                    $validated['items']
                    as $submittedLine
                ) {
                    $line =
                        $storeRequisition
                            ->items
                            ->firstWhere(
                                'id',
                                $submittedLine[
                                    'line_id'
                                ]
                            );

                    if (!$line) {
                        throw ValidationException::withMessages([
                            'items' =>
                                'One of the submitted SR lines is invalid.',
                        ]);
                    }

                    if ($stockManagementEnabled) {
                        $stock =
                            StoreStock::query()
                                ->where(
                                    'item_id',
                                    $line->item_id
                                )
                                ->where(
                                    'location',
                                    'Main Store'
                                )
                                ->where(
                                    'status',
                                    'active'
                                )
                                ->first();

                        $availableQty =
                            (float) (
                                $stock
                                    ?->available_quantity
                                ?? 0
                            );
                    } else {
                        if (
                            !array_key_exists(
                                'available_qty',
                                $submittedLine
                            )
                            ||
                            $submittedLine[
                                'available_qty'
                            ] === null
                        ) {
                            throw ValidationException::withMessages([
                                'items' =>
                                    'Available quantity is required when stock management is disabled.',
                            ]);
                        }

                        $availableQty =
                            (float)
                            $submittedLine[
                                'available_qty'
                            ];
                    }

                    $srQty =
                        (float)
                        $line->sr_qty;

                    if (
                        $availableQty <= 0
                    ) {
                        $stockStatus =
                            'not_available';
                    } elseif (
                        $availableQty <
                        $srQty
                    ) {
                        $stockStatus =
                            'partial';
                    } else {
                        $stockStatus =
                            'available';
                    }

                    $line->update([
                        'available_qty' =>
                            $availableQty,

                        'shortage_qty' =>
                            max(
                                $srQty - $availableQty,
                                0
                            ),

                        'stock_status' =>
                            $stockStatus,

                        'stock_checked_by' =>
                            $request
                                ->user()
                                ->id,

                        'stock_checked_at' =>
                            now(),

                        'stock_check_remark' =>
                            $submittedLine[
                                'stock_check_remark'
                            ] ?? null,
                    ]);
                }

                $this
                    ->workflowRuntimeService
                    ->performAction(
                        $instance,

                        $validated[
                            'action'
                        ],

                        $request->user(),

                        $validated[
                            'remarks'
                        ] ?? null,

                        [
                            'sr_no' =>
                                $storeRequisition
                                    ->sr_no,

                            'stock_management_enabled' =>
                                $stockManagementEnabled,

                            'module' =>
                                'store_requisition',
                        ]
                    );
            }
        );

        return response()->json([
            'success' => true,

            'message' =>
                'Stock Balance Check completed successfully.',

            'data' =>
                $storeRequisition
                    ->fresh()
                    ->load([
                        'items.item',
                        'items.unitOfMeasurement',
                        'items.stockCheckedBy',

                        'requester',
                        'fromDepartment',
                        'usedForDepartment',
                        'project',

                        'workflowInstance.currentState',
                    ]),
        ]);
    }

    private function validateStockCheckTask(
        Request $request,
        WorkflowTask $task
    ): void {
        $task->load([
            'workflowState',
            'workflowInstance.currentState',
        ]);

        $this
            ->ownershipService
            ->authorize(
                $request->user(),
                $task
            );

        if (
            !in_array(
                $task->status,
                [
                    'pending',
                    'in_progress',
                ],
                true
            )
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This Stock Balance Check task has already been completed.',
            ]);
        }

        if (
            $task
                ->workflowState
                ?->code !==
            'stock_balance_check'
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This task is not a Stock Balance Check task.',
            ]);
        }

        if (
            $task
                ->workflowInstance
                ?->subject_type !==
            'store_requisition'
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This task does not belong to a Store Requisition.',
            ]);
        }
    }
}