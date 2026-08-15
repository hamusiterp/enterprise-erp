<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SalesFixedAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'asset_no' => $this->asset_no,

            /*
            |--------------------------------------------------------------------------
            | Identification
            |--------------------------------------------------------------------------
            */

            'vehicle_no' => $this->vehicle_no,
            'tag_no' => $this->tag_no,
            'plate_no' => $this->plate_no,

            /*
            |--------------------------------------------------------------------------
            | Category
            |--------------------------------------------------------------------------
            */

            'category_id' => $this->category_id,

            'category' => $this->whenLoaded(
                'category',
                function (): array {
                    return [
                        'id' => $this->category->id,
                        'name' => $this->category->category,
                        'type' => $this->category->type,
                    ];
                }
            ),

            /*
            |--------------------------------------------------------------------------
            | Machinery / Vehicle Details
            |--------------------------------------------------------------------------
            */

            'name_of_machinery' =>
                $this->name_of_machinery,

            'make_of_vehicle' =>
                $this->make_of_vehicle,

            'model' =>
                $this->model,

            'make_of_year' =>
                $this->make_of_year,

            'chassis_no' =>
                $this->chassis_no,

            'engine_no' =>
                $this->engine_no,

            'engine_model' =>
                $this->engine_model,

            'make_of_engine' =>
                $this->make_of_engine,

            'horse_power' =>
                $this->horse_power,

            'type_of_fuel' =>
                $this->type_of_fuel,

            /*
            |--------------------------------------------------------------------------
            | Reading and Consumption
            |--------------------------------------------------------------------------
            */

            'reading_type' =>
                $this->reading_type,

            'reading' =>
                $this->reading,

            'consumption' =>
                $this->consumption,

            'standard_consumption' =>
                $this->standard_consumption,

            'tanker_capacity' =>
                $this->tanker_capacity,

            'last_refill' =>
                $this->last_refill
                    ?->format('Y-m-d'),

            /*
            |--------------------------------------------------------------------------
            | Gauge
            |--------------------------------------------------------------------------
            */

            'has_gauge' =>
                $this->has_gauge,

            'gauge_reading' =>
                $this->gauge_reading,

            /*
            |--------------------------------------------------------------------------
            | Service
            |--------------------------------------------------------------------------
            */

            'service_interval' =>
                $this->service_interval,

            'last_service' =>
                $this->last_service
                    ?->format('Y-m-d'),

            /*
            |--------------------------------------------------------------------------
            | Dates
            |--------------------------------------------------------------------------
            */

            'purchase_date' =>
                $this->purchase_date
                    ?->format('Y-m-d'),

            'licence_renewal_date' =>
                $this->licence_renewal_date
                    ?->format('Y-m-d'),

            'last_inspection_renewal_date' =>
                $this
                    ->last_inspection_renewal_date
                    ?->format('Y-m-d'),

            'last_insurance_renewal_date' =>
                $this
                    ->last_insurance_renewal_date
                    ?->format('Y-m-d'),

            /*
            |--------------------------------------------------------------------------
            | Photos
            |--------------------------------------------------------------------------
            */

            'front_view_photo' =>
                $this->front_view_photo,

            'front_view_photo_url' =>
                $this->fileUrl(
                    $this->front_view_photo
                ),

            'rear_view_photo' =>
                $this->rear_view_photo,

            'rear_view_photo_url' =>
                $this->fileUrl(
                    $this->rear_view_photo
                ),

            'right_side_view_photo' =>
                $this->right_side_view_photo,

            'right_side_view_photo_url' =>
                $this->fileUrl(
                    $this->right_side_view_photo
                ),

            'left_side_view_photo' =>
                $this->left_side_view_photo,

            'left_side_view_photo_url' =>
                $this->fileUrl(
                    $this->left_side_view_photo
                ),

            /*
            |--------------------------------------------------------------------------
            | Documents
            |--------------------------------------------------------------------------
            */

            'libre_document' =>
                $this->libre_document,

            'libre_document_url' =>
                $this->fileUrl(
                    $this->libre_document
                ),

            'inspection_document' =>
                $this->inspection_document,

            'inspection_document_url' =>
                $this->fileUrl(
                    $this->inspection_document
                ),

            'insurance_document' =>
                $this->insurance_document,

            'insurance_document_url' =>
                $this->fileUrl(
                    $this->insurance_document
                ),

            /*
            |--------------------------------------------------------------------------
            | Other Information
            |--------------------------------------------------------------------------
            */

            'asset_condition' =>
                $this->asset_condition,

            'current_location' =>
                $this->current_location,

            'assigned_to' =>
                $this->assigned_to,

            'remarks' =>
                $this->remarks,

            'status' =>
                $this->status,

            /*
            |--------------------------------------------------------------------------
            | Registration / Audit
            |--------------------------------------------------------------------------
            */

            'registered_by' =>
                $this->registered_by,

            'registered_by_user_id' =>
                $this->registered_by_user_id,

            'registered_date' =>
                $this->registered_date
                    ?->format('Y-m-d'),

            'edited_by' =>
                $this->edited_by,

            'edited_by_user_id' =>
                $this->edited_by_user_id,

            'created_at' =>
                $this->created_at
                    ?->format('Y-m-d H:i:s'),

            'updated_at' =>
                $this->updated_at
                    ?->format('Y-m-d H:i:s'),

            'deleted_at' =>
                $this->deleted_at
                    ?->format('Y-m-d H:i:s'),
        ];
    }

    private function fileUrl(
        ?string $path
    ): ?string {
        if (
            $path === null ||
            trim($path) === ''
        ) {
            return null;
        }

        return Storage::disk('public')
            ->url($path);
    }
}