<?php

namespace App\Services;

use App\Models\WorkflowInstance;
use App\Models\WorkflowRoutingRule;
use App\Models\WorkflowState;
use App\Models\WorkflowTask;
use App\Models\WorkflowTransition;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkflowRoutingService
{
    public function createTask(
        WorkflowInstance $instance,
        WorkflowState $state,
        ?WorkflowTransition $transition = null
    ): WorkflowTask {
        $rule = WorkflowRoutingRule::query()
            ->where(
                'workflow_definition_id',
                $instance->workflow_definition_id
            )
            ->where(
                'workflow_state_id',
                $state->id
            )
            ->where('is_active', true)
            ->when(
                $transition,
                function ($query) use ($transition) {
                    $query->where(function ($query) use ($transition) {
                        $query
                            ->whereNull('workflow_transition_id')
                            ->orWhere(
                                'workflow_transition_id',
                                $transition->id
                            );
                    });
                },
                function ($query) {
                    $query->whereNull(
                        'workflow_transition_id'
                    );
                }
            )
            ->orderBy('priority')
            ->first();

        if (!$rule) {
            throw ValidationException::withMessages([
                'workflow' =>
                    "No routing rule is configured for workflow state '{$state->code}'.",
            ]);
        }

        return DB::transaction(function () use (
            $instance,
            $state,
            $rule
        ) {
            $dueAt = null;

            if ($rule->sla_minutes) {
                $dueAt = Carbon::now()
                    ->addMinutes(
                        $rule->sla_minutes
                    );
            }

            return WorkflowTask::create([
                'workflow_instance_id' =>
                    $instance->id,

                'workflow_state_id' =>
                    $state->id,

                'assignment_type' =>
                    $rule->assignment_type,

                'assigned_to_id' =>
                    $rule->assigned_to_id,

                'assigned_to_key' =>
                    $rule->assigned_to_key,

                'status' =>
                    'pending',

                'received_at' =>
                    now(),

                'due_at' =>
                    $dueAt,

                'remarks' =>
                    $rule->remarks,
            ]);
        });
    }
}