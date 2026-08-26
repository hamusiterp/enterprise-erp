<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\StoreRequisition;
use App\Models\WorkflowTask;
use App\Services\WorkflowRuntimeService;
use App\Services\WorkflowService;
use App\Services\WorkflowTaskOwnershipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreRequisitionPrApprovalController extends Controller
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
        $validated =
            $request->validate([
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
                            'approve_pr'
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

        /*
         * Only tasks the current user is
         * actually allowed to handle.
         */
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

                ->map(
                    function (
                        StoreRequisition $sr
                    ) {
                        /*
                         * Calculate shortage again to make
                         * the API safe even for older SRs.
                         */
                        foreach (
                            $sr->items
                            as $line
                        ) {
                            $srQty =
                                (float)
                                $line->sr_qty;

                            $availableQty =
                                (float) (
                                    $line
                                        ->available_qty
                                    ?? 0
                                );

                            $shortage =
                                max(
                                    $srQty -
                                    $availableQty,
                                    0
                                );

                            $line->setAttribute(
                                'pr_qty',
                                $shortage
                            );
                        }

                        return $sr;
                    }
                )

                ->keyBy(
                    'id'
                );

        $records =
            $tasks
                ->map(
                    function (
                        WorkflowTask $task
                    ) use (
                        $requisitions,
                        $user
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
                         * Only shortage lines need PR.
                         */
                        $prItems =
                            $requisition
                                ->items
                                ->filter(
                                    fn ($line) =>
                                        (float)
                                        $line
                                            ->getAttribute(
                                                'pr_qty'
                                            ) > 0
                                )
                                ->values();

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

                            'pr_items' =>
                                $prItems,
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

                            return
                                str_contains(
                                    mb_strtolower(
                                        (string)
                                        $sr->sr_no
                                    ),
                                    $search
                                )
                                ||
                                str_contains(
                                    mb_strtolower(
                                        (string) (
                                            $sr
                                                ->requester
                                                ?->name
                                            ?? ''
                                        )
                                    ),
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

    public function action(
        Request $request,
        WorkflowTask $task
    ): JsonResponse {
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
            ]);

        $this->validatePrTask(
            $request,
            $task
        );

        $task->load([
            'workflowState',

            'workflowInstance.workflowDefinition.transitions',

            'workflowInstance.currentState',
        ]);

        $instance =
            $task
                ->workflowInstance;

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
                    'This workflow action is not available for Approve PR.',
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

        /*
         * Do not allow PR approval if there
         * is actually no shortage.
         */
        $shortageTotal =
            $storeRequisition
                ->items
                ->sum(
                    function ($line) {
                        return max(
                            (float)
                            $line->sr_qty
                            -
                            (float) (
                                $line
                                    ->available_qty
                                ?? 0
                            ),
                            0
                        );
                    }
                );

        if (
            !$transition->is_return &&
            $shortageTotal <= 0
        ) {
            throw ValidationException::withMessages([
                'items' =>
                    'This Store Requisition has no shortage quantity requiring a Purchase Request.',
            ]);
        }

        DB::transaction(
            function () use (
                $request,
                $validated,
                $instance,
                $storeRequisition,
                $shortageTotal
            ) {
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

                            'shortage_total' =>
                                $shortageTotal,

                            'module' =>
                                'store_requisition',

                            'stage' =>
                                'approve_pr',
                        ]
                    );
            }
        );

        return response()->json([
            'success' => true,

            'message' =>
                $transition->is_return
                    ? 'Purchase Request returned successfully.'
                    : 'Purchase Request approved successfully.',

            'data' =>
                $storeRequisition
                    ->fresh()
                    ->load([
                        'items.item',
                        'items.unitOfMeasurement',

                        'requester',
                        'fromDepartment',
                        'usedForDepartment',
                        'project',

                        'workflowInstance.currentState',
                    ]),
        ]);
    }

    private function validatePrTask(
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
                    'This Approve PR task has already been completed.',
            ]);
        }

        if (
            $task
                ->workflowState
                ?->code !==
            'approve_pr'
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This task is not an Approve PR task.',
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