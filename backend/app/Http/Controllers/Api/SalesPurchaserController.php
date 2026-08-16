<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalesPurchaserRequest;
use App\Http\Resources\SalesPurchaserResource;
use App\Models\SalesPurchaser;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;



class SalesPurchaserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | List Purchasers
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| List Purchasers
|--------------------------------------------------------------------------
*/

public function index(Request $request): AnonymousResourceCollection
{
    $query = SalesPurchaser::query()
        ->with([
            'primaryAccount.bank',
        ])
        ->withCount([
            'accounts',
            'activeAccounts',
        ]);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if ($request->filled('search')) {

        $search = trim($request->search);

        $query->where(function ($q) use ($search) {

            $q->where(
                'purchaser_no',
                'ILIKE',
                "%{$search}%"
            )

            ->orWhere(
                'purchaser_name',
                'ILIKE',
                "%{$search}%"
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    if ($request->filled('status')) {

        $query->where(
            'status',
            $request->status
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Date Filter
    |--------------------------------------------------------------------------
    */

    if ($request->filled('date_from')) {

        $query->whereDate(
            'date_registered',
            '>=',
            $request->date_from
        );
    }

    if ($request->filled('date_to')) {

        $query->whereDate(
            'date_registered',
            '<=',
            $request->date_to
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    $allowedSorts = [

        'id',

        'purchaser_no',

        'purchaser_name',

        'status',

        'date_registered',

        'created_at',
    ];

    $sortBy = $request->input(
        'sort_by',
        'id'
    );

    if (! in_array($sortBy, $allowedSorts)) {

        $sortBy = 'id';
    }

    $direction = strtolower(
        $request->input(
            'sort_direction',
            'desc'
        )
    );

    if (! in_array(
        $direction,
        ['asc', 'desc']
    )) {

        $direction = 'desc';
    }

    $query->orderBy(
        $sortBy,
        $direction
    );

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    $perPage = (int) $request->input(
        'per_page',
        10
    );

    $perPage = max(
        5,
        min(
            $perPage,
            100
        )
    );

    return SalesPurchaserResource::collection(

        $query->paginate($perPage)

    );
}

    /*
    |--------------------------------------------------------------------------
    | Show Purchaser
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Show Purchaser
|--------------------------------------------------------------------------
*/

public function show(
    SalesPurchaser $salesPurchaser
): SalesPurchaserResource
{
    $salesPurchaser->load([

        'accounts.bank',

        'primaryAccount.bank',

        'registeredBy',

    ]);

    $salesPurchaser->loadCount([

        'accounts',

        'activeAccounts',

    ]);

    return new SalesPurchaserResource(
        $salesPurchaser
    );
}

    /*
    |--------------------------------------------------------------------------
    | Create Purchaser
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Create Purchaser
|--------------------------------------------------------------------------
*/

public function store(
    SalesPurchaserRequest $request
): SalesPurchaserResource
{
    $purchaser = DB::transaction(
        function () use ($request) {

            /*
            |--------------------------------------------------------------------------
            | Lock Purchaser Number Generation
            |--------------------------------------------------------------------------
            |
            | PostgreSQL advisory transaction lock prevents two users from
            | receiving the same purchaser number at the same time.
            |
            */

            DB::select(
                'SELECT pg_advisory_xact_lock(?)',
                [910001]
            );

            $data = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Generate Purchaser Number
            |--------------------------------------------------------------------------
            */

            $data['purchaser_no'] =
                $this->generateNextPurchaserNumber();

            /*
            |--------------------------------------------------------------------------
            | Registration Information
            |--------------------------------------------------------------------------
            */

            $data['registered_by'] =
                auth()->user()?->name
                ?? 'System';

            $data['registered_by_user_id'] =
                auth()->id();

            $data['date_registered'] =
                now()->toDateString();

            return SalesPurchaser::create(
                $data
            );
        }
    );

    $purchaser->loadCount([
        'accounts',
        'activeAccounts',
    ]);

    $purchaser->load([
        'primaryAccount.bank',
    ]);

    return new SalesPurchaserResource(
        $purchaser
    );
}

   /*
|--------------------------------------------------------------------------
| Update Purchaser
|--------------------------------------------------------------------------
*/

public function update(
    SalesPurchaserRequest $request,
    SalesPurchaser $salesPurchaser
): SalesPurchaserResource
{
    $salesPurchaser = DB::transaction(
        function () use (
            $request,
            $salesPurchaser
        ) {

            $data = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Purchaser Number cannot be changed
            |--------------------------------------------------------------------------
            */

            unset(
                $data['purchaser_no']
            );

            /*
            |--------------------------------------------------------------------------
            | Update Purchaser
            |--------------------------------------------------------------------------
            */

            $salesPurchaser->update(
                $data
            );

            return $salesPurchaser;
        }
    );

    $salesPurchaser->load([

        'primaryAccount.bank',

        'accounts.bank',

        'registeredBy',

    ]);

    $salesPurchaser->loadCount([

        'accounts',

        'activeAccounts',

    ]);

    return new SalesPurchaserResource(
        $salesPurchaser
    );
}

    /*
|--------------------------------------------------------------------------
| Delete Purchaser (Soft Delete)
|--------------------------------------------------------------------------
*/

public function destroy(
    SalesPurchaser $salesPurchaser
): JsonResponse
{
    DB::transaction(function () use ($salesPurchaser) {

        $salesPurchaser->delete();

    });

    return response()->json([
        'message' => 'Purchaser deleted successfully.',
    ]);
}

/*
|--------------------------------------------------------------------------
| Deleted Purchasers
|--------------------------------------------------------------------------
*/

public function deleted(Request $request): AnonymousResourceCollection
{
    $query = SalesPurchaser::onlyTrashed()
        ->with([
            'primaryAccount.bank',
        ])
        ->withCount([
            'accounts',
            'activeAccounts',
        ]);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if ($request->filled('search')) {

        $search = trim($request->search);

        $query->where(function ($q) use ($search) {

            $q->where(
                'purchaser_no',
                'ILIKE',
                "%{$search}%"
            )
            ->orWhere(
                'purchaser_name',
                'ILIKE',
                "%{$search}%"
            );

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    $perPage = (int) $request->input(
        'per_page',
        10
    );

    $perPage = max(
        5,
        min(
            $perPage,
            100
        )
    );


    return SalesPurchaserResource::collection(

        $query
            ->orderByDesc('deleted_at')
            ->paginate($perPage)

    );
}

    /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

    public function restore(
    int $id
): JsonResponse
{
    $salesPurchaser = SalesPurchaser::onlyTrashed()
        ->findOrFail($id);

    DB::transaction(function () use ($salesPurchaser) {

        $salesPurchaser->restore();

    });

    return response()->json([
        'message' => 'Purchaser restored successfully.',
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    public function forceDelete(
    int $id
): JsonResponse
{
    $salesPurchaser = SalesPurchaser::onlyTrashed()
        ->findOrFail($id);

    DB::transaction(function () use ($salesPurchaser) {

        /*
        |--------------------------------------------------------------------------
        | Delete Child Accounts First
        |--------------------------------------------------------------------------
        */

        $salesPurchaser
            ->accounts()
            ->withTrashed()
            ->forceDelete();

        /*
        |--------------------------------------------------------------------------
        | Delete Purchaser
        |--------------------------------------------------------------------------
        */

        $salesPurchaser->forceDelete();

    });

    return response()->json([
        'message' => 'Purchaser permanently deleted.',
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

public function statistics(): JsonResponse
{
    return response()->json([
        'total' => SalesPurchaser::withTrashed()->count(),

        'active' => SalesPurchaser::where(
            'status',
            'active'
        )->count(),

        'inactive' => SalesPurchaser::where(
            'status',
            'inactive'
        )->count(),

        'deleted' => SalesPurchaser::onlyTrashed()->count(),

        'with_accounts' => SalesPurchaser::has(
            'accounts'
        )->count(),

        'without_accounts' => SalesPurchaser::doesntHave(
            'accounts'
        )->count(),

        'total_accounts' => DB::table(
            'sales_purchaser_account'
        )->count(),
    ]);
}


    /*
|--------------------------------------------------------------------------
| Export Purchasers
|--------------------------------------------------------------------------
*/

public function export(
    Request $request
): StreamedResponse
{
    $query = SalesPurchaser::query()
        ->with([
            'primaryAccount.bank',
        ])
        ->withCount([
            'accounts',
        ]);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if ($request->filled('search')) {

        $search = trim($request->search);

        $query->where(function ($q) use ($search) {

            $q->where(
                'purchaser_no',
                'ILIKE',
                "%{$search}%"
            )

            ->orWhere(
                'purchaser_name',
                'ILIKE',
                "%{$search}%"
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if ($request->filled('status')) {

        $query->where(
            'status',
            $request->status
        );
    }

    $fileName =
        'purchasers_' .
        now()->format('Ymd_His') .
        '.csv';

    return response()->streamDownload(

        function () use ($query) {

            $handle = fopen(
                'php://output',
                'w'
            );

            fputcsv($handle, [

                'Purchaser No',

                'Purchaser Name',

                'Primary Bank',

                'Primary Account',

                'Accounts',

                'Status',

                'Registered By',

                'Registered Date',

            ]);

            $query
                ->orderBy(
                    'purchaser_name'
                )
                ->chunk(
                    500,
                    function ($rows) use ($handle) {

                        foreach ($rows as $row) {

                            fputcsv($handle, [

                                $row->purchaser_no,

                                $row->purchaser_name,

                                optional(
                                    optional(
                                        $row->primaryAccount
                                    )->bank
                                )->bank_name_original
                                ??
                                optional(
                                    optional(
                                        $row->primaryAccount
                                    )->bank
                                )->bank_name
                                ??
                                optional(
                                    optional(
                                        $row->primaryAccount
                                    )->bank
                                )->name,

                                optional(
                                    $row->primaryAccount
                                )->account_number,

                                $row->accounts_count,

                                ucfirst(
                                    $row->status
                                ),

                                $row->registered_by,

                                optional(
                                    $row->date_registered
                                )?->format(
                                    'Y-m-d'
                                ),

                            ]);

                        }

                    }
                );

            fclose($handle);

        },

        $fileName,

        [
            'Content-Type' =>
                'text/csv',
        ]
    );
}

    /*
|--------------------------------------------------------------------------
| Next Purchaser Number
|--------------------------------------------------------------------------
*/

public function nextNumber(): JsonResponse
{
    return response()->json([
        'purchaser_no' =>
            $this->generateNextPurchaserNumber(),
    ]);
}

private function generateNextPurchaserNumber(): string
{
    /*
    |--------------------------------------------------------------------------
    | Include Soft Deleted Records
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | PUR000001
    | PUR000002
    | PUR000003 (deleted)
    |
    | Next must still be PUR000004.
    |
    */

    $maxNumber = SalesPurchaser::withTrashed()
        ->whereNotNull('purchaser_no')
        ->where(
            'purchaser_no',
            'LIKE',
            'PUR%'
        )
        ->whereRaw(
            "SUBSTRING(purchaser_no FROM 4) ~ '^[0-9]+$'"
        )
        ->selectRaw(
            '
            COALESCE(
                MAX(
                    CAST(
                        SUBSTRING(purchaser_no FROM 4)
                        AS BIGINT
                    )
                ),
                0
            ) AS max_number
            '
        )
        ->value('max_number');

    $nextNumber =
        ((int) $maxNumber) + 1;

    return 'PUR' . str_pad(
        (string) $nextNumber,
        6,
        '0',
        STR_PAD_LEFT
    );
}
}