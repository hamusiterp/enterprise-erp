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

class StoreRequisitionDocumentReceivingController extends Controller
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
                'store-requisitions.document-receive'
            ),
            403,
            'You do not have permission to receive Store Requisition documents.'
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
                            'document_receiving_sr'
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
                    'requestedDepartment',

                    'fromDepartment',
                    'usedForDepartment',

                    'project',

                    'receivedBy:id,name,email',

                    'workflowInstance.currentState',
                ])
                ->get()
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

                                'started_at' =>
                                    $task
                                        ->started_at
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

    public function receive(
        Request $request,
        WorkflowTask $task
    ): JsonResponse {
        abort_unless(
            $request->user()?->can(
                'store-requisitions.document-receive'
            ),
            403,
            'You do not have permission to receive Store Requisition documents.'
        );

        $validated =
            $request->validate([
                'received_date' => [
                    'required',
                    'date',
                ],

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

        $this->validateReceivingTask(
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
                    'This workflow action is not available for Document Receiving.',
            ]);
        }

        $storeRequisition =
            StoreRequisition::query()
                ->findOrFail(
                    $instance
                        ->subject_id
                );

        DB::transaction(
            function () use (
                $request,
                $validated,
                $instance,
                $storeRequisition
            ) {
                $storeRequisition->update([
                    'sr_received_date' =>
                        $validated[
                            'received_date'
                        ],

                    'sr_received_by' =>
                        $request
                            ->user()
                            ->id,
                ]);

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

                            'received_date' =>
                                $validated[
                                    'received_date'
                                ],

                            'module' =>
                                'store_requisition',
                        ]
                    );
            }
        );

        return response()->json([
            'success' => true,

            'message' =>
                'Store Requisition document received successfully.',

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

                        'receivedBy:id,name,email',

                        'workflowInstance.currentState',
                    ]),
        ]);
    }

    private function validateReceivingTask(
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
                    'This document receiving task has already been completed.',
            ]);
        }

        if (
            $task
                ->workflowState
                ?->code !==
            'document_receiving_sr'
        ) {
            throw ValidationException::withMessages([
                'task' =>
                    'This task is not a Document Receiving SR task.',
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