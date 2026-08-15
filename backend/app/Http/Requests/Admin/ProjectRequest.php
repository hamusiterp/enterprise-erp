<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $projectSource = trim(
            (string) $this->input('project_source')
        );

        $hasConsultant = $this->toBoolean(
            $this->input('has_consultant')
        );

        $hasSpecifiedArea = $this->toBoolean(
            $this->input('has_specified_area')
        );

        $hasSiteHandoverDate = $this->toBoolean(
    $this->input('has_site_handover_date')
);

$hasCommencementDate = $this->toBoolean(
    $this->input('has_commencement_date')
);

$durationType = trim(
    (string) $this->input('duration_type')
);

$hasAdvancePayment = $this->toBoolean(
    $this->input('has_advance_payment')
);

$hasAdvanceRepayment = $this->toBoolean(
    $this->input('has_advance_repayment')
);

$hasAdvanceBond = $this->toBoolean(
    $this->input('has_advance_bond')
);

$hasPerformanceBond = $this->toBoolean(
    $this->input('has_performance_bond')
);

$hasPriceAdjustment = $this->toBoolean(
    $this->input('has_price_adjustment')
);

$hasRetention = $this->toBoolean(
    $this->input('has_retention')
);

$hasPriceIndex = $this->toBoolean(
    $this->input('has_price_index')
);

$hasLiquidityDamage = $this->toBoolean(
    $this->input('has_liquidity_damage')
);

        $this->merge([
            'project_source' => $projectSource,

            'project_name' => trim(
                (string) $this->input('project_name')
            ),

            'project_name_letter' => trim(
                (string) $this->input('project_name_letter')
            ),

            'project_description' => trim(
                (string) $this->input('project_description')
            ),

            'location' => trim(
                (string) $this->input('location')
            ),

            'employer' => trim(
                (string) $this->input('employer')
            ),

            'consultant' => trim(
                (string) $this->input('consultant')
            ),

            'area' => trim(
                (string) $this->input('area')
            ),

            'construction_project_type' => trim(
                (string) $this->input(
                    'construction_project_type'
                )
            ),

            'business_unit' => trim(
    (string) $this->input('business_unit')
),

'contract_type' => trim(
    (string) $this->input('contract_type')
),

'contract_pricing_type' => trim(
    (string) $this->input(
        'contract_pricing_type'
    )
),

'has_site_handover_date' =>
    $hasSiteHandoverDate,

'site_handover_date' =>
    $hasSiteHandoverDate
        ? $this->input('site_handover_date')
        : null,

'has_commencement_date' =>
    $hasCommencementDate,

'commencement_date' =>
    $hasCommencementDate
        ? $this->input('commencement_date')
        : null,

'duration_type' => $durationType,

'payment_term' => trim(
    (string) $this->input('payment_term')
),

'has_advance_payment' =>
    $hasAdvancePayment,

'advance_percent' =>
    $hasAdvancePayment
        ? $this->input('advance_percent')
        : null,

'has_advance_repayment' =>
    $hasAdvanceRepayment,

'advance_repayment_complete_percent' =>
    $hasAdvanceRepayment
        ? $this->input(
            'advance_repayment_complete_percent'
        )
        : null,

'advance_repayment_percent' =>
    $hasAdvanceRepayment
        ? $this->input(
            'advance_repayment_percent'
        )
        : null,

'advance_repayment_start' =>
    $hasAdvanceRepayment
        ? trim(
            (string) $this->input(
                'advance_repayment_start'
            )
        )
        : null,

'no_of_holidays' =>
    $durationType === 'working_days'
        ? $this->input('no_of_holidays')
        : null,

            'status' => strtolower(
                trim(
                    (string) $this->input(
                        'status',
                        'active'
                    )
                )
            ),

            'has_consultant' => $hasConsultant,
            'has_specified_area' => $hasSpecifiedArea,

            /*
             * Clear the reference that does not match
             * the selected source.
             */
            'bid_reference' =>
                $projectSource === 'Bid'
                    ? trim(
                        (string) $this->input(
                            'bid_reference'
                        )
                    )
                    : null,

            'work_order_no' =>
                $projectSource === 'Work Order'
                    ? trim(
                        (string) $this->input(
                            'work_order_no'
                        )
                    )
                    : null,

            /*
             * Clear conditional values when No is selected.
             */
            'consultant' =>
                $hasConsultant
                    ? trim(
                        (string) $this->input(
                            'consultant'
                        )
                    )
                    : null,

            'area' =>
                $hasSpecifiedArea
                    ? trim(
                        (string) $this->input(
                            'area'
                        )
                    )
                    : null,

                    'has_advance_bond' =>
    $hasAdvanceBond,

'advance_bond_percent' =>
    $hasAdvanceBond
        ? $this->input('advance_bond_percent')
        : null,

'advance_bond_type' =>
    $hasAdvanceBond
        ? trim(
            (string) $this->input(
                'advance_bond_type'
            )
        )
        : null,

'advance_bond_start_date' =>
    $hasAdvanceBond
        ? $this->input(
            'advance_bond_start_date'
        )
        : null,

'advance_bond_end_date' =>
    $hasAdvanceBond
        ? $this->input(
            'advance_bond_end_date'
        )
        : null,

'has_performance_bond' =>
    $hasPerformanceBond,

'performance_bond_percent' =>
    $hasPerformanceBond
        ? $this->input(
            'performance_bond_percent'
        )
        : null,

'performance_bond_type' =>
    $hasPerformanceBond
        ? trim(
            (string) $this->input(
                'performance_bond_type'
            )
        )
        : null,

'performance_bond_start_date' =>
    $hasPerformanceBond
        ? $this->input(
            'performance_bond_start_date'
        )
        : null,

'performance_bond_end_date' =>
    $hasPerformanceBond
        ? $this->input(
            'performance_bond_end_date'
        )
        : null,

    'has_price_adjustment' =>
    $hasPriceAdjustment,

'price_adjustment_percent' =>
    $hasPriceAdjustment
        ? $this->input('price_adjustment_percent')
        : null,

'has_retention' =>
    $hasRetention,

'retention_percent' =>
    $hasRetention
        ? $this->input('retention_percent')
        : null,

'has_price_index' =>
    $hasPriceIndex,

'has_liquidity_damage' =>
    $hasLiquidityDamage,

'liquidity_percent' =>
    $hasLiquidityDamage
        ? $this->input('liquidity_percent')
        : null,

'liquidity_limit' =>
    $hasLiquidityDamage
        ? $this->input('liquidity_limit')
        : null,

'engineering_facilities' =>
    array_values(
        array_unique(
            $this->input(
                'engineering_facilities',
                []
            )
        )
    ),
        ]);
    }

    public function rules(): array
    {
        return [
            /*
             * Generated by the backend.
             */
            'project_no' => [
                'nullable',
                'string',
                'max:20',
            ],

            'project_source' => [
                'required',
                Rule::in([
                    'Bid',
                    'Work Order',
                ]),
            ],

            'bid_reference' => [
                Rule::requiredIf(
                    fn (): bool =>
                        $this->input('project_source') === 'Bid'
                ),
                'nullable',
                'string',
                'max:30',
                Rule::exists(
                    'sales_bid',
                    'id'
                )->where(
                    fn ($query) => $query
                        ->whereRaw(
                            'LOWER(status_follow) = ?',
                            ['win']
                        )
                        ->whereRaw(
                            'LOWER(status) = ?',
                            ['approved']
                        )
                ),
            ],

            'work_order_no' => [
                Rule::requiredIf(
                    fn (): bool =>
                        $this->input('project_source')
                        === 'Work Order'
                ),
                'nullable',
                'string',
                'max:30',
                Rule::exists(
                    'sales_wor',
                    'work_order_no'
                )->where(
                    fn ($query) => $query
                        ->whereRaw(
                            'LOWER(status) = ?',
                            ['approved']
                        )
                        ->whereRaw(
                            'LOWER(source) <> ?',
                            ['ownuse']
                        )
                ),
            ],

            'project_name' => [
                'required',
                'string',
                'max:1000',
            ],

            'project_name_letter' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'project_description' => [
                'required',
                'string',
                'max:5000',
            ],

            'location' => [
                'required',
                'string',
                'max:2000',
            ],

            'customer_id' => [
                'required',
                'integer',
                Rule::exists(
                    'sales_customer',
                    'id'
                ),
            ],

            /*
             * The controller will derive employer from
             * the selected customer.
             */
            'employer' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'has_consultant' => [
                'required',
                'boolean',
            ],

            'consultant' => [
                Rule::requiredIf(
                    fn (): bool =>
                        $this->boolean('has_consultant')
                ),
                'nullable',
                'string',
                'max:1000',
            ],

            'has_specified_area' => [
                'required',
                'boolean',
            ],

            'area' => [
                Rule::requiredIf(
                    fn (): bool =>
                        $this->boolean(
                            'has_specified_area'
                        )
                ),
                'nullable',
                'string',
                'max:100',
            ],

            'construction_project_type' => [
                'required',
                Rule::in([
                    'Private Project',
                    'Federal Project',
                ]),
            ],

            'business_unit' => [
    'required',
    'string',
    'max:100',
],

'contract_type' => [
    'required',
    'string',
    'max:100',
],

'contract_amount_before_vat' => [
    'required',
    'numeric',
    'min:0',
    'max:9999999999999999999999999999.99',
],

'contract_pricing_type' => [
    'required',
    'string',
    'max:100',
],

'contract_date' => [
    'required',
    'date',
],

'has_site_handover_date' => [
    'required',
    'boolean',
],

'site_handover_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_site_handover_date'
            )
    ),
    'nullable',
    'date',
    'after_or_equal:contract_date',
],

'has_commencement_date' => [
    'required',
    'boolean',
],

'commencement_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_commencement_date'
            )
    ),
    'nullable',
    'date',
    'after_or_equal:contract_date',
],

'project_duration' => [
    'required',
    'integer',
    'min:1',
    'max:100000',
],

'duration_type' => [
    'required',
    Rule::in([
        'working_days',
        'calendar_days',
    ]),
],

'no_of_holidays' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->input('duration_type')
            === 'working_days'
    ),
    'nullable',
    'integer',
    'min:0',
    'max:100000',
],

'payment_term' => [
    'required',
    Rule::in([
        'cash_on_delivery',
        'after_work_executed',
    ]),
],

'has_advance_payment' => [
    'required',
    'boolean',
],

'advance_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_payment'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'has_advance_repayment' => [
    'required',
    'boolean',
],

'advance_repayment_complete_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_repayment'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'advance_repayment_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_repayment'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'advance_repayment_start' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_repayment'
            )
    ),
    'nullable',
    Rule::in([
        'first_payment',
        'second_payment',
        'third_payment',
        'fourth_payment',
    ]),
],

'interim_payment_schedule' => [
    'required',
    'integer',
    'min:1',
    'max:100000',
],

'advance_payment_due_date' => [
    'required',
    'date',
    'after_or_equal:contract_date',
],

'has_advance_bond' => [
    'required',
    'boolean',
],

'advance_bond_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_bond'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'advance_bond_type' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_bond'
            )
    ),
    'nullable',
    Rule::in([
        'cpo',
        'insurance_bank',
        'unconditional_bond',
        'conditional_bond',
        'bank_bond',
    ]),
],

'advance_bond_start_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_bond'
            )
    ),
    'nullable',
    'date',
],

'advance_bond_end_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_advance_bond'
            )
    ),
    'nullable',
    'date',
    'after_or_equal:advance_bond_start_date',
],

'has_performance_bond' => [
    'required',
    'boolean',
],

'performance_bond_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_performance_bond'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'performance_bond_type' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_performance_bond'
            )
    ),
    'nullable',
    Rule::in([
        'cpo',
        'insurance_bank',
        'unconditional_bond',
        'conditional_bond',
        'bank_bond',
    ]),
],

'performance_bond_start_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_performance_bond'
            )
    ),
    'nullable',
    'date',
],

'performance_bond_end_date' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_performance_bond'
            )
    ),
    'nullable',
    'date',
    'after_or_equal:performance_bond_start_date',
],

'has_price_adjustment' => [
    'required',
    'boolean',
],

'price_adjustment_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_price_adjustment'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'has_retention' => [
    'required',
    'boolean',
],

'retention_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean('has_retention')
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'has_price_index' => [
    'required',
    'boolean',
],

'has_liquidity_damage' => [
    'required',
    'boolean',
],

'liquidity_percent' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_liquidity_damage'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

'liquidity_limit' => [
    Rule::requiredIf(
        fn (): bool =>
            $this->boolean(
                'has_liquidity_damage'
            )
    ),
    'nullable',
    'numeric',
    'min:0',
],

'minimum_payment_time' => [
    'required',
    'integer',
    'min:1',
    'max:100000',
],

'engineering_facilities' => [
    'required',
    'array',
    'min:1',
],

'engineering_facilities.*' => [
    'string',
    Rule::in([
        'vehicle',
        'telephone',
        'internet',
        'office',
        'allowance',
    ]),
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
            'project_source.required' =>
                'Project source is required.',

            'bid_reference.required' =>
                'Bid reference is required when the project source is Bid.',

            'bid_reference.exists' =>
                'The selected bid is not eligible for project creation.',

            'work_order_no.required' =>
                'Work order is required when the project source is Work Order.',

            'work_order_no.exists' =>
                'The selected work order is not eligible for project creation.',

            'project_name.required' =>
                'Project name is required.',

            'project_description.required' =>
                'Project description is required.',

            'location.required' =>
                'Project location is required.',

            'customer_id.required' =>
                'Client/Employer is required.',

            'customer_id.exists' =>
                'The selected client does not exist.',

            'consultant.required' =>
                'Consultant name is required when Consultant is Yes.',

            'area.required' =>
                'Specified area is required when Specified Area is Yes.',

            'construction_project_type.required' =>
                'Construction project type is required.',

                'business_unit.required' =>
    'Business unit is required.',

'contract_type.required' =>
    'Contract type is required.',

'contract_amount_before_vat.required' =>
    'Main contract amount before VAT is required.',

'contract_amount_before_vat.numeric' =>
    'Main contract amount must be numeric.',

'contract_amount_before_vat.min' =>
    'Main contract amount cannot be negative.',

'contract_pricing_type.required' =>
    'Contract pricing type is required.',

    'contract_date.required' =>
    'Contract date is required.',

'site_handover_date.required' =>
    'Site handover date is required when Yes is selected.',

'site_handover_date.after_or_equal' =>
    'Site handover date cannot be before the contract date.',

'commencement_date.required' =>
    'Commencement date is required when Yes is selected.',

'commencement_date.after_or_equal' =>
    'Commencement date cannot be before the contract date.',

'project_duration.required' =>
    'Project duration is required.',

'project_duration.min' =>
    'Project duration must be at least one day.',

'duration_type.required' =>
    'Please select Working Days or Calendar Days.',

'no_of_holidays.required' =>
    'Number of holidays and weekends is required for working-day duration.',

    'payment_term.required' =>
    'Payment term is required.',

'payment_term.in' =>
    'The selected payment term is invalid.',

'advance_percent.required' =>
    'Advance payment percentage is required when advance payment is Yes.',

'advance_percent.max' =>
    'Advance payment percentage cannot exceed 100%.',

'advance_repayment_complete_percent.required' =>
    'The project completion percentage for full advance repayment is required.',

'advance_repayment_percent.required' =>
    'Advance repayment percentage is required.',

'advance_repayment_start.required' =>
    'Advance repayment start is required.',

'interim_payment_schedule.required' =>
    'Interim payment schedule is required.',

'interim_payment_schedule.integer' =>
    'Interim payment schedule must be a whole number.',

'advance_payment_due_date.required' =>
    'Advance payment due date is required.',

'advance_payment_due_date.after_or_equal' =>
    'Advance payment due date cannot be before the contract date.',

    'advance_bond_percent.required' =>
    'Advance bond percentage is required.',

'advance_bond_type.required' =>
    'Advance bond type is required.',

'advance_bond_start_date.required' =>
    'Advance bond start date is required.',

'advance_bond_end_date.required' =>
    'Advance bond end date is required.',

'advance_bond_end_date.after_or_equal' =>
    'Advance bond end date cannot be before the start date.',

'performance_bond_percent.required' =>
    'Performance bond percentage is required.',

'performance_bond_type.required' =>
    'Performance bond type is required.',

'performance_bond_start_date.required' =>
    'Performance bond start date is required.',

'performance_bond_end_date.required' =>
    'Performance bond end date is required.',

'performance_bond_end_date.after_or_equal' =>
    'Performance bond end date cannot be before the start date.',

    'price_adjustment_percent.required' =>
    'Price adjustment percentage is required.',

'retention_percent.required' =>
    'Retention percentage is required.',

'liquidity_percent.required' =>
    'Liquidity percentage is required.',

'liquidity_limit.required' =>
    'Limit of liquidity damage is required.',

'minimum_payment_time.required' =>
    'Minimum payment time after certificate is required.',

'engineering_facilities.required' =>
    'Select at least one engineering facility.',

'engineering_facilities.min' =>
    'Select at least one engineering facility.',
        ];
    }

    private function toBoolean(mixed $value): bool
    {
        return filter_var(
            $value,
            FILTER_VALIDATE_BOOLEAN
        );
    }
}