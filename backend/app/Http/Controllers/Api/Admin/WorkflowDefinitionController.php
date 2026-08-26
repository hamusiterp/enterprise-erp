<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkflowDefinitionRequest;
use App\Http\Requests\UpdateWorkflowDefinitionRequest;
use App\Models\WorkflowDefinition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkflowDefinitionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('workflow-settings.view'),
            403,
            'You do not have permission to view workflow settings.'
        );

        $query = WorkflowDefinition::query()
            ->with([
                'states',
                'transitions.fromState',
                'transitions.toState',
            ]);

        if ($request->filled('module_key')) {
            $query->where(
                'module_key',
                $request->string('module_key')
            );
        }

        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                $request->boolean('is_active')
            );
        }

        $workflows = $query
            ->orderBy('module_key')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $workflows,
        ]);
    }

    public function store(
        StoreWorkflowDefinitionRequest $request
    ): JsonResponse {
        $workflow = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $states = $data['states'];
            $transitions = $data['transitions'] ?? [];

            unset(
                $data['states'],
                $data['transitions']
            );

            $data['created_by'] = $request->user()->id;
            $data['updated_by'] = $request->user()->id;

            $workflow = WorkflowDefinition::create($data);

            $stateMap = [];

            foreach ($states as $stateData) {
                $state = $workflow
                    ->states()
                    ->create($stateData);

                $stateMap[$state->code] = $state->id;
            }

            foreach ($transitions as $transitionData) {
                $fromCode =
                    $transitionData['from_state_code'];

                $toCode =
                    $transitionData['to_state_code'];

                unset(
                    $transitionData['from_state_code'],
                    $transitionData['to_state_code']
                );

                $transitionData['from_state_id'] =
                    $stateMap[$fromCode];

                $transitionData['to_state_id'] =
                    $stateMap[$toCode];

                $workflow
                    ->transitions()
                    ->create($transitionData);
            }

            return $workflow;
        });

        return response()->json([
            'success' => true,
            'message' => 'Workflow created successfully.',
            'data' => $workflow->load([
                'states',
                'transitions.fromState',
                'transitions.toState',
            ]),
        ], 201);
    }

    public function show(
        Request $request,
        WorkflowDefinition $workflowDefinition
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('workflow-settings.view'),
            403,
            'You do not have permission to view workflow settings.'
        );

        return response()->json([
            'success' => true,
            'data' => $workflowDefinition->load([
                'states',
                'transitions.fromState',
                'transitions.toState',
            ]),
        ]);
    }
public function update(
    UpdateWorkflowDefinitionRequest $request,
    WorkflowDefinition $workflowDefinition
): JsonResponse {
    $workflowDefinition = DB::transaction(
        function () use (
            $request,
            $workflowDefinition
        ) {
            $data = $request->validated();

            $states = $data['states'];
            $transitions =
                $data['transitions'] ?? [];

            unset(
                $data['states'],
                $data['transitions']
            );

            $data['updated_by'] =
                $request->user()->id;

            /*
             * Update workflow header.
             */
            $workflowDefinition->update(
                $data
            );

            /*
             * ==========================================
             * 1. STATES
             * Update existing / create new
             * while preserving existing IDs.
             * ==========================================
             */

            $stateMap = [];

            $submittedStateCodes =
                collect($states)
                    ->pluck('code')
                    ->values()
                    ->all();

            foreach ($states as $stateData) {
                $state =
                    $workflowDefinition
                        ->states()
                        ->where(
                            'code',
                            $stateData['code']
                        )
                        ->first();

                if ($state) {
                    $state->update(
                        $stateData
                    );
                } else {
                    $state =
                        $workflowDefinition
                            ->states()
                            ->create(
                                $stateData
                            );
                }

                $stateMap[
                    $state->code
                ] = $state->id;
            }

            /*
             * ==========================================
             * 2. TRANSITIONS
             * Update existing / create new
             * while preserving IDs.
             * ==========================================
             */

            $submittedTransitionKeys = [];

            foreach (
                $transitions
                as $transitionData
            ) {
                $fromCode =
                    $transitionData[
                        'from_state_code'
                    ];

                $toCode =
                    $transitionData[
                        'to_state_code'
                    ];

                $action =
                    $transitionData[
                        'action'
                    ];

                $transitionKey =
                    $fromCode . '|' . $action;

                $submittedTransitionKeys[] =
                    $transitionKey;

                unset(
                    $transitionData[
                        'from_state_code'
                    ],
                    $transitionData[
                        'to_state_code'
                    ]
                );

                $fromStateId =
                    $stateMap[$fromCode];

                $toStateId =
                    $stateMap[$toCode];

                $transition =
                    $workflowDefinition
                        ->transitions()
                        ->where(
                            'from_state_id',
                            $fromStateId
                        )
                        ->where(
                            'action',
                            $action
                        )
                        ->first();

                $transitionValues = [
                    ...$transitionData,

                    'from_state_id' =>
                        $fromStateId,

                    'to_state_id' =>
                        $toStateId,
                ];

                if ($transition) {
                    $transition->update(
                        $transitionValues
                    );
                } else {
                    $workflowDefinition
                        ->transitions()
                        ->create(
                            $transitionValues
                        );
                }
            }

            /*
             * ==========================================
             * 3. DELETE REMOVED TRANSITIONS
             * ==========================================
             */

            $existingTransitions =
                $workflowDefinition
                    ->transitions()
                    ->with('fromState')
                    ->get();

            foreach (
                $existingTransitions
                as $existingTransition
            ) {
                $fromCode =
                    $existingTransition
                        ->fromState
                        ?->code;

                if (!$fromCode) {
                    continue;
                }

                $existingKey =
                    $fromCode
                    . '|'
                    . $existingTransition
                        ->action;

                if (
                    !in_array(
                        $existingKey,
                        $submittedTransitionKeys,
                        true
                    )
                ) {
                    $existingTransition
                        ->delete();
                }
            }

            /*
             * ==========================================
             * 4. DELETE REMOVED STATES
             *
             * Transitions are deleted first because
             * they reference workflow states.
             * ==========================================
             */

            $workflowDefinition
                ->states()
                ->whereNotIn(
                    'code',
                    $submittedStateCodes
                )
                ->delete();

            return $workflowDefinition;
        }
    );

    return response()->json([
        'success' => true,
        'message' =>
            'Workflow updated successfully.',

        'data' =>
            $workflowDefinition
                ->fresh()
                ->load([
                    'states',
                    'transitions.fromState',
                    'transitions.toState',
                ]),
    ]);
}
}