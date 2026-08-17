<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\Admin\BankController;
use App\Http\Controllers\Admin\DesignationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\ItemController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\SalesSupplierController;
use App\Http\Controllers\Api\Admin\SalesCustomerController;
use App\Http\Controllers\Api\Admin\SalesFixedAssetController;
use App\Http\Controllers\Api\SalesPurchaserController;
use App\Http\Controllers\Api\SalesPurchaserAccountController;
use App\Http\Controllers\Api\Admin\ChequeController;
use App\Http\Controllers\Api\Admin\SalesSubcontractorController;
use App\Http\Controllers\Api\PermissionController;

use App\Http\Controllers\Api\MobileAuthController;
use App\Http\Controllers\Api\Admin\CompanySettingController;

use App\Http\Controllers\Api\Admin\FiscalYearController;

use App\Http\Controllers\Api\Admin\DocumentSequenceController;

use App\Http\Controllers\Api\Admin\TaxRateController;
use App\Http\Controllers\Api\Admin\ReportingPeriodController;
use App\Http\Controllers\Api\Admin\AccessPolicyController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::prefix('mobile')->group(function (): void {
    Route::post('/login', [MobileAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/user', [MobileAuthController::class, 'user']);
        Route::post('/logout', [MobileAuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function (): void {

    /*
    |--------------------------------------------------------------------------
    | Authenticated User
    |--------------------------------------------------------------------------
    */

    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('settings/company-profile')->group(function () {

    Route::get(
        '/',
        [CompanySettingController::class, 'show']
    );

    Route::put(
        '/',
        [CompanySettingController::class, 'update']
    );

    Route::post(
        '/branding',
        [CompanySettingController::class, 'uploadBranding']
    );
});

Route::prefix('settings/fiscal-years')->group(function () {

    Route::get(
        '/',
        [FiscalYearController::class, 'index']
    );

    Route::post(
        '/',
        [FiscalYearController::class, 'store']
    );

    Route::get(
        '/{fiscalYear}',
        [FiscalYearController::class, 'show']
    );

    Route::put(
        '/{fiscalYear}',
        [FiscalYearController::class, 'update']
    );

    Route::post(
        '/{fiscalYear}/set-current',
        [FiscalYearController::class, 'setCurrent']
    );

    Route::post(
        '/{fiscalYear}/close',
        [FiscalYearController::class, 'close']
    );

    Route::post(
        '/{fiscalYear}/lock',
        [FiscalYearController::class, 'lock']
    );

    Route::post(
    '/{fiscalYear}/copy-sequences',
    [FiscalYearController::class, 'copySequences']
);
});

Route::prefix('settings/document-sequences')->group(function () {

    Route::get(
        '/',
        [DocumentSequenceController::class, 'index']
    );

    Route::post(
        '/',
        [DocumentSequenceController::class, 'store']
    );

    Route::get(
        '/{documentSequence}',
        [DocumentSequenceController::class, 'show']
    );

    Route::put(
        '/{documentSequence}',
        [DocumentSequenceController::class, 'update']
    );
});

Route::prefix('settings/tax-rates')->group(function () {

    Route::get(
        '/',
        [TaxRateController::class, 'index']
    );

    Route::post(
        '/',
        [TaxRateController::class, 'store']
    );

    Route::get(
        '/{taxRate}',
        [TaxRateController::class, 'show']
    );

    Route::put(
        '/{taxRate}',
        [TaxRateController::class, 'update']
    );
});

Route::prefix('settings/reporting-periods')->group(function () {

    Route::get(
        '/',
        [ReportingPeriodController::class, 'index']
    );

    Route::post(
        '/',
        [ReportingPeriodController::class, 'store']
    );

    Route::get(
        '/{reportingPeriod}',
        [ReportingPeriodController::class, 'show']
    );

    Route::put(
        '/{reportingPeriod}',
        [ReportingPeriodController::class, 'update']
    );
});

Route::prefix('settings/access-policies')->group(function () {

    Route::get(
        '/',
        [AccessPolicyController::class, 'index']
    );

    Route::post(
        '/',
        [AccessPolicyController::class, 'store']
    );

    Route::get(
        '/{accessPolicy}',
        [AccessPolicyController::class, 'show']
    );

    Route::put(
        '/{accessPolicy}',
        [AccessPolicyController::class, 'update']
    );
});

    /*
    |--------------------------------------------------------------------------
    | Administration Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin')->group(function (): void {

        /*
        |--------------------------------------------------------------------------
        | Department Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/departments/statistics',
            [DepartmentController::class, 'statistics']
        );

        Route::get(
            '/departments/deleted',
            [DepartmentController::class, 'deleted']
        );

        Route::patch(
            '/departments/{id}/restore',
            [DepartmentController::class, 'restore']
        )->whereNumber('id');

        Route::delete(
            '/departments/{id}/force-delete',
            [DepartmentController::class, 'forceDelete']
        )->whereNumber('id');

        Route::get(
            '/departments/export',
            [DepartmentController::class, 'export']
        );

        Route::get(
            '/departments/options',
            [DepartmentController::class, 'options']
        );

        Route::patch(
            '/departments/{department}/status',
            [DepartmentController::class, 'changeStatus']
        );

        Route::apiResource(
            '/departments',
            DepartmentController::class
        );

        /*
        |--------------------------------------------------------------------------
        | User Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/users/export',
            [UserController::class, 'export']
        );

        Route::get(
            '/roles/options',
            [UserController::class, 'roles']
        );

        Route::patch(
            '/users/{user}/status',
            [UserController::class, 'changeStatus']
        );

        Route::patch(
            '/users/{user}/reset-password',
            [UserController::class, 'resetPassword']
        );

        Route::apiResource(
            '/users',
            UserController::class
        );

        /*
        |--------------------------------------------------------------------------
        | Designation Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/designations/deleted',
            [DesignationController::class, 'deleted']
        );

        Route::patch(
            '/designations/{id}/restore',
            [DesignationController::class, 'restore']
        )->whereNumber('id');

        Route::delete(
            '/designations/{id}/force-delete',
            [DesignationController::class, 'forceDelete']
        )->whereNumber('id');

        Route::get(
            '/designations/export',
            [DesignationController::class, 'export']
        );

        Route::patch(
            '/designations/{designation}/status',
            [DesignationController::class, 'changeStatus']
        );

        Route::apiResource(
            '/designations',
            DesignationController::class
        );

        /*
        |--------------------------------------------------------------------------
        | Role Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/roles/export',
            [RoleController::class, 'export']
        );

        Route::get(
            '/roles/permissions',
            [RoleController::class, 'permissions']
        );

        Route::apiResource(
            '/roles',
            RoleController::class
        );

        /*
        |--------------------------------------------------------------------------
        | Permission Management
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            '/permissions',
            PermissionController::class
        );

        /*
        |--------------------------------------------------------------------------
        | Bank Management
        |--------------------------------------------------------------------------
        |
        | Special routes must be declared before apiResource.
        |
        */

        Route::get('/banks/deleted', [BankController::class, 'deleted']);

        Route::get(
            '/banks/export',
            [BankController::class, 'export']
        );

        Route::post(
            '/banks/{id}/restore',
            [BankController::class, 'restore']
        )->whereNumber('id');

        Route::delete(
            '/banks/{id}/force-delete',
            [BankController::class, 'forceDelete']
        )->whereNumber('id');

        Route::patch(
            '/banks/{bank}/status',
            [BankController::class, 'changeStatus']
        );

        Route::apiResource(
            '/banks',
            BankController::class
        );

        /*
        |--------------------------------------------------------------------------
        | Item Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/items/statistics',
            [ItemController::class, 'statistics']
        );

        Route::get(
            '/items/deleted',
            [ItemController::class, 'deleted']
        );

        Route::get(
            '/items/export',
            [ItemController::class, 'export']
        );

        Route::get(
            '/items/options',
            [ItemController::class, 'options']
        );

        Route::patch(
            '/items/{id}/restore',
            [ItemController::class, 'restore']
        )->whereNumber('id');

        Route::delete(
            '/items/{id}/force-delete',
            [ItemController::class, 'forceDelete']
        )->whereNumber('id');

        Route::patch(
            '/items/{item}/status',
            [ItemController::class, 'changeStatus']
        );

        Route::apiResource(
            '/items',
            ItemController::class
        );

        /*
/*
|--------------------------------------------------------------------------
| Project Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/projects/statistics',
    [ProjectController::class, 'statistics']
);

Route::get(
    '/projects/deleted',
    [ProjectController::class, 'deleted']
);

Route::get(
    '/projects/export',
    [ProjectController::class, 'export']
);

Route::get(
    '/projects/bid-options',
    [ProjectController::class, 'bidOptions']
);

Route::get(
    '/projects/work-order-options',
    [ProjectController::class, 'workOrderOptions']
);

Route::get(
    '/projects/customer-options',
    [ProjectController::class, 'customerOptions']
);

Route::get(
    '/projects/next-number',
    [ProjectController::class, 'nextProjectNumber']
);

Route::patch(
    '/projects/{id}/restore',
    [ProjectController::class, 'restore']
)->whereNumber('id');

Route::delete(
    '/projects/{id}/force-delete',
    [ProjectController::class, 'forceDelete']
)->whereNumber('id');

Route::patch(
    '/projects/{project}/status',
    [ProjectController::class, 'changeStatus']
);

Route::apiResource(
    '/projects',
    ProjectController::class
);

/*
|--------------------------------------------------------------------------
| Category Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/categories/statistics',
    [CategoryController::class, 'statistics']
);

Route::get(
    '/categories/deleted',
    [CategoryController::class, 'deleted']
);

Route::get(
    '/categories/export',
    [CategoryController::class, 'export']
);

Route::get(
    '/categories/options',
    [CategoryController::class, 'options']
);

Route::patch(
    '/categories/{id}/restore',
    [CategoryController::class, 'restore']
)->whereNumber('id');

Route::delete(
    '/categories/{id}/force-delete',
    [CategoryController::class, 'forceDelete']
)->whereNumber('id');

Route::patch(
    '/categories/{category}/status',
    [CategoryController::class, 'changeStatus']
);

Route::apiResource(
    '/categories',
    CategoryController::class
);

/*
|--------------------------------------------------------------------------
| Supplier Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/suppliers/statistics',
    [SalesSupplierController::class, 'statistics']
);

Route::get(
    '/suppliers/deleted',
    [SalesSupplierController::class, 'deleted']
);

Route::get(
    '/suppliers/export',
    [SalesSupplierController::class, 'export']
);

Route::get(
    '/suppliers/next-number',
    [SalesSupplierController::class, 'nextSupplierNumber']
);

Route::patch(
    '/suppliers/{id}/restore',
    [SalesSupplierController::class, 'restore']
)->whereNumber('id');

Route::delete(
    '/suppliers/{id}/force-delete',
    [SalesSupplierController::class, 'forceDelete']
)->whereNumber('id');

Route::patch(
    '/suppliers/{salesSupplier}/status',
    [SalesSupplierController::class, 'changeStatus']
);

Route::apiResource(
    '/suppliers',
    SalesSupplierController::class
)->parameters([
    'suppliers' => 'salesSupplier',
]);

/*
|--------------------------------------------------------------------------
| Customer Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/customers/statistics',
    [SalesCustomerController::class, 'statistics']
);

Route::get(
    '/customers/deleted',
    [SalesCustomerController::class, 'deleted']
);

Route::get(
    '/customers/export',
    [SalesCustomerController::class, 'export']
);

Route::get(
    '/customers/options',
    [SalesCustomerController::class, 'options']
);

Route::get(
    '/customers/next-number',
    [SalesCustomerController::class, 'nextCustomerNumber']
);

Route::patch(
    '/customers/{id}/restore',
    [SalesCustomerController::class, 'restore']
)->whereNumber('id');

Route::delete(
    '/customers/{id}/force-delete',
    [SalesCustomerController::class, 'forceDelete']
)->whereNumber('id');

Route::patch(
    '/customers/{salesCustomer}/status',
    [SalesCustomerController::class, 'changeStatus']
);

Route::apiResource(
    '/customers',
    SalesCustomerController::class
)->parameters([
    'customers' => 'salesCustomer',
]);

/*
|--------------------------------------------------------------------------
| Fixed Asset Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/fixed-assets/statistics',
    [SalesFixedAssetController::class, 'statistics']
);

Route::get(
    '/fixed-assets/deleted',
    [SalesFixedAssetController::class, 'deleted']
);

Route::get(
    '/fixed-assets/export',
    [SalesFixedAssetController::class, 'export']
);

Route::get(
    '/fixed-assets/next-number',
    [SalesFixedAssetController::class, 'nextAssetNumber']
);

Route::patch(
    '/fixed-assets/{id}/restore',
    [SalesFixedAssetController::class, 'restore']
)->whereNumber('id');

Route::delete(
    '/fixed-assets/{id}/force-delete',
    [SalesFixedAssetController::class, 'forceDelete']
)->whereNumber('id');

Route::patch(
    '/fixed-assets/{salesFixedAsset}/status',
    [SalesFixedAssetController::class, 'changeStatus']
);

Route::apiResource(
    '/fixed-assets',
    SalesFixedAssetController::class
)->parameters([
    'fixed-assets' => 'salesFixedAsset',
]);

/*
|--------------------------------------------------------------------------
| Purchasers
|--------------------------------------------------------------------------
*/

Route::get(
    '/sales/purchasers',
    [SalesPurchaserController::class, 'index']
);

Route::get(
    '/sales/purchasers/deleted',
    [SalesPurchaserController::class, 'deleted']
);

Route::get(
    '/sales/purchasers/statistics',
    [SalesPurchaserController::class, 'statistics']
);

Route::get(
    '/sales/purchasers/export',
    [SalesPurchaserController::class, 'export']
);

Route::get(
    '/sales/purchasers/next-number',
    [SalesPurchaserController::class, 'nextNumber']
);

Route::post(
    '/sales/purchasers',
    [SalesPurchaserController::class, 'store']
);

Route::get(
    '/sales/purchasers/{salesPurchaser}',
    [SalesPurchaserController::class, 'show']
);

Route::put(
    '/sales/purchasers/{salesPurchaser}',
    [SalesPurchaserController::class, 'update']
);

Route::delete(
    '/sales/purchasers/{salesPurchaser}',
    [SalesPurchaserController::class, 'destroy']
);

Route::post(
    '/sales/purchasers/{id}/restore',
    [SalesPurchaserController::class, 'restore']
);

Route::delete(
    '/sales/purchasers/{id}/force-delete',
    [SalesPurchaserController::class, 'forceDelete']
);

/*
|--------------------------------------------------------------------------
| Purchaser Accounts
|--------------------------------------------------------------------------
*/

Route::get(
    '/sales/purchasers/{salesPurchaser}/accounts',
    [SalesPurchaserAccountController::class, 'index']
);

Route::post(
    '/sales/purchasers/{salesPurchaser}/accounts',
    [SalesPurchaserAccountController::class, 'store']
);

Route::put(
    '/sales/purchasers/{salesPurchaser}/accounts/{salesPurchaserAccount}',
    [SalesPurchaserAccountController::class, 'update']
);

Route::delete(
    '/sales/purchasers/{salesPurchaser}/accounts/{salesPurchaserAccount}',
    [SalesPurchaserAccountController::class, 'destroy']
);

Route::patch(
    '/sales/purchasers/{salesPurchaser}/accounts/{salesPurchaserAccount}/primary',
    [SalesPurchaserAccountController::class, 'setPrimary']
);

/*Route::apiResource(
        'purchasers',
        PurchaserController::class
    );*/

    /*
|--------------------------------------------------------------------------
| Cheque Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/finance/cheques/statistics',
    [ChequeController::class, 'statistics']
);

Route::get(
    '/finance/cheques/deleted',
    [ChequeController::class, 'deleted']
);

Route::get(
    '/finance/cheques/export',
    [ChequeController::class, 'export']
);

Route::post(
    '/finance/cheques/{id}/restore',
    [ChequeController::class, 'restore']
)->whereNumber('id');

Route::patch(
    '/finance/cheques/{cheque}/void',
    [ChequeController::class, 'void']
);

Route::patch(
    '/finance/cheques/{cheque}/activate',
    [ChequeController::class, 'activate']
);

Route::apiResource(
    '/finance/cheques',
    ChequeController::class
);

/*
|--------------------------------------------------------------------------
| Subcontractor Management
|--------------------------------------------------------------------------
*/

Route::get(
    '/sales/subcontractors/statistics',
    [SalesSubcontractorController::class, 'statistics']
);

Route::get(
    '/sales/subcontractors/deleted',
    [SalesSubcontractorController::class, 'deleted']
);

Route::get(
    '/sales/subcontractors/export',
    [SalesSubcontractorController::class, 'export']
);

Route::post(
    '/sales/subcontractors/{id}/restore',
    [SalesSubcontractorController::class, 'restore']
)->whereNumber('id');

Route::apiResource(
    'sales/subcontractors',
    SalesSubcontractorController::class
)->parameters([
    'subcontractors' => 'salesSubcontractor',
]);

    }); // end admin

}); // end auth:sanctum


/*
|--------------------------------------------------------------------------
| KASCON Mobile API
|--------------------------------------------------------------------------
|
| Mobile authentication is separate from the existing web/API login.
| The login route must remain public.
|
*/

Route::prefix('mobile')->group(function (): void {

    /*
    |--------------------------------------------------------------------------
    | Public Mobile Routes
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/login',
        [MobileAuthController::class, 'login']
    )->middleware('throttle:5,1');


    /*
    |--------------------------------------------------------------------------
    | Protected Mobile Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('auth:sanctum')->group(function (): void {

        Route::get(
            '/user',
            [MobileAuthController::class, 'user']
        );

        Route::post(
            '/logout',
            [MobileAuthController::class, 'logout']
        );

    });

});