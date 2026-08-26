<?php

namespace App\Http\Requests;

use App\Models\WorkflowDefinition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkflowDefinitionRequest extends StoreWorkflowDefinitionRequest
{
    public function rules(): array
    {
        $workflow = $this->route('workflowDefinition');

        $workflowId =
            $workflow instanceof WorkflowDefinition
                ? $workflow->id
                : $workflow;

        $rules = parent::rules();

        $rules['code'] = [
            'required',
            'string',
            'max:100',
            Rule::unique(
                'workflow_definitions',
                'code'
            )->ignore($workflowId),
        ];

        return $rules;
    }
}