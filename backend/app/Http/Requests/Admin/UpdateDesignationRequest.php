<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDesignationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $designation = $this->route('designation');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('designations', 'code')
                    ->ignore($designation?->id ?? $designation),
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'level' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ];
    }
}