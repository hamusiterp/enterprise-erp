<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSalesSubcontractorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $type = strtolower(
            trim((string) $this->input('type'))
        );

        $this->merge([
            'type' => $type,
            'status' => strtolower(
                trim(
                    (string) $this->input(
                        'status',
                        'active'
                    )
                )
            ),
        ]);

        if ($type === 'company') {
            $this->merge([
                'firstname' => null,
                'lastname' => null,
            ]);
        }

        if ($type === 'individual') {
            $this->merge([
                'company_name' => null,
                'tin_no' => null,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'type' => [
                'required',
                Rule::in([
                    'company',
                    'individual',
                ]),
            ],

            'firstname' => [
                'nullable',
                'required_if:type,individual',
                'string',
                'max:100',
            ],

            'lastname' => [
                'nullable',
                'required_if:type,individual',
                'string',
                'max:100',
            ],

            'company_name' => [
                'nullable',
                'required_if:type,company',
                'string',
                'max:150',
            ],

            'tin_no' => [
                'nullable',
                'required_if:type,company',
                'string',
                'max:50',
            ],

            'address' => [
                'required',
                'string',
            ],

            'contact_person' => [
                'required',
                'string',
                'max:100',
            ],

            'phone_number' => [
                'required',
                'string',
                'max:100',
            ],

            'tax_percent' => [
                'required',
                'numeric',
                Rule::in([
                    0,
                    2,
                    10,
                    15,
                ]),
            ],

            'category_id' => [
                'required',
                'integer',
                'exists:sales_category,id',
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
            'firstname.required_if' =>
                'First name is required for an individual.',

            'lastname.required_if' =>
                'Last name is required for an individual.',

            'company_name.required_if' =>
                'Company name is required for a company.',

            'tin_no.required_if' =>
                'TIN number is required for a company.',

            'category_id.exists' =>
                'The selected category is invalid.',

            'tax_percent.in' =>
                'Tax percent must be 0%, 2%, 10%, or 15%.',
        ];
    }
}