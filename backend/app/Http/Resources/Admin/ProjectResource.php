<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'project_no' => $this->project_no,
            'project_source' => $this->project_source,

            'bid_reference' => $this->bid_reference,
            'work_order_no' => $this->work_order_no,

            'project_name' => $this->project_name,
            'project_name_letter' => $this->project_name_letter,
            'project_description' => $this->project_description,
            'location' => $this->location,

            'customer_id' => $this->customer_id,
            'employer' => $this->employer,

            /*
             * Return Yes/No because that is what the
             * React form currently uses.
             */
            'has_consultant' => $this->has_consultant
                ? 'Yes'
                : 'No',

            'consultant' => $this->consultant,

            'has_specified_area' => $this->has_specified_area
                ? 'Yes'
                : 'No',

            'area' => $this->area,

            'construction_project_type' =>
                $this->construction_project_type,

                'business_unit' =>
    $this->business_unit,

'contract_type' =>
    $this->contract_type,

'contract_amount_before_vat' =>
    $this->contract_amount_before_vat,

'contract_pricing_type' =>
    $this->contract_pricing_type,

    'contract_date' =>
    $this->contract_date?->format('Y-m-d'),

'has_site_handover_date' =>
    $this->has_site_handover_date
        ? 'Yes'
        : 'No',

'site_handover_date' =>
    $this->site_handover_date?->format('Y-m-d'),

'has_commencement_date' =>
    $this->has_commencement_date
        ? 'Yes'
        : 'No',

'commencement_date' =>
    $this->commencement_date?->format('Y-m-d'),

'project_duration' =>
    $this->project_duration,

'duration_type' =>
    $this->duration_type,

'no_of_holidays' =>
    $this->no_of_holidays,

    'payment_term' =>
    $this->payment_term,

'has_advance_payment' =>
    $this->has_advance_payment
        ? 'Yes'
        : 'No',

'advance_percent' =>
    $this->advance_percent,

'has_advance_repayment' =>
    $this->has_advance_repayment
        ? 'Yes'
        : 'No',

'advance_repayment_complete_percent' =>
    $this->advance_repayment_complete_percent,

'advance_repayment_percent' =>
    $this->advance_repayment_percent,

'advance_repayment_start' =>
    $this->advance_repayment_start,

'interim_payment_schedule' =>
    $this->interim_payment_schedule,

'advance_payment_due_date' =>
    $this->advance_payment_due_date
        ?->format('Y-m-d'),

'has_advance_bond' =>
    $this->has_advance_bond
        ? 'Yes'
        : 'No',

'advance_bond_percent' =>
    $this->advance_bond_percent,

'advance_bond_type' =>
    $this->advance_bond_type,

'advance_bond_start_date' =>
    $this->advance_bond_start_date
        ?->format('Y-m-d'),

'advance_bond_end_date' =>
    $this->advance_bond_end_date
        ?->format('Y-m-d'),

'has_performance_bond' =>
    $this->has_performance_bond
        ? 'Yes'
        : 'No',

'performance_bond_percent' =>
    $this->performance_bond_percent,

'performance_bond_type' =>
    $this->performance_bond_type,

'performance_bond_start_date' =>
    $this->performance_bond_start_date
        ?->format('Y-m-d'),

'performance_bond_end_date' =>
    $this->performance_bond_end_date
        ?->format('Y-m-d'),

'has_price_adjustment' =>
    $this->has_price_adjustment
        ? 'Yes'
        : 'No',

'price_adjustment_percent' =>
    $this->price_adjustment_percent,

'has_retention' =>
    $this->has_retention
        ? 'Yes'
        : 'No',

'retention_percent' =>
    $this->retention_percent,

'has_price_index' =>
    $this->has_price_index
        ? 'Yes'
        : 'No',

'has_liquidity_damage' =>
    $this->has_liquidity_damage
        ? 'Yes'
        : 'No',

'liquidity_percent' =>
    $this->liquidity_percent,

'liquidity_limit' =>
    $this->liquidity_limit,

'minimum_payment_time' =>
    $this->minimum_payment_time,

'engineering_facilities' =>
    $this->engineering_facilities ?? [],

            'status' => $this->status,

            'registered_by' => $this->registered_by,
            'registered_by_user_id' =>
                $this->registered_by_user_id,

            'date_registered' =>
                $this->date_registered?->format('Y-m-d'),

            'created_at' =>
                $this->created_at?->format('Y-m-d H:i:s'),

            'updated_at' =>
                $this->updated_at?->format('Y-m-d H:i:s'),

            'deleted_at' =>
                $this->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }
}