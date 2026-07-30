<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\Admin\BankController;
use App\Http\Controllers\Admin\DesignationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

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
        | Bank Management
        |--------------------------------------------------------------------------
        |
        | Special routes must be declared before apiResource.
        |
        */

        Route::get(
            '/banks/deleted',
            [BankController::class, 'trash']
        );

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
    });
});