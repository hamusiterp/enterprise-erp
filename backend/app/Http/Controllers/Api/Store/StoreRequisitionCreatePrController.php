<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequisition;
use App\Models\StoreRequisition;
use App\Models\WorkflowTask;
use App\Services\DocumentNumberService;
use App\Services\WorkflowRuntimeService;
use App\Services\WorkflowService;
use App\Services\WorkflowTaskOwnershipService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreRequisitionCreatePrController extends Controller
{
    public function __construct(
        private readonly DocumentNumberService $documentNumberService,
        private readonly WorkflowRuntimeService $workflowRuntimeService,
        private readonly WorkflowTaskOwnershipService $ownershipService,
        private readonly WorkflowService $workflowService,
    ) {
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE PR QUEUE
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
         * Get workflow tasks currently at Create PR.
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
                        'create_pr'
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
         * Only show tasks assigned to the
         * currently logged-in user.
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

        $subjectIds = $tasks
            ->pluck(
                'workflowInstance.subject_id'
            )
            ->filter()
            ->unique()
            ->values();

        /*
         * Load the corresponding SRs.
         */
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

        /*
         * Existing PRs are used to prevent
         * creating duplicate PR documents.
         */
        $existingPrs =
            PurchaseRequisition::query()
                ->whereIn(
                    'store_requisition_id',
                    $subjectIds
                )
                ->whereNull(
                    'deleted_at'
                )
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
                        $requisitions,
                        $existingPrs,
                        $user
                    ) {
                        $instance =
                            $task
                                ->workflowInstance;

                        if (!$instance) {
                            return null;
                        }

                        $sr =
                            $requisitions->get(
                                $instance->subject_id
                            );

                        if (!$sr) {
                            return null;
                        }

                        /*
                         * Calculate PR quantity line by line.
                         */
                        $prItems =
                            $sr
                                ->items
                                ->map(
                                    function (
                                        $line
                                    ) {
                                        $srQty =
                                            (float)
                                            $line
                                                ->sr_qty;

                                        $availableQty =
                                            (float) (
                                                $line
                                                    ->available_qty
                                                ?? 0
                                            );

                                        $prQty =
                                            max(
                                                $srQty -
                                                $availableQty,
                                                0
                                            );

                                        /*
                                         * Add frontend/API-only value.
                                         */
                                        $line
                                            ->setAttribute(
                                                'pr_qty',
                                                $prQty
                                            );

                                        return $line;
                                    }
                                )

                                /*
                                 * Fully available lines must
                                 * not enter the PR.
                                 */
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

                        $existingPr =
                            $existingPrs->get(
                                $sr->id
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
                                $sr,

                            'pr_items' =>
                                $prItems,

                            'existing_pr' =>
                                $existingPr,
                        ];
                    }
                )

                ->filter(
                    function (
                        $record
                    ) {
                        if (!$record) {
                            return false;
                        }

                        /*
                         * No shortage = no PR required.
                         */
                        return $record[
                            'pr_items'
                        ]->count() > 0;
                    }
                )

                ->values();

        /*
         * Search
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
                                    (string) (
                                        $sr
                                            ->requester
                                            ?->name
                                        ?? ''
                                    )
                                );

                            return
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
            'success' =>
                true,

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
    | CREATE & SUBMIT PR
    |--------------------------------------------------------------------------
    */
    public function store(
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

        /*
         * Confirm user owns this Create PR task.
         */
        $this->validateCreatePrTask(
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
         * Make sure the requested workflow action
         * is actually configured for Create PR.
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
                    'This workflow action is not available for Create PR.',
            ]);
        }

        /*
         * Create PR should use the normal
         * forward Submit PR transition.
         */
        if ($transition->is_return) {
            throw ValidationException::withMessages([
                'workflow' =>
                    'A return transition cannot be used to create a Purchase Requisition.',
            ]);
        }

        $storeRequisition =
            StoreRequisition::query()
                ->with([
                    'items.item',
                    'items.unitOfMeasurement',

                    'workflowInstance',
                ])

                ->findOrFail(
                    $instance
                        ->subject_id
                );

        /*
         * Prevent duplicate PR creation.
         */
        $existingPr =
            PurchaseRequisition::query()
                ->where(
                    'store_requisition_id',
                    $storeRequisition->id
                )
                ->whereNull(
                    'deleted_at'
                )
                ->first();

        if ($existingPr) {
            throw ValidationException::withMessages([
                'pr' =>
                    "Purchase Requisition {$existingPr->pr_no} already exists for this Store Requisition.",
            ]);
        }

        /*
         * Calculate all shortage lines before
         * consuming a PR sequence number.
         */
        $shortageLines =
            $storeRequisition
                ->items
                ->map(
                    function (
                        $line
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

                        $prQty =
                            max(
                                $srQty -
                                $availableQty,
                                0
                            );

                        return [
                            'line' =>
                                $line,

                            'sr_qty' =>
                                $srQty,

                            'available_qty' =>
                                $availableQty,

                            'pr_qty' =>
                                $prQty,
                        ];
                    }
                )

                ->filter(
                    fn (
                        array $item
                    ) =>
                        $item['pr_qty'] > 0
                )

                ->values();

        if ($shortageLines->isEmpty()) {
            throw ValidationException::withMessages([
                'items' =>
                    'There are no shortage items requiring a Purchase Requisition.',
            ]);
        }

        $purchaseRequisition =
            DB::transaction(
                function () use (
                    $request,
                    $validated,
                    $instance,
                    $storeRequisition,
                    $shortageLines
                ) {
                    /*
                     * Generate the PR number only now.
                     *
                     * Uses the existing Document Numbering
                     * module and current fiscal year.
                     */
                    $prNo =
                        $this
                            ->documentNumberService
                            ->generate(
                                'PURCHASE_REQUISITION'
                            );

                    /*
                     * Create PR header.
                     */
                    $pr =
                        PurchaseRequisition::create([
                            'pr_no' =>
                                $prNo,

                            'pr_date' =>
                                now()
                                    ->toDateString(),

                            'store_requisition_id' =>
                                $storeRequisition
                                    ->id,

                            'workflow_instance_id' =>
                                $instance
                                    ->id,

                            'used_for' =>
                                $storeRequisition
                                    ->used_for,

                            'project_id' =>
                                $storeRequisition
                                    ->project_id,

                            'used_for_department_id' =>
                                $storeRequisition
                                    ->used_for_department_id,

                            'from_department_id' =>
                                $storeRequisition
                                    ->from_department_id,

                            'to_location' =>
                                $storeRequisition
                                    ->to_location,

                            'remarks' =>
                                $validated[
                                    'remarks'
                                ] ?? null,

                            /*
                             * Once created, it immediately
                             * enters approval.
                             */
                            'status' =>
                                'submitted',

                            'created_by' =>
                                $request
                                    ->user()
                                    ->id,

                            'updated_by' =>
                                $request
                                    ->user()
                                    ->id,
                        ]);

                    /*
                     * Create only shortage lines.
                     */
                    foreach (
                        $shortageLines
                        as $shortage
                    ) {
                        $line =
                            $shortage[
                                'line'
                            ];

                        $pr
                            ->items()
                            ->create([
                                'store_requisition_item_id' =>
                                    $line->id,

                                'item_id' =>
                                    $line->item_id,

                                'uom_id' =>
                                    $line->uom_id,

                                'sr_qty' =>
                                    $shortage[
                                        'sr_qty'
                                    ],

                                'available_qty' =>
                                    $shortage[
                                        'available_qty'
                                    ],

                                'pr_qty' =>
                                    $shortage[
                                        'pr_qty'
                                    ],

                                'expected_delivery_date' =>
                                    $line
                                        ->expected_delivery_date,

                                'priority' =>
                                    $line
                                        ->priority,

                                'delivery_type' =>
                                    $line
                                        ->delivery_type,

                                'remark' =>
                                    $line
                                        ->remark,
                            ]);
                    }

                    /*
                     * Move workflow:
                     *
                     * Create PR
                     *      ↓
                     * Approve PR
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

                                'pr_id' =>
                                    $pr->id,

                                'pr_no' =>
                                    $pr->pr_no,

                                'sr_id' =>
                                    $storeRequisition
                                        ->id,

                                'sr_no' =>
                                    $storeRequisition
                                        ->sr_no,
                            ]
                        );

                    return $pr;
                }
            );

        return response()->json([
            'success' =>
                true,

            'message' =>
                'Purchase Requisition created and submitted successfully.',

            'data' =>
                $purchaseRequisition
                    ->fresh()
                    ->load([
                        'items.item',

                        'items.uom',

                        'storeRequisition',

                        'project',

                        'usedForDepartment',

                        'fromDepartment',

                        'creator',
                    ]),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATE CREATE PR TASK
    |--------------------------------------------------------------------------
    */
    private function validateCreatePrTask(
        Request $request,
        WorkflowTask $task
    ): void {
        $task->load([
            'workflowState',
            'workflowInstance.currentState',
        ]);

        /*
         * User / Department / Role / Permission
         * routing ownership.
         */
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
                    'This Create PR task has already been completed.',
            ]);
        }

        if (
            $task
                ->workflowState
                ?->code !==
            'create_pr'
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This task is not a Create PR task.',
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