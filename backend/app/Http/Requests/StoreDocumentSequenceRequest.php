<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentSequenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('document-sequences.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'document_type' => [
                'required',
                'string',
                'max:100',
            ],

            'name' => [
                'required',
                'string',
                'max:150',
            ],

            'prefix' => [
                'required',
                'string',
                'max:30',
            ],

            'fiscal_year_id' => [
                'required',
                'integer',
                'exists:fiscal_years,id',
            ],

            'current_number' => [
                'sometimes',
                'integer',
                'min:0',
            ],

            'number_length' => [
                'required',
                'integer',
                'min:1',
                'max:20',
            ],

            'format' => [
                'required',
                'string',
                'max:200',
            ],

            'reset_per_fiscal_year' => [
                'required',
                'boolean',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],

            'document_type' => [
                'required',
                'string',
                'max:100',

                Rule::unique(
                    'document_sequences',
                    'document_type'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'fiscal_year_id',
                            $this->input('fiscal_year_id')
                        )
                ),
            ],
        ];
    }
}