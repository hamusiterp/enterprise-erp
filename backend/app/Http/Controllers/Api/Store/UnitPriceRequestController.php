<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequisition;
use App\Models\UnitPriceRequest;
use App\Models\WorkflowTask;
use App\Services\UnitPriceRequestService;
use App\Services\WorkflowTaskOwnershipService;
use Illuminate\Http\Request;

class UnitPriceRequestController extends Controller
{
    public function index(
        Request $request,
        WorkflowTaskOwnershipService $ownershipService
    ) {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:150'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $user = $request->user();

        $query = WorkflowTask::query()
            ->with([
                'workflowState',
                'workflowInstance',
            ])
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereHas('workflowState', function ($q) {
                $q->where('code', 'update')
                    ->where('is_active', true);
            })
            ->whereHas('workflowInstance', function ($q) {
                $q->where('status', 'running');
            })
            ->latest('id');

        $tasks = $query->get()
            ->filter(function (WorkflowTask $task) use (
                $ownershipService,
                $user
            ) {
                return $ownershipService->userCanHandle(
                    $user,
                    $task
                );
            });

        $rows = collect();

        foreach ($tasks as $task) {

            $instance = $task->workflowInstance;

            if (!$instance) {
                continue;
            }

            /*
             * The workflow subject is still the Store Requisition,
             * so locate the PR using workflow_instance_id.
             */
            $pr = PurchaseRequisition::query()
                ->with([
                    'items.item',
                    'items.uom',
                    'storeRequisition',
                    'creator',
                ])
                ->where('workflow_instance_id', $instance->id)
                ->first();

            if (!$pr) {
                continue;
            }

            $existingRequest = UnitPriceRequest::query()
            ->with([
                'items.item',
                'items.uom',
                'items.priceUpdatedBy',
            ])
            ->where('source_type', 'purchase_requisition')
            ->where('source_id', $pr->id)
            ->latest('id')
            ->first();

            $rows->push([
                'task' => $task,

                'workflow' => [
                    'instance_id' => $instance->id,
                    'state_code' => $task->workflowState?->code,
                    'state_name' => $task->workflowState?->name,
                ],

                'purchase_requisition' => $pr,

                'unit_price_request' => $existingRequest,

                'pricing_status' => $existingRequest
                    ? $existingRequest->status
                    : 'not_requested',
            ]);
        }

        /*
         * Search after ownership filtering so we don't expose
         * tasks the logged-in user cannot handle.
         */
        if (!empty($validated['search'])) {
            $search = strtolower(trim($validated['search']));

            $rows = $rows->filter(function ($row) use ($search) {
                $pr = $row['purchase_requisition'];

                $haystack = strtolower(
                    implode(' ', [
                        $pr->pr_no ?? '',
                        $pr->source_reference ?? '',
                        $pr->remarks ?? '',
                        $pr->storeRequisition?->sr_no ?? '',
                    ])
                );

                return str_contains($haystack, $search);
            })->values();
        }

        $page = (int) ($validated['page'] ?? 1);
        $perPage = (int) ($validated['per_page'] ?? 20);

        $total = $rows->count();

        $paginated = $rows
            ->slice(($page - 1) * $perPage, $perPage)
            ->values();

        return response()->json([
            'data' => $paginated,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => max(
                    1,
                    (int) ceil($total / $perPage)
                ),
            ],
        ]);
    }

    public function requestPrice(
        Request $request,
        WorkflowTask $task,
        UnitPriceRequestService $unitPriceRequestService,
        WorkflowTaskOwnershipService $ownershipService
    ) {
        $validated = $request->validate([
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $task->load([
            'workflowState',
            'workflowInstance',
        ]);

        if (
            !$task->workflowState ||
            $task->workflowState->code !== 'update'
        ) {
            return response()->json([
                'message' => 'This task is not at Unit Price stage.',
            ], 422);
        }

        if (
            !in_array(
                $task->status,
                ['pending', 'in_progress'],
                true
            )
        ) {
            return response()->json([
                'message' => 'This workflow task is no longer active.',
            ], 422);
        }

        if (
            !$ownershipService->userCanHandle(
                $user,
                $task
            )
        ) {
            return response()->json([
                'message' => 'You are not authorized to handle this Unit Price task.',
            ], 403);
        }

        $instance = $task->workflowInstance;

        if (
            !$instance ||
            $instance->status !== 'running'
        ) {
            return response()->json([
                'message' => 'The workflow instance is not running.',
            ], 422);
        }

        $pr = PurchaseRequisition::query()
            ->with([
                'items.item',
                'items.uom',
            ])
            ->where('workflow_instance_id', $instance->id)
            ->first();

        if (!$pr) {
            return response()->json([
                'message' => 'Purchase Requisition was not found for this workflow.',
            ], 404);
        }

        $unitPriceRequest = $unitPriceRequestService
            ->createFromPurchaseRequisition(
                $pr,
                $instance->id,
                $task->id,
                $user->id
            );

        /*
         * This represents:
         *
         * Unit Price Update Request
         *        ↓
         * Requested
         *
         * We DO NOT advance the main workflow here.
         */
        $unitPriceRequest->update([
            'status' => 'requested',
            'remarks' => $validated['remarks'] ?? null,
            'requested_by' => $user->id,
            'requested_at' => now(),
            'updated_by' => $user->id,
        ]);

        $unitPriceRequest->items()
            ->where('status', 'pending')
            ->update([
                'status' => 'requested',
            ]);

        return response()->json([
            'message' => 'Unit Price request sent successfully.',
            'data' => $unitPriceRequest->fresh([
                'items.item',
                'items.uom',
                'requester',
            ]),
        ]);
    }
}