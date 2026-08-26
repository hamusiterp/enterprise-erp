<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkflowDefinitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('workflow-settings.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:100',
                'unique:workflow_definitions,code',
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'module_key' => [
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'version' => [
                'required',
                'integer',
                'min:1',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'states' => [
                'required',
                'array',
                'min:1',
            ],

            'states.*.code' => [
                'required',
                'string',
                'max:100',
            ],

            'states.*.name' => [
                'required',
                'string',
                'max:150',
            ],

            'states.*.sequence' => [
                'required',
                'integer',
                'min:1',
            ],

            'states.*.is_initial' => [
                'required',
                'boolean',
            ],

            'states.*.is_final' => [
                'required',
                'boolean',
            ],

            'states.*.is_editable' => [
                'required',
                'boolean',
            ],

            'states.*.is_active' => [
                'required',
                'boolean',
            ],

            'states.*.color' => [
                'nullable',
                'string',
                'max:30',
            ],

            'states.*.description' => [
                'nullable',
                'string',
            ],

            'transitions' => [
                'nullable',
                'array',
            ],

            /*
             * For create we will reference states by code,
             * because state IDs do not exist yet.
             */
            'transitions.*.from_state_code' => [
                'required',
                'string',
                'max:100',
            ],

            'transitions.*.to_state_code' => [
                'required',
                'string',
                'max:100',
            ],

            'transitions.*.action' => [
                'required',
                'string',
                'max:100',
            ],

            'transitions.*.name' => [
                'required',
                'string',
                'max:150',
            ],

            'transitions.*.permission_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'transitions.*.is_return' => [
                'required',
                'boolean',
            ],

            'transitions.*.requires_remarks' => [
                'required',
                'boolean',
            ],

            'transitions.*.is_active' => [
                'required',
                'boolean',
            ],

            'transitions.*.sequence' => [
                'required',
                'integer',
                'min:1',
            ],

            'transitions.*.description' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {
                $states = $this->input('states', []);

                $initialCount = collect($states)
                    ->where('is_initial', true)
                    ->count();

                if ($initialCount !== 1) {
                    $validator->errors()->add(
                        'states',
                        'A workflow must have exactly one initial state.'
                    );
                }

                $codes = collect($states)
                    ->pluck('code')
                    ->filter();

                if ($codes->duplicates()->isNotEmpty()) {
                    $validator->errors()->add(
                        'states',
                        'Workflow state codes must be unique.'
                    );
                }

                $validCodes = $codes->values()->all();

                foreach (
                    $this->input('transitions', [])
                    as $transition
                ) {
                    if (
                        !in_array(
                            $transition['from_state_code'] ?? '',
                            $validCodes,
                            true
                        )
                    ) {
                        $validator->errors()->add(
                            'transitions',
                            'A transition contains an invalid source state.'
                        );
                    }

                    if (
                        !in_array(
                            $transition['to_state_code'] ?? '',
                            $validCodes,
                            true
                        )
                    ) {
                        $validator->errors()->add(
                            'transitions',
                            'A transition contains an invalid target state.'
                        );
                    }
                }
            },
        ];
    }
}