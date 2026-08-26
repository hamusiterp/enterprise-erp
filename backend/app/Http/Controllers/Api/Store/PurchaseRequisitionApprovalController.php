<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequisition;
use App\Models\WorkflowTask;
use App\Services\WorkflowRuntimeService;
use App\Services\WorkflowService;
use App\Services\WorkflowTaskOwnershipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseRequisitionApprovalController extends Controller
{
    public function __construct(
        private readonly WorkflowRuntimeService $workflowRuntimeService,
        private readonly WorkflowTaskOwnershipService $ownershipService,
        private readonly WorkflowService $workflowService,
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | APPROVE PR QUEUE
    |--------------------------------------------------------------------------
    */
    public function index(
        Request $request
    ): JsonResponse {
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

        $user = $request->user();

        $page = (int) (
            $validated['page']
            ?? 1
        );

        $perPage = (int) (
            $validated['per_page']
            ?? 10
        );

        /*
         * Your existing Approve PR workflow state is:
         *
         * code = approve
         * name = Approve PR
         */
        $tasks = WorkflowTask::query()
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
                        'approve'
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
         * Respect workflow routing ownership.
         */
        $tasks = $tasks
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

        /*
         * Workflow subject IDs are SR IDs.
         */
        $storeRequisitionIds =
            $tasks
                ->pluck(
                    'workflowInstance.subject_id'
                )
                ->filter()
                ->unique()
                ->values();

        /*
         * Load PRs created from those SRs.
         */
        $purchaseRequisitions =
            PurchaseRequisition::query()
                ->whereIn(
                    'store_requisition_id',
                    $storeRequisitionIds
                )

                ->with([
                    'items.item',
                    'items.uom',

                    'creator',

                    'storeRequisition.requester',

                    'storeRequisition.fromDepartment',

                    'storeRequisition.usedForDepartment',

                    'storeRequisition.project',
                ])

                ->get()

                ->keyBy(
                    'store_requisition_id'
                );

        $records =
            $tasks
                ->map(
                    function (
                        WorkflowTask $task
                    ) use (
                        $purchaseRequisitions,
                        $user
                    ) {
                        $instance =
                            $task
                                ->workflowInstance;

                        if (!$instance) {
                            return null;
                        }

                        $pr =
                            $purchaseRequisitions
                                ->get(
                                    $instance
                                        ->subject_id
                                );

                        /*
                         * Do not show a workflow task if
                         * the PR document is missing.
                         */
                        if (!$pr) {
                            return null;
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

                            'purchase_requisition' =>
                                $pr,
                        ];
                    }
                )

                ->filter()
                ->values();

        /*
         * Search by PR No, SR No, requester.
         */
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
                            $pr =
                                $record[
                                    'purchase_requisition'
                                ];

                            $sr =
                                $pr
                                    ->storeRequisition;

                            $prNo =
                                mb_strtolower(
                                    (string)
                                    $pr->pr_no
                                );

                            $srNo =
                                mb_strtolower(
                                    (string) (
                                        $sr
                                            ?->sr_no
                                        ?? ''
                                    )
                                );

                            $requester =
                                mb_strtolower(
                                    (string) (
                                        $sr
                                            ?->requester
                                            ?->name
                                        ?? ''
                                    )
                                );

                            return
                                str_contains(
                                    $prNo,
                                    $search
                                )
                                ||
                                str_contains(
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
                $paginator
                    ->items(),

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


    /*
    |--------------------------------------------------------------------------
    | APPROVE / RETURN PR
    |--------------------------------------------------------------------------
    */
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

        $this->validateApprovalTask(
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

        /*
         * Find selected workflow transition.
         */
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
                    $validated[
                        'action'
                    ]
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

        /*
         * Workflow subject_id is the SR ID.
         */
        $purchaseRequisition =
            PurchaseRequisition::query()
                ->where(
                    'store_requisition_id',
                    $instance
                        ->subject_id
                )

                ->with([
                    'items.item',
                    'items.uom',

                    'storeRequisition',
                ])

                ->first();

        if (!$purchaseRequisition) {
            throw ValidationException::withMessages([
                'pr' =>
                    'Purchase Requisition could not be found for this workflow task.',
            ]);
        }

        DB::transaction(
            function () use (
                $request,
                $validated,
                $instance,
                $transition,
                $purchaseRequisition
            ) {
                /*
                 * Update PR status according
                 * to workflow action.
                 */
                $purchaseRequisition
                    ->update([
                        'status' =>
                            $transition
                                ->is_return
                                ? 'returned'
                                : 'approved',

                        'updated_by' =>
                            $request
                                ->user()
                                ->id,
                    ]);

                /*
                 * Execute workflow transition.
                 */
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
                            'module' =>
                                'purchase_requisition',

                            'stage' =>
                                'approve_pr',

                            'pr_id' =>
                                $purchaseRequisition
                                    ->id,

                            'pr_no' =>
                                $purchaseRequisition
                                    ->pr_no,

                            'sr_id' =>
                                $purchaseRequisition
                                    ->store_requisition_id,
                        ]
                    );
            }
        );

        return response()->json([
            'success' =>
                true,

            'message' =>
                $transition
                    ->is_return
                    ? 'Purchase Requisition returned successfully.'
                    : 'Purchase Requisition approved successfully.',

            'data' =>
                $purchaseRequisition
                    ->fresh()
                    ->load([
                        'items.item',
                        'items.uom',

                        'creator',

                        'storeRequisition.requester',

                        'storeRequisition.fromDepartment',

                        'storeRequisition.usedForDepartment',

                        'storeRequisition.project',
                    ]),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATE TASK
    |--------------------------------------------------------------------------
    */
    private function validateApprovalTask(
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
                    'This PR approval task has already been completed.',
            ]);
        }

        /*
         * Existing DB state:
         *
         * code = approve
         * name = Approve PR
         */
        if (
            $task
                ->workflowState
                ?->code !==
            'approve'
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