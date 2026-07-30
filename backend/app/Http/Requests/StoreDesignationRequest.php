<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('designations', 'name')
                    ->whereNull('deleted_at'),
            ],

            'department_id' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')
                    ->whereNull('deleted_at'),
            ],

            'level' => [
                'nullable',
                'integer',
                'min:1',
                'max:999',
            ],

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>
                'Designation name is required.',

            'name.unique' =>
                'This designation name already exists.',

            'department_id.exists' =>
                'The selected department does not exist.',

            'level.integer' =>
                'Designation level must be a valid number.',

            'level.min' =>
                'Designation level must be at least 1.',

            'status.in' =>
                'Status must be active or inactive.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name)
                ? trim($this->name)
                : $this->name,

            'description' => is_string($this->description)
                ? trim($this->description)
                : $this->description,

            'status' => is_string($this->status)
                ? strtolower(trim($this->status))
                : $this->status,
        ]);
    }
}