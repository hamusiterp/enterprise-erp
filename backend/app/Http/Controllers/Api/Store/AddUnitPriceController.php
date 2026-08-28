<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Controllers\Controller;
use App\Models\UnitPriceRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddUnitPriceController extends Controller
{
    /**
     * Items waiting for Unit Price entry.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search'   => ['nullable', 'string', 'max:150'],
            'page'     => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $search = trim($validated['search'] ?? '');
        $perPage = (int) ($validated['per_page'] ?? 20);

        $query = UnitPriceRequestItem::query()
            ->with([
                'request:id,request_no,request_date,source_type,source_id,source_reference,status,requested_by,requested_at,remarks',
                'request.requester:id,name,email',
                'item',
                'uom',
            ])
            ->where('status', 'requested')
            ->whereHas('request', function ($q) {
                $q->whereIn('status', [
                    'requested',
                    'partially_priced',
                ]);
            })
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {

                $q->whereHas('request', function ($requestQuery) use ($search) {
                    $requestQuery
                        ->where('request_no', 'ilike', "%{$search}%")
                        ->orWhere('source_reference', 'ilike', "%{$search}%");
                });

                $q->orWhereHas('item', function ($itemQuery) use ($search) {
                    $itemQuery
                        ->where('item_no', 'ilike', "%{$search}%")
                        ->orWhere('item_description', 'ilike', "%{$search}%");
                });
            });
        }

        $items = $query->paginate($perPage);

        return response()->json([
            'data' => $items->items(),

            'meta' => [
                'current_page' => $items->currentPage(),
                'per_page'     => $items->perPage(),
                'total'        => $items->total(),
                'last_page'    => $items->lastPage(),
            ],
        ]);
    }

    public function store(
    Request $request,
    UnitPriceRequestItem $item
) {
    $validated = $request->validate([
        'unit_price' => [
            'required',
            'numeric',
            'gt:0',
        ],

        'vat_percentage' => [
            'required',
            'numeric',
            'min:0',
            'max:100',
        ],

        'supplier_id' => [
        'required',
        'integer',
        'exists:sales_supplier,id',
    ],

        'supplier_stock' => [
            'nullable',
            'numeric',
            'min:0',
        ],

        'remarks' => [
            'nullable',
            'string',
            'max:1000',
        ],
    ]);

    if ($item->status !== 'requested') {
        return response()->json([
            'message' => 'This item is no longer waiting for Unit Price.',
        ], 422);
    }

    $quantity = (float) $item->quantity;
    $unitPrice = (float) $validated['unit_price'];
    $vatPercentage = (float) $validated['vat_percentage'];

    /*
     * Correct calculation:
     *
     * Line Total = Quantity × Unit Price
     * Tax        = Line Total × VAT %
     * Grand Total = Line Total + Tax
     */
    $lineTotal = round(
        $quantity * $unitPrice,
        2
    );

    $taxAmount = round(
        $lineTotal * ($vatPercentage / 100),
        2
    );

    $grandTotal = round(
        $lineTotal + $taxAmount,
        2
    );

    $supplier = DB::table('sales_supplier')
    ->where('id', $validated['supplier_id'])
    ->whereNull('deleted_at')
    ->where('status', 'active')
    ->first();

if (!$supplier) {
    return response()->json([
        'message' => 'Selected supplier is not available.',
    ], 422);
}

    $item->update([
        'previous_unit_price' => $item->unit_price,

        'unit_price' => $unitPrice,

        'vat_percentage' => $vatPercentage,

        'line_total' => $lineTotal,

        'tax_amount' => $taxAmount,

        'grand_total' => $grandTotal,

        'supplier_id' => $supplier->id,
'supplier_name' => $supplier->supplier_name,

        'supplier_stock' =>
            $validated['supplier_stock'] ?? null,

        'status' => 'pending_confirmation',

        'price_updated_by' => $request->user()->id,

        'price_updated_at' => now(),

        'confirmation_notes' =>
            $validated['remarks'] ?? null,

        'is_out_of_stock' => false,

        'out_of_stock_reason' => null,
    ]);

    /*
     * Update request header.
     *
     * If there are still items waiting for pricing,
     * the overall request remains partially priced.
     */
    $unitPriceRequest = $item->request;

    $remainingRequestedItems =
        $unitPriceRequest
            ->items()
            ->where('status', 'requested')
            ->count();

    $unitPriceRequest->update([
        'status' => $remainingRequestedItems > 0
            ? 'partially_priced'
            : 'pending_confirmation',

        'updated_by' => $request->user()->id,
    ]);

    return response()->json([
        'message' =>
            'Unit Price added successfully and sent for confirmation.',

        'data' => $item->fresh([
            'request',
            'item',
            'uom',
            'priceUpdatedBy',
        ]),
    ]);
}

public function suppliers(Request $request)
{
    $search = trim((string) $request->get('search', ''));

    $query = DB::table('sales_supplier')
        ->select([
            'id',
            'supplier_no',
            'supplier_name',
            'phone_number',
            'tin',
        ])
        ->whereNull('deleted_at')
        ->where('status', 'active')
        ->orderBy('supplier_name');

    if ($search !== '') {
        $query->where(function ($q) use ($search) {
            $q->where('supplier_name', 'ilike', "%{$search}%")
                ->orWhere('supplier_no', 'ilike', "%{$search}%")
                ->orWhere('tin', 'ilike', "%{$search}%");
        });
    }

    return response()->json([
        'data' => $query
            ->limit(50)
            ->get(),
    ]);
}
}