<?php

namespace App\Services;

use App\Models\User;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowInstance;
use App\Models\WorkflowState;
use App\Models\WorkflowTask;
use App\Models\WorkflowTaskHistory;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkflowRuntimeService
{
    public function __construct(
        private readonly WorkflowService $workflowService,
    private readonly WorkflowRoutingService $routingService,
    private readonly WorkflowTaskOwnershipService $ownershipService
    ) {
    }

    public function start(
        string $workflowCode,
        string $subjectType,
        int $subjectId,
        ?string $referenceNo,
        User $user
    ): WorkflowInstance {
        return DB::transaction(function () use (
            $workflowCode,
            $subjectType,
            $subjectId,
            $referenceNo,
            $user
        ) {
            $workflow =
                $this->workflowService
                    ->getDefinition(
                        $workflowCode
                    );

            $existing = WorkflowInstance::query()
                ->where(
                    'workflow_definition_id',
                    $workflow->id
                )
                ->where(
                    'subject_type',
                    $subjectType
                )
                ->where(
                    'subject_id',
                    $subjectId
                )
                ->first();

            if ($existing) {
                throw ValidationException::withMessages([
                    'workflow' =>
                        'A workflow instance already exists for this record.',
                ]);
            }

            $initialState =
                $this->workflowService
                    ->getInitialState(
                        $workflow
                    );

            $instance = WorkflowInstance::create([
                'workflow_definition_id' =>
                    $workflow->id,

                'subject_type' =>
                    $subjectType,

                'subject_id' =>
                    $subjectId,

                'reference_no' =>
                    $referenceNo,

                'current_state_id' =>
                    $initialState->id,

                'status' =>
                    'running',

                'started_by' =>
                    $user->id,

                'started_at' =>
                    now(),
            ]);

            WorkflowTaskHistory::create([
                'workflow_instance_id' =>
                    $instance->id,

                'workflow_task_id' =>
                    null,

                'from_state_id' =>
                    null,

                'to_state_id' =>
                    $initialState->id,

                'action' =>
                    'created',

                'performed_by' =>
                    $user->id,

                'performed_at' =>
                    now(),

                'remarks' =>
                    null,

                'metadata' => [
                    'workflow_code' =>
                        $workflowCode,

                    'reference_no' =>
                        $referenceNo,
                ],
            ]);

            /*
             * Only create an initial task if a routing
             * rule is configured for the initial state.
             *
             * For Draft, often the requester already owns
             * the record, so a routing rule may not exist.
             */
            $this->createTaskIfRoutable(
                $instance,
                $initialState,
                null
            );

            return $instance->fresh([
                'workflowDefinition',
                'currentState',
                'tasks',
                'history',
            ]);
        });
    }

    public function performAction(
        WorkflowInstance $instance,
        string $action,
        User $user,
        ?string $remarks = null,
        ?array $metadata = null
    ): WorkflowInstance {
        return DB::transaction(function () use (
            $instance,
            $action,
            $user,
            $remarks,
            $metadata
        ) {
            $instance->load([
                'workflowDefinition.states',
                'workflowDefinition.transitions.fromState',
                'workflowDefinition.transitions.toState',
                'currentState',
            ]);

            if ($instance->status !== 'running') {
                throw ValidationException::withMessages([
                    'workflow' =>
                        'This workflow is not currently running.',
                ]);
            }

            $workflow =
                $instance->workflowDefinition;

            $currentState =
                $instance->currentState;

            if (!$currentState) {
                throw ValidationException::withMessages([
                    'workflow' =>
                        'Current workflow state is missing.',
                ]);
            }

            $transition =
                $workflow->transitions
                    ->where(
                        'from_state_id',
                        $currentState->id
                    )
                    ->where(
                        'action',
                        $action
                    )
                    ->where(
                        'is_active',
                        true
                    )
                    ->first();

            if (!$transition) {
                throw ValidationException::withMessages([
                    'workflow' =>
                        "Action '{$action}' is not available from '{$currentState->name}'.",
                ]);
            }

            if (
                $transition->permission_name
                && !$user->can(
                    $transition->permission_name
                )
            ) {
                throw ValidationException::withMessages([
                    'workflow' =>
                        'You do not have permission to perform this action.',
                ]);
            }

            if (
                $transition->requires_remarks
                && blank($remarks)
            ) {
                throw ValidationException::withMessages([
                    'remarks' =>
                        'Remarks are required for this action.',
                ]);
            }

            $currentTask =
                WorkflowTask::query()
                    ->where(
                        'workflow_instance_id',
                        $instance->id
                    )
                    ->whereIn(
                        'status',
                        [
                            'pending',
                            'in_progress',
                        ]
                    )
                    ->latest('id')
                    ->first();

            if ($currentTask) {
                $currentTask->update([
                    'status' =>
                        $transition->is_return
                            ? 'returned'
                            : 'completed',

                    'completed_by' =>
                        $user->id,

                    'completed_at' =>
                        now(),

                    'remarks' =>
                        $remarks,
                ]);
            }

            if ($currentTask) {
    $this->ownershipService
        ->authorize(
            $user,
            $currentTask
        );
}

            $nextState =
                $workflow->states
                    ->firstWhere(
                        'id',
                        $transition->to_state_id
                    );

            if (!$nextState) {
                throw ValidationException::withMessages([
                    'workflow' =>
                        'Target workflow state could not be resolved.',
                ]);
            }

            $instance->update([
                'current_state_id' =>
                    $nextState->id,
            ]);

            WorkflowTaskHistory::create([
                'workflow_instance_id' =>
                    $instance->id,

                'workflow_task_id' =>
                    $currentTask?->id,

                'from_state_id' =>
                    $currentState->id,

                'to_state_id' =>
                    $nextState->id,

                'action' =>
                    $transition->action,

                'performed_by' =>
                    $user->id,

                'performed_at' =>
                    now(),

                'remarks' =>
                    $remarks,

                'metadata' =>
                    $metadata,
            ]);

            if ($nextState->is_final) {
                $instance->update([
                    'status' =>
                        $nextState->code === 'rejected'
                            ? 'rejected'
                            : 'completed',

                    'completed_at' =>
                        now(),
                ]);

                return $instance->fresh([
                    'workflowDefinition',
                    'currentState',
                    'tasks',
                    'history',
                ]);
            }

            $this->createTaskIfRoutable(
                $instance,
                $nextState,
                $transition
            );

            return $instance->fresh([
                'workflowDefinition',
                'currentState',
                'tasks',
                'history',
            ]);
        });
    }

    public function startTask(
        WorkflowTask $task,
        User $user
    ): WorkflowTask {
        $this->ownershipService
    ->authorize(
        $user,
        $task
    );
        if ($task->status !== 'pending') {
            throw ValidationException::withMessages([
                'task' =>
                    'Only pending tasks can be started.',
            ]);
        }

        $task->update([
            'status' =>
                'in_progress',

            'received_by' =>
                $user->id,

            'started_at' =>
                now(),
        ]);

        return $task->fresh();
    }

    private function createTaskIfRoutable(
        WorkflowInstance $instance,
        WorkflowState $state,
        ?WorkflowTransition $transition
    ): ?WorkflowTask {
        try {
            return $this->routingService
                ->createTask(
                    $instance,
                    $state,
                    $transition
                );
        } catch (ValidationException $exception) {
            /*
             * Some states, especially Draft, may intentionally
             * have no routing rule.
             *
             * We only silently allow this for editable/initial states.
             */
            if (
                $state->is_initial
                || $state->is_editable
            ) {
                return null;
            }

            throw $exception;
        }
    }
}