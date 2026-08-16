<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\FiscalYear;
use Illuminate\Validation\Validator;

class StoreFiscalYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('fiscal-years.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],

            'code' => [
                'required',
                'string',
                'max:50',
                'unique:fiscal_years,code',
            ],

            'start_date' => ['required', 'date'],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'is_current' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'is_locked' => ['sometimes', 'boolean'],

            'status' => [
                'required',
                Rule::in([
                    'open',
                    'closed',
                ]),
            ],

            'remarks' => ['nullable', 'string'],
        ];
    }

    public function after(): array
{
    return [
        function (Validator $validator) {
            if (
                !$this->filled('start_date') ||
                !$this->filled('end_date')
            ) {
                return;
            }

            $overlapExists = FiscalYear::query()
                ->whereDate(
                    'start_date',
                    '<=',
                    $this->input('end_date')
                )
                ->whereDate(
                    'end_date',
                    '>=',
                    $this->input('start_date')
                )
                ->exists();

            if ($overlapExists) {
                $validator->errors()->add(
                    'start_date',
                    'The fiscal year overlaps with an existing fiscal year.'
                );
            }
        },
    ];
}
}