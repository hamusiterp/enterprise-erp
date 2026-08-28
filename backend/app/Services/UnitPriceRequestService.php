<?php

namespace App\Services;

use App\Models\PurchaseRequisition;
use App\Models\UnitPriceRequest;
use Illuminate\Support\Facades\DB;

class UnitPriceRequestService
{
    public function createFromPurchaseRequisition(
        PurchaseRequisition $pr,
        ?int $workflowInstanceId = null,
        ?int $workflowTaskId = null,
        ?int $userId = null
    ): UnitPriceRequest {
        return DB::transaction(function () use (
            $pr,
            $workflowInstanceId,
            $workflowTaskId,
            $userId
        ) {
            $existing = UnitPriceRequest::query()
                ->where('source_type', 'purchase_requisition')
                ->where('source_id', $pr->id)
                ->whereNotIn('status', ['rejected', 'cancelled'])
                ->first();

            if ($existing) {
                return $existing;
            }

            $pr->loadMissing([
                'items.item',
                'items.uom',
            ]);

            $request = UnitPriceRequest::create([
                // Temporary reference for now.
                // Later we can connect this to Document Numbering.
                'request_no' => 'UPR-' . now()->format('YmdHis') . '-' . $pr->id,

                'request_date' => now()->toDateString(),

                'source_type' => 'purchase_requisition',
                'source_id' => $pr->id,
                'source_reference' => $pr->pr_no,

                'workflow_instance_id' => $workflowInstanceId,
                'workflow_task_id' => $workflowTaskId,

                'status' => 'pending',

                'remarks' => null,

                'requested_by' => $userId,
                'requested_at' => null,

                'created_by' => $userId,
                'updated_by' => null,
            ]);

            foreach ($pr->items as $prItem) {
                $request->items()->create([
                    'source_item_type' => 'purchase_requisition_item',
                    'source_item_id' => $prItem->id,

                    'item_id' => $prItem->item_id,
                    'uom_id' => $prItem->uom_id,

                    'quantity' => $prItem->pr_qty,

                    'previous_unit_price' => null,
                    'unit_price' => null,

                    'vat_percentage' => 0,
                    'tax_amount' => 0,
                    'line_total' => 0,
                    'grand_total' => 0,

                    'supplier_id' => null,
                    'supplier_name' => null,
                    'supplier_stock' => null,

                    'status' => 'pending',

                    'is_out_of_stock' => false,
                ]);
            }

            return $request->load([
                'items.item',
                'items.uom',
                'workflowInstance',
                'workflowTask',
            ]);
        });
    }
}