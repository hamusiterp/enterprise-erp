<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStoreRequisitionRequest;
use App\Models\StoreRequisition;
use App\Models\StoreRequisitionItem;
use App\Services\WorkflowRuntimeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FiscalYear;
use App\Services\FiscalYearService;
use App\Services\DocumentNumberService;

class StoreRequisitionController extends Controller
{
    public function __construct(
    private readonly WorkflowRuntimeService $workflowRuntimeService,
    private readonly DocumentNumberService $documentNumberService,
    private readonly FiscalYearService $fiscalYearService
) {
}

    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('store-requisitions.view'),
            403,
            'You do not have permission to view Store Requisitions.'
        );

        $query = StoreRequisition::query()
            ->with([
                'items.item',
                'items.unitOfMeasurement',
                'requester',
                'requestedDepartment',
                'usedForDepartment',
                'fromDepartment',
                'project',
                'workflowInstance.currentState',
            ]);

        if ($request->filled('search')) {
            $search = trim(
                (string) $request->input('search')
            );

            $query->where(function ($query) use ($search) {
                $query
                    ->where(
                        'sr_no',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhereHas(
                        'items.item',
                        function ($query) use ($search) {
                            $query->where(
                                'item_description',
                                'ilike',
                                "%{$search}%"
                            );
                        }
                    );
            });
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->input('status')
            );
        }

        $perPage = min(
            max(
                (int) $request->input(
                    'per_page',
                    10
                ),
                1
            ),
            100
        );

        $result = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,

            'data' =>
                $result->items(),

            'meta' => [
                'current_page' =>
                    $result->currentPage(),

                'last_page' =>
                    $result->lastPage(),

                'per_page' =>
                    $result->perPage(),

                'total' =>
                    $result->total(),
            ],
        ]);
    }

    public function store(
        StoreStoreRequisitionRequest $request
    ): JsonResponse {
        $user = $request->user();

        $storeRequisition =
            DB::transaction(
                function () use (
                    $request,
                    $user
                ) {
                    /*
                     * Prevent duplicate SR numbers
                     * when multiple users post
                     * at the same time.
                     */
                    $fiscalYear =
                        $this->fiscalYearService
                            ->getCurrentOrFail();

                    $data['fiscal_year_id'] =
                        $fiscalYear->id;

                    $srNo =
                        $this->documentNumberService
                            ->generate(
                                'STORE_REQUISITION',
                                $fiscalYear
                            );
                    $data =
                        $request->validated();

                    $items =
                        $data['items'];

                    unset(
                        $data['items']
                    );

                    /*
                     * Determine requester's primary
                     * active department.
                     */
                    $requestDepartment =
                        $user
                            ->departments()
                            ->wherePivot(
                                'is_active',
                                true
                            )
                            ->wherePivot(
                                'is_primary',
                                true
                            )
                            ->first();

                    /*
                     * SR number is assigned only
                     * when the whole request is posted.
                     */
                    

                    $storeRequisition =
                        StoreRequisition::create([
                            ...$data,

                            'sr_no' =>
                                $srNo,

                            'status' =>
                                'posted',

                            'requested_by' =>
                                $user->id,

                            'requested_department_id' =>
                                $requestDepartment?->id,

                            'sr_date' =>
                                now(),

                            'posted_at' =>
                                now(),

                            'posted_by' =>
                                $user->id,
                        ]);

                    foreach (
                        $items
                        as $index => $itemData
                    ) {
                        /*
                         * If MR Requested = No,
                         * never retain accidental MR values.
                         */
                        if (
                            !$storeRequisition
                                ->mr_requested
                        ) {
                            $itemData[
                                'mr_date'
                            ] = null;

                            $itemData[
                                'mr_no'
                            ] = null;

                            $itemData[
                                'mr_qty'
                            ] = null;
                        }

                        /*
                         * Urgency reason is relevant
                         * only for Urgent.
                         */
                        if (
                            (
                                $itemData[
                                    'priority'
                                ]
                                ?? null
                            ) !== 'urgent'
                        ) {
                            $itemData[
                                'urgency_reason'
                            ] = null;
                        }

                        StoreRequisitionItem::create([
                            ...$itemData,

                            'store_requisition_id' =>
                                $storeRequisition->id,

                            'line_no' =>
                                $index + 1,

                            'issued_qty' =>
                                0,

                            'stock_status' =>
                                'pending',
                        ]);
                    }

                    /*
                     * Start the generic workflow.
                     *
                     * Current initial state should be:
                     * store_requisition
                     */
                    $workflow =
                        $this->workflowRuntimeService
                            ->start(
                                'STORE_REQUISITION',
                                'store_requisition',
                                $storeRequisition->id,
                                $storeRequisition->sr_no,
                                $user
                            );

                    $storeRequisition->update([
                        'workflow_instance_id' =>
                            $workflow->id,
                    ]);

                    /*
                     * The newly created SR itself is
                     * already complete, so move it from
                     * Store Requisition -> Approve SR.
                     *
                     * This executes your "submit"
                     * transition and creates the next task.
                     */
                    $workflow =
                        $this->workflowRuntimeService
                            ->performAction(
                                $workflow,
                                'submit',
                                $user,
                                null,
                                [
                                    'sr_no' =>
                                        $storeRequisition
                                            ->sr_no,

                                    'item_count' =>
                                        count($items),
                                ]
                            );

                    $storeRequisition->update([
                        'status' =>
                            'submitted',
                    ]);

                    return $storeRequisition;
                }
            );

        return response()->json([
            'success' => true,

            'message' =>
                'Store Requisition created and submitted successfully.',

            'data' =>
                $storeRequisition
                    ->fresh()
                    ->load([
                        'items.item',
                        'items.unitOfMeasurement',

                        'requester',
                        'requestedDepartment',

                        'usedForDepartment',
                        'fromDepartment',

                        'project',

                        'workflowInstance.currentState',
                        'workflowInstance.tasks.workflowState',
                    ]),
        ], 201);
    }

    public function show(
        Request $request,
        StoreRequisition $storeRequisition
    ): JsonResponse {
        abort_unless(
            $request->user()?->can(
                'store-requisitions.view'
            ),
            403,
            'You do not have permission to view this Store Requisition.'
        );

        return response()->json([
            'success' => true,

            'data' =>
                $storeRequisition->load([
                'items.item',
                'items.unitOfMeasurement',

                'requester',
                'requestedDepartment',

                'usedForDepartment',
                'fromDepartment',

                'project',
                'receivedBy:id,name,email',

                'fiscalYear',

                'workflowInstance.currentState',
                'workflowInstance.tasks.workflowState',
                'workflowInstance.history',
            ]),
        ]);
    }

public function update(
    StoreStoreRequisitionRequest $request,
    StoreRequisition $storeRequisition
): JsonResponse {
    abort_unless(
        strtolower(
            (string) $storeRequisition->status
        ) === 'submitted',
        422,
        'Only submitted Store Requisitions can be edited.'
    );

    $storeRequisition = DB::transaction(
        function () use (
            $request,
            $storeRequisition
        ) {
            $data =
                $request->validated();

            $items =
                $data['items'] ?? [];

            unset(
                $data['items'],
                $data['fiscal_year_id']
            );

            /*
             * Never regenerate or change:
             * - SR number
             * - fiscal year
             * - requester
             * - workflow instance
             */
            $storeRequisition->update([
                'request_type' =>
                    $data['request_type'],

                'mr_requested' =>
                    $data['mr_requested'],

                'used_for' =>
                    $data['used_for'],

                'project_id' =>
                    $data['used_for'] === 'project'
                        ? ($data['project_id'] ?? null)
                        : null,

                'used_for_department_id' =>
                    $data['used_for'] === 'department'
                        ? ($data['used_for_department_id'] ?? null)
                        : null,

                'from_department_id' =>
                    $data['from_department_id'],

                'to_location' =>
                    $data['to_location'],

                'voucher_sr_type' =>
                    $data['voucher_sr_type'],

                'fuel_oil_source' =>
                    $data['voucher_sr_type'] === 'fuel_oil'
                        ? ($data['fuel_oil_source'] ?? null)
                        : null,
            ]);

            /*
             * Rebuild the current SR lines.
             */
            $storeRequisition
                ->items()
                ->delete();

            foreach (
                $items as $index => $itemData
            ) {
                /*
                 * MR fields must be cleared
                 * when MR Requested = No.
                 */
                if (
                    !$storeRequisition->mr_requested
                ) {
                    $itemData['mr_date'] =
                        null;

                    $itemData['mr_no'] =
                        null;

                    $itemData['mr_qty'] =
                        null;
                }

                /*
                 * Urgency reason only applies
                 * to urgent lines.
                 */
                if (
                    ($itemData['priority'] ?? null)
                    !== 'urgent'
                ) {
                    $itemData['urgency_reason'] =
                        null;
                }

                $storeRequisition
                    ->items()
                    ->create([
                        ...$itemData,

                        'line_no' =>
                            $index + 1,

                        'available_qty' =>
                            null,

                        'issued_qty' =>
                            0,

                        'shortage_qty' =>
                            null,

                        'stock_status' =>
                            'pending',
                    ]);
            }

            return $storeRequisition;
        }
    );

    return response()->json([
        'success' => true,

        'message' =>
            'Store Requisition updated successfully.',

        'data' =>
            $storeRequisition
                ->fresh()
                ->load([
                    'items.item',
                    'items.unitOfMeasurement',

                    'requester',
                    'requestedDepartment',

                    'fromDepartment',
                    'usedForDepartment',

                    'project',

                    'fiscalYear',

                    'workflowInstance.currentState',
                ]),
    ]);
}

    
}