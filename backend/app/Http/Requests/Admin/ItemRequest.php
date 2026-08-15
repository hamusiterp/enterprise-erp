<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'item_no' => trim((string) $this->item_no),
            'item_description' => trim((string) $this->item_description),
            'category' => trim((string) $this->category),
            'unit' => trim((string) $this->unit),
            'type' => trim((string) $this->type),
            'inventory' => trim((string) $this->inventory),
            'status' => strtolower((string) $this->status),
        ]);
    }

    public function rules(): array
    {
        return [

            'item_no' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('sales_item', 'item_no')
                    ->ignore($this->route('item')),
            ],

            'item_description' => [
                'required',
                'string',
                'max:1000',
            ],

            'category' => [
                'required',
                'string',
                'max:50',
            ],

            'unit' => [
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

            'product_date' => [
                'nullable',
                'date',
            ],

            'type' => [
                'required',
                'string',
                'max:30',
            ],

            'inventory' => [
                'required',
                Rule::in([
                    'Stock',
                    'Non-Stock',
                ]),
            ],

            'registered_by' => [
                'nullable',
                'string',
                'max:100',
            ],

            'registered_by_user_id' => [
                'nullable',
                'exists:users,id',
            ],

            'date_registered' => [
                'nullable',
                'date',
            ],

        ];
    }

    public function messages(): array
    {
        return [

            'item_description.required'
                => 'Item description is required.',

            'category.required'
                => 'Category is required.',

            'unit.required'
                => 'Unit is required.',

            'type.required'
                => 'Item type is required.',

            'inventory.required'
                => 'Inventory type is required.',

            'inventory.in'
                => 'Inventory must be Stock or Non-Stock.',

            'status.required'
                => 'Status is required.',

            'status.in'
                => 'Invalid status selected.',

            'item_no.unique'
                => 'Item number already exists.',

        ];
    }
}