<?php

namespace App\Services;

use App\Models\User;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowState;
use App\Models\WorkflowTransition;
use Illuminate\Validation\ValidationException;

class WorkflowService
{
    public function getDefinition(
        string $code
    ): WorkflowDefinition {
        $workflow = WorkflowDefinition::query()
            ->where('code', $code)
            ->where('is_active', true)
            ->with([
                'states',
                'transitions.fromState',
                'transitions.toState',
            ])
            ->first();

        if (!$workflow) {
            throw ValidationException::withMessages([
                'workflow' =>
                    "No active workflow is configured for {$code}.",
            ]);
        }

        return $workflow;
    }

    public function getInitialState(
        WorkflowDefinition $workflow
    ): WorkflowState {
        $state = $workflow->states
            ->firstWhere('is_initial', true);

        if (!$state) {
            throw ValidationException::withMessages([
                'workflow' =>
                    'Workflow does not have an initial state.',
            ]);
        }

        return $state;
    }

    public function availableTransitions(
        WorkflowDefinition $workflow,
        WorkflowState $currentState,
        User $user
    ) {
        return $workflow->transitions
            ->where(
                'from_state_id',
                $currentState->id
            )
            ->where(
                'is_active',
                true
            )
            ->filter(
                function (
                    WorkflowTransition $transition
                ) use ($user) {
                    if (
                        !$transition->permission_name
                    ) {
                        return true;
                    }

                    return $user->can(
                        $transition->permission_name
                    );
                }
            )
            ->values();
    }

    public function transition(
        WorkflowDefinition $workflow,
        WorkflowState $currentState,
        string $action,
        User $user,
        ?string $remarks = null
    ): WorkflowState {
        $transition = $workflow->transitions
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
                    "Action '{$action}' is not allowed from state '{$currentState->code}'.",
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
                    'You do not have permission to perform this workflow action.',
            ]);
        }

        if (
            $transition->requires_remarks
            && blank($remarks)
        ) {
            throw ValidationException::withMessages([
                'remarks' =>
                    'Remarks are required for this workflow action.',
            ]);
        }

        $nextState = $workflow->states
            ->firstWhere(
                'id',
                $transition->to_state_id
            );

        if (!$nextState) {
            throw ValidationException::withMessages([
                'workflow' =>
                    'The target workflow state is not available.',
            ]);
        }

        return $nextState;
    }
}