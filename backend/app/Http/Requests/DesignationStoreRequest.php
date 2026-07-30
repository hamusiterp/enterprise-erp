<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DesignationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'code' => ['required', 'string', 'max:50', 'unique:designations,code'],
        'name' => ['required', 'string', 'max:150'],
        'department_id' => ['nullable', 'exists:departments,id'],
        'level' => ['nullable', 'integer', 'min:1'],
        'status' => ['required', 'in:active,inactive'],
        'description' => ['nullable', 'string'],
    ];
}
}
