<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class StoreStoreRequisitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'store-requisitions.create'
        ) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'used_for' =>
                $this->used_for
                    ? strtolower(
                        trim(
                            (string) $this->used_for
                        )
                    )
                    : null,

            'voucher_sr_type' =>
                $this->voucher_sr_type
                    ? strtolower(
                        trim(
                            (string) $this->voucher_sr_type
                        )
                    )
                    : null,

            'fuel_oil_source' =>
                $this->fuel_oil_source
                    ? strtolower(
                        trim(
                            (string) $this->fuel_oil_source
                        )
                    )
                    : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'request_type' => [
                'required',
                Rule::in([
                    'general',
                    'fixed_asset',
                    'internal_inventory',
                ]),
            ],

            'mr_requested' => [
                'required',
                'boolean',
            ],

            'used_for' => [
                'required',
                Rule::in([
                    'project',
                    'department',
                ]),
            ],

            'project_id' => [
                'nullable',
                'integer',

                Rule::requiredIf(
                    fn () =>
                        $this->input(
                            'used_for'
                        ) === 'project'
                ),
            ],

            'used_for_department_id' => [
                'nullable',
                'integer',

                Rule::requiredIf(
                    fn () =>
                        $this->input(
                            'used_for'
                        ) ===
                        'department'
                ),

                Rule::exists(
                    'departments',
                    'id'
                ),
            ],

            'from_department_id' => [
                'required',
                'integer',

                Rule::exists(
                    'departments',
                    'id'
                ),
            ],

            'to_location' => [
                'required',
                'string',
                'max:150',
            ],

            'voucher_sr_type' => [
                'required',

                Rule::in([
                    'goods',
                    'fuel_oil',
                ]),
            ],

            'fuel_oil_source' => [
                'nullable',

                Rule::requiredIf(
                    fn () =>
                        $this->input(
                            'voucher_sr_type'
                        ) === 'fuel_oil'
                ),

                Rule::in([
                    'purchased',
                    'stock',
                ]),
            ],

            'fiscal_year_id' => [
                'nullable',
                'integer',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.item_id' => [
                'required',
                'integer',

                Rule::exists(
                    'sales_item',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'status',
                            'active'
                        )
                ),
            ],

            'items.*.uom_id' => [
                'required',
                'integer',

                Rule::exists(
                    'units_of_measurement',
                    'id'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'is_active',
                            true
                        )
                ),
            ],

            'items.*.mr_date' => [
                'nullable',

                Rule::requiredIf(
                    fn () =>
                        $this->boolean(
                            'mr_requested'
                        )
                ),

                'date',
            ],

            'items.*.mr_no' => [
                'nullable',

                Rule::requiredIf(
                    fn () =>
                        $this->boolean(
                            'mr_requested'
                        )
                ),

                'string',
                'max:100',
            ],

            'items.*.mr_qty' => [
                'nullable',

                Rule::requiredIf(
                    fn () =>
                        $this->boolean(
                            'mr_requested'
                        )
                ),

                'numeric',
                'gt:0',
            ],

            'items.*.sr_qty' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'items.*.expected_delivery_date' => [
                'required',
                'date',
                'after:today',
            ],

            'items.*.delivery_type' => [
                'required',

                Rule::in([
                    'over_qty_based',
                    'at_any_time',
                ]),
            ],

            'items.*.priority' => [
                'required',

                Rule::in([
                    'urgent',
                    'high',
                    'normal',
                    'low',
                ]),
            ],

            'items.*.urgency_reason' => [
                'nullable',
                'string',
                'max:255',
            ],

            'items.*.remark' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {
                $items =
                    $this->input(
                        'items',
                        []
                    );

                foreach (
                    $items
                    as $index => $item
                ) {
                    /*
                     * Urgency reason required
                     * only for urgent lines.
                     */
                    if (
                        (
                            $item['priority']
                            ?? null
                        ) === 'urgent'
                        &&
                        blank(
                            $item[
                                'urgency_reason'
                            ] ?? null
                        )
                    ) {
                        $validator
                            ->errors()
                            ->add(
                                "items.{$index}.urgency_reason",
                                'Urgency reason is required for urgent requests.'
                            );
                    }

                    /*
                     * Urgent expected delivery
                     * must be within 3 days.
                     */
                    if (
                        (
                            $item['priority']
                            ?? null
                        ) === 'urgent'
                        &&
                        !empty(
                            $item[
                                'expected_delivery_date'
                            ]
                        )
                    ) {
                        try {
                            $deliveryDate =
                                Carbon::parse(
                                    $item[
                                        'expected_delivery_date'
                                    ]
                                )->startOfDay();
                        } catch (\Throwable) {
                            continue;
                        }

                        $latestUrgentDate =
                            now()
                                ->startOfDay()
                                ->addDays(3);

                        if (
                            $deliveryDate
                                ->greaterThan(
                                    $latestUrgentDate
                                )
                        ) {
                            $validator
                                ->errors()
                                ->add(
                                    "items.{$index}.expected_delivery_date",
                                    'Expected delivery date is too long for an urgent request. Urgent requests must be within 3 days.'
                                );
                        }
                    }

                    /*
                     * If MR is requested,
                     * SR quantity should not normally
                     * exceed MR quantity.
                     */
                    if (
                        $this->boolean(
                            'mr_requested'
                        )
                        &&
                        isset(
                            $item['mr_qty'],
                            $item['sr_qty']
                        )
                        &&
                        (float) $item['sr_qty']
                            >
                            (float) $item['mr_qty']
                    ) {
                        $validator
                            ->errors()
                            ->add(
                                "items.{$index}.sr_qty",
                                'SR quantity cannot be greater than MR quantity.'
                            );
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'mr_requested.required'
                => 'MR Requested selection is required.',

            'used_for.required'
                => 'Used For is required.',

            'project_id.required'
                => 'Project is required when Used For is Project.',

            'used_for_department_id.required'
                => 'Department is required when Used For is Department.',

            'from_department_id.required'
                => 'From department is required.',

            'voucher_sr_type.required'
                => 'Voucher SR Type is required.',

            'fuel_oil_source.required'
                => 'Purchased or Stock is required for Fuel & Oil.',

            'items.required'
                => 'Add at least one item to the Store Requisition.',

            'items.*.item_id.required'
                => 'Item is required.',

            'items.*.uom_id.required'
                => 'Unit of measurement is required.',

            'items.*.mr_date.required'
                => 'MR Date is required.',

            'items.*.mr_no.required'
                => 'MR Number is required.',

            'items.*.mr_qty.required'
                => 'MR Quantity is required.',

            'items.*.sr_qty.required'
                => 'SR Quantity is required.',

            'items.*.expected_delivery_date.after'
                => 'Expected delivery date must be a future date.',

            'items.*.delivery_type.required'
                => 'Delivery Type is required.',

            'items.*.priority.required'
                => 'Priority is required.',
        ];
    }
}