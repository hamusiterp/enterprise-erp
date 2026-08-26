<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowRoutingRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WorkflowRoutingRuleController extends Controller
{
    public function index(
    Request $request,
    $workflow
): JsonResponse
{
    $workflow = WorkflowDefinition::findOrFail($workflow);

    abort_unless(
        $request->user()?->can('workflow-settings.view'),
        403,
        'You do not have permission to view workflow routing rules.'
    );

    $rules = WorkflowRoutingRule::query()
        ->where(
            'workflow_definition_id',
            $workflow->id
        )
        ->with([
            'workflowState:id,name,code',
            'workflowTransition:id,name,action',
        ])
        ->orderBy('priority')
        ->orderBy('id')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $rules,
    ]);
}

    public function store(
    Request $request,
    $workflow
): JsonResponse
{
    $workflow = WorkflowDefinition::findOrFail($workflow);

    abort_unless(
        $request->user()?->can('workflow-settings.manage'),
        403,
        'You do not have permission to manage workflow routing rules.'
    );

    $validated = $this->validateRule(
        $request,
        $workflow
    );

    $rule = DB::transaction(
        function () use (
            $validated,
            $workflow,
            $request
        ) {
            return WorkflowRoutingRule::create([
                ...$validated,

                'workflow_definition_id' =>
                    $workflow->id,

                'created_by' =>
                    $request->user()->id,

                'updated_by' =>
                    $request->user()->id,
            ]);
        }
    );

    return response()->json([
        'success' => true,
        'message' =>
            'Workflow routing rule created successfully.',
        'data' =>
            $rule->load([
                'workflowState:id,name,code',
                'workflowTransition:id,name,action',
            ]),
    ], 201);
}

    public function update(
    Request $request,
    $workflow,
    WorkflowRoutingRule $routingRule
): JsonResponse
{
    $workflow = WorkflowDefinition::findOrFail($workflow);

    abort_unless(
        $request->user()?->can('workflow-settings.manage'),
        403,
        'You do not have permission to manage workflow routing rules.'
    );

    abort_unless(
        $routingRule->workflow_definition_id === $workflow->id,
        404
    );

    $validated = $this->validateRule(
        $request,
        $workflow
    );

    DB::transaction(function () use (
        $routingRule,
        $validated,
        $request
    ) {
        $routingRule->update([
            ...$validated,
            'updated_by' => $request->user()->id,
        ]);
    });

    return response()->json([
        'success' => true,
        'message' =>
            'Workflow routing rule updated successfully.',
        'data' =>
            $routingRule
                ->fresh()
                ->load([
                    'workflowState:id,name,code',
                    'workflowTransition:id,name,action',
                ]),
    ]);
}

    public function destroy(
        Request $request,
        WorkflowDefinition $workflow,
        WorkflowRoutingRule $routingRule
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('workflow-settings.manage'),
            403,
            'You do not have permission to manage workflow routing rules.'
        );

        abort_unless(
            $routingRule->workflow_definition_id ===
                $workflow->id,
            404
        );

        $routingRule->delete();

        return response()->json([
            'success' => true,
            'message' =>
                'Workflow routing rule deleted successfully.',
        ]);
    }

    private function validateRule(
        Request $request,
        WorkflowDefinition $workflow
    ): array {
        return $request->validate([
            'workflow_state_id' => [
                'required',
                'integer',

                Rule::exists(
                    'workflow_states',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'workflow_definition_id',
                            $workflow->id
                        )
                ),
            ],

            'workflow_transition_id' => [
                'nullable',
                'integer',

                Rule::exists(
                    'workflow_transitions',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'workflow_definition_id',
                            $workflow->id
                        )
                ),
            ],

            'assignment_type' => [
                'required',
                Rule::in([
                    'department',
                    'role',
                    'permission',
                    'user',
                ]),
            ],

            'assigned_to_id' => [
                'nullable',
                'integer',
            ],

            'assigned_to_key' => [
                'nullable',
                'string',
                'max:150',
            ],

            'assignment_mode' => [
                'required',
                Rule::in([
                    'all',
                    'first_available',
                    'manual',
                ]),
            ],

            'sla_minutes' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'priority' => [
                'required',
                'integer',
                'min:1',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],
        ]);
    }
}