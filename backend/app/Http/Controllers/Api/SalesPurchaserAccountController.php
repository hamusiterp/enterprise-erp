<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SalesPurchaserAccountRequest;
use App\Http\Resources\SalesPurchaserAccountResource;
use App\Models\SalesPurchaser;
use App\Models\SalesPurchaserAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class SalesPurchaserAccountController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | List Accounts
    |--------------------------------------------------------------------------
    */

    public function index(
        SalesPurchaser $salesPurchaser
    ): AnonymousResourceCollection
    {
        return SalesPurchaserAccountResource::collection(

            $salesPurchaser
                ->accounts()
                ->with('bank')
                ->orderByDesc('is_primary')
                ->orderBy('id')
                ->get()

        );
    }

    /*
    |--------------------------------------------------------------------------
    | Store Account
    |--------------------------------------------------------------------------
    */

    public function store(
        SalesPurchaserAccountRequest $request,
        SalesPurchaser $salesPurchaser
    ): SalesPurchaserAccountResource
    {
        $account = DB::transaction(function () use (
            $request,
            $salesPurchaser
        ) {

            $data = $request->validated();

            $data['purchaser_id'] = $salesPurchaser->id;

            $data['registered_by'] =
                auth()->user()?->name ?? 'System';

            $data['registered_by_user_id'] =
                auth()->id();

            $data['date_registered'] =
                now()->toDateString();

            /*
            |--------------------------------------------------------------------------
            | Only One Primary Account
            |--------------------------------------------------------------------------
            */

            if ($data['is_primary']) {

                SalesPurchaserAccount::where(
                    'purchaser_id',
                    $salesPurchaser->id
                )->update([
                    'is_primary' => false,
                ]);
            }

            return SalesPurchaserAccount::create($data);

        });

        $account->load('bank');

        return new SalesPurchaserAccountResource(
            $account
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Account
    |--------------------------------------------------------------------------
    */

    public function update(
        SalesPurchaserAccountRequest $request,
        SalesPurchaser $salesPurchaser,
        SalesPurchaserAccount $salesPurchaserAccount
    ): SalesPurchaserAccountResource
    {
        $account = DB::transaction(function () use (
            $request,
            $salesPurchaser,
            $salesPurchaserAccount
        ) {

            $data = $request->validated();

            if ($data['is_primary']) {

                SalesPurchaserAccount::where(
                    'purchaser_id',
                    $salesPurchaser->id
                )
                ->where(
                    'id',
                    '!=',
                    $salesPurchaserAccount->id
                )
                ->update([
                    'is_primary' => false,
                ]);
            }

            $salesPurchaserAccount->update($data);

            return $salesPurchaserAccount;

        });

        $account->load('bank');

        return new SalesPurchaserAccountResource(
            $account
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Account
    |--------------------------------------------------------------------------
    */

    public function destroy(
        SalesPurchaser $salesPurchaser,
        SalesPurchaserAccount $salesPurchaserAccount
    ): JsonResponse
    {
        $salesPurchaserAccount->delete();

        return response()->json([
            'message' =>
                'Bank account deleted successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Set Primary Account
    |--------------------------------------------------------------------------
    */

    public function setPrimary(
        SalesPurchaser $salesPurchaser,
        SalesPurchaserAccount $salesPurchaserAccount
    ): JsonResponse
    {
        DB::transaction(function () use (
            $salesPurchaser,
            $salesPurchaserAccount
        ) {

            SalesPurchaserAccount::where(
                'purchaser_id',
                $salesPurchaser->id
            )->update([
                'is_primary' => false,
            ]);

            $salesPurchaserAccount->update([
                'is_primary' => true,
            ]);

        });

        return response()->json([
            'message' =>
                'Primary account updated successfully.',
        ]);
    }
}