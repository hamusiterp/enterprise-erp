<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesFixedAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'has_gauge' => filter_var(
                $this->input('has_gauge'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),

            'status' => strtolower(
                trim(
                    (string) $this->input(
                        'status',
                        'active'
                    )
                )
            ),

            'reading_type' => strtolower(
                trim(
                    (string) $this->input(
                        'reading_type'
                    )
                )
            ),

            'asset_condition' => strtolower(
                trim(
                    (string) $this->input(
                        'asset_condition',
                        'good'
                    )
                )
            ),
        ]);
    }

    public function rules(): array
    {
        $assetId = $this->route(
            'salesFixedAsset'
        )?->id
            ?? $this->route(
                'salesFixedAsset'
            );

        return [
            /*
            |--------------------------------------------------------------------------
            | Identification
            |--------------------------------------------------------------------------
            */

            'vehicle_no' => [
                'required',
                'string',
                'max:50',
            ],

            'tag_no' => [
                'required',
                'string',
                'max:50',

                Rule::unique(
                    'sales_fa',
                    'tag_no'
                )->ignore($assetId),
            ],

            'plate_no' => [
                'required',
                'string',
                'max:50',
            ],

            'category_id' => [
                'required',
                'integer',
                'exists:sales_category,id',
            ],

            'name_of_machinery' => [
                'required',
                'string',
                'max:200',
            ],

            /*
            |--------------------------------------------------------------------------
            | Vehicle / Machinery Details
            |--------------------------------------------------------------------------
            */

            'make_of_vehicle' => [
                'required',
                'string',
                'max:100',
            ],

            'model' => [
                'required',
                'string',
                'max:100',
            ],

            'make_of_year' => [
                'required',
                'string',
                'max:20',
            ],

            'chassis_no' => [
                'required',
                'string',
                'max:100',
            ],

            'engine_no' => [
                'required',
                'string',
                'max:100',
            ],

            'engine_model' => [
                'required',
                'string',
                'max:100',
            ],

            'make_of_engine' => [
                'required',
                'string',
                'max:100',
            ],

            'horse_power' => [
                'required',
                'numeric',
                'min:0',
            ],

            'type_of_fuel' => [
                'required',
                'string',
                'max:50',
            ],

            /*
            |--------------------------------------------------------------------------
            | Reading and Consumption
            |--------------------------------------------------------------------------
            */

            'reading_type' => [
                'required',
                Rule::in([
                    'engine_horse_power',
                    'km_reading',
                ]),
            ],

            'reading' => [
                'required',
                'numeric',
                'min:0',
            ],

            'consumption' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'standard_consumption' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'tanker_capacity' => [
                'required',
                'numeric',
                'min:0',
            ],

            'last_refill' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],

            /*
            |--------------------------------------------------------------------------
            | Gauge
            |--------------------------------------------------------------------------
            */

            'has_gauge' => [
                'required',
                'boolean',
            ],

            'gauge_reading' => [
                Rule::requiredIf(
                    fn (): bool =>
                        $this->boolean(
                            'has_gauge'
                        )
                ),
                'nullable',
                'numeric',
                'min:0',
            ],

            /*
            |--------------------------------------------------------------------------
            | Service
            |--------------------------------------------------------------------------
            */

            'service_interval' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'last_service' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            /*
            |--------------------------------------------------------------------------
            | Important Dates
            |--------------------------------------------------------------------------
            */

            'purchase_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'licence_renewal_date' => [
                'required',
                'date',
            ],

            'last_inspection_renewal_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'last_insurance_renewal_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            /*
            |--------------------------------------------------------------------------
            | Photos
            |--------------------------------------------------------------------------
            */

            'front_view_photo' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'rear_view_photo' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'right_side_view_photo' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'left_side_view_photo' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            /*
            |--------------------------------------------------------------------------
            | Documents
            |--------------------------------------------------------------------------
            */

            'libre_document' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],

            'inspection_document' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],

            'insurance_document' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],

            /*
            |--------------------------------------------------------------------------
            | Other Information
            |--------------------------------------------------------------------------
            */

            'asset_condition' => [
                'required',
                Rule::in([
                    'excellent',
                    'good',
                    'fair',
                    'poor',
                    'out_of_service',
                ]),
            ],

            'current_location' => [
                'nullable',
                'string',
                'max:200',
            ],

            'assigned_to' => [
                'nullable',
                'string',
                'max:200',
            ],

            'remarks' => [
                'nullable',
                'string',
                'max:5000',
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
            'tag_no.required' =>
                'Tag number is required.',

            'tag_no.unique' =>
                'This tag number is already registered.',

            'category_id.required' =>
                'Fixed asset category is required.',

            'category_id.exists' =>
                'Please select a valid fixed asset category.',

            'name_of_machinery.required' =>
                'Name of machinery is required.',

            'reading_type.required' =>
                'Reading type is required.',

            'reading_type.in' =>
                'Please select Engine Horse Power or KM Reading.',

            'reading.required' =>
                'Current reading is required.',

            'has_gauge.required' =>
                'Please select whether the asset has a gauge.',

            'gauge_reading.required' =>
                'Gauge reading is required when Have Gauge is Yes.',

            'purchase_date.required' =>
                'Purchase date is required.',

            'purchase_date.before_or_equal' =>
                'Purchase date cannot be in the future.',

            'last_inspection_renewal_date.before_or_equal' =>
                'Last inspection renewal date cannot be in the future.',

            'last_insurance_renewal_date.before_or_equal' =>
                'Last insurance renewal date cannot be in the future.',

            'last_service.before_or_equal' =>
                'Last service date cannot be in the future.',

            'last_refill.before_or_equal' =>
                'Last refill date cannot be in the future.',

            'front_view_photo.image' =>
                'Front view photo must be a valid image.',

            'rear_view_photo.image' =>
                'Rear view photo must be a valid image.',

            'right_side_view_photo.image' =>
                'Right-side view photo must be a valid image.',

            'left_side_view_photo.image' =>
                'Left-side view photo must be a valid image.',

            'front_view_photo.max' =>
                'Front view photo cannot exceed 5 MB.',

            'rear_view_photo.max' =>
                'Rear view photo cannot exceed 5 MB.',

            'right_side_view_photo.max' =>
                'Right-side view photo cannot exceed 5 MB.',

            'left_side_view_photo.max' =>
                'Left-side view photo cannot exceed 5 MB.',

            'libre_document.mimes' =>
                'Libre document must be a PDF file.',

            'inspection_document.mimes' =>
                'Inspection document must be a PDF file.',

            'insurance_document.mimes' =>
                'Insurance document must be a PDF file.',

            'libre_document.max' =>
                'Libre document cannot exceed 10 MB.',

            'inspection_document.max' =>
                'Inspection document cannot exceed 10 MB.',

            'insurance_document.max' =>
                'Insurance document cannot exceed 10 MB.',

            'asset_condition.required' =>
                'Asset condition is required.',

            'status.required' =>
                'Status is required.',

            'vehicle_no.required' =>
    'Vehicle number is required.',

'plate_no.required' =>
    'Plate number is required.',

'make_of_vehicle.required' =>
    'Make of vehicle is required.',

'model.required' =>
    'Model is required.',

'make_of_year.required' =>
    'Make year is required.',

'chassis_no.required' =>
    'Chassis number is required.',

'engine_no.required' =>
    'Engine number is required.',

'engine_model.required' =>
    'Engine model is required.',

'make_of_engine.required' =>
    'Make of engine is required.',

'horse_power.required' =>
    'Horse power is required.',

'type_of_fuel.required' =>
    'Fuel type is required.',

'tanker_capacity.required' =>
    'Tank capacity is required.',

'licence_renewal_date.required' =>
    'Licence renewal date is required.',

'last_inspection_renewal_date.required' =>
    'Last inspection renewal date is required.',

'last_insurance_renewal_date.required' =>
    'Last insurance renewal date is required.',

'last_service.required' =>
    'Last service date is required.',

'front_view_photo.required' =>
    'Front view photo is required.',

'rear_view_photo.required' =>
    'Rear view photo is required.',

'right_side_view_photo.required' =>
    'Right-side view photo is required.',

'left_side_view_photo.required' =>
    'Left-side view photo is required.',

'libre_document.required' =>
    'Libre PDF is required.',

'inspection_document.required' =>
    'Inspection PDF is required.',

'insurance_document.required' =>
    'Insurance PDF is required.',
        ];
    }
}