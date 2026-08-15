<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'category' => trim(
                (string) $this->input('category')
            ),

            'type' => trim(
                (string) $this->input('type')
            ),

            'status' => strtolower(
                trim(
                    (string) $this->input(
                        'status',
                        'active'
                    )
                )
            ),
        ]);
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id
            ?? $this->route('category');

        return [
            'category' => [
                'required',
                'string',
                'max:50',

                Rule::unique(
                    'sales_category',
                    'category'
                )
                    ->where(
                        fn ($query) => $query->where(
                            'type',
                            $this->input('type')
                        )
                    )
                    ->ignore($categoryId),
            ],

            'type' => [
                'required',
                'string',
                'max:20',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category.required' =>
                'Category name is required.',

            'category.max' =>
                'Category name cannot exceed 50 characters.',

            'category.unique' =>
                'This category already exists under the selected type.',

            'type.required' =>
                'Category type is required.',

            'type.max' =>
                'Category type cannot exceed 20 characters.',

            'status.required' =>
                'Status is required.',

            'status.in' =>
                'The selected status is invalid.',
        ];
    }
}