<?php

namespace App\Http\Requests;

use App\Models\AccessPolicy;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccessPolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('access-policies.manage') ?? false;
    }

    public function rules(): array
    {
        $policy = $this->route('accessPolicy');

        $policyId = $policy instanceof AccessPolicy
            ? $policy->id
            : $policy;

        return [
            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique(
                    'access_policies',
                    'code'
                )->ignore($policyId),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'policy_type' => [
                'required',
                Rule::in([
                    'allow',
                    'deny',
                ]),
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'priority' => [
                'required',
                'integer',
                'min:1',
            ],

            'schedules' => [
                'required',
                'array',
                'min:1',
            ],

            'schedules.*.day_of_week' => [
                'required',
                'integer',
                'between:1,7',
            ],

            'schedules.*.start_time' => [
                'nullable',
                'date_format:H:i',
            ],

            'schedules.*.end_time' => [
                'nullable',
                'date_format:H:i',
            ],

            'schedules.*.is_allowed_day' => [
                'required',
                'boolean',
            ],

            'schedules.*.is_active' => [
                'required',
                'boolean',
            ],

            'assignments' => [
                'nullable',
                'array',
            ],

            'assignments.*.target_type' => [
                'required',
                Rule::in([
                    'system',
                    'module',
                    'permission',
                    'role',
                    'user',
                ]),
            ],

            'assignments.*.target_key' => [
                'nullable',
                'string',
                'max:150',
            ],

            'assignments.*.target_id' => [
                'nullable',
                'integer',
            ],

            'assignments.*.is_active' => [
                'required',
                'boolean',
            ],

            'assignments.*.effective_from' => [
                'nullable',
                'date',
            ],

            'assignments.*.effective_to' => [
                'nullable',
                'date',
            ],

            'assignments.*.remarks' => [
                'nullable',
                'string',
            ],
        ];
    }
}