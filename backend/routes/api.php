<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DepartmentController;

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
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function (): void {
        /*
        |--------------------------------------------------------------------------
        | User Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/departments/deleted',
            [DepartmentController::class, 'deleted']
        );

        Route::patch(
            '/departments/{id}/restore',
            [DepartmentController::class, 'restore']
        );

        Route::delete(
            '/departments/{id}/force-delete',
            [DepartmentController::class, 'forceDelete']
        );

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

        Route::get(
            '/users/export',
            [UserController::class, 'export'],
        );

        Route::get(
            '/roles/options',
            [UserController::class, 'roles'],
        );

        Route::patch(
            '/users/{user}/status',
            [UserController::class, 'changeStatus'],
        );

        Route::patch(
            '/users/{user}/reset-password',
            [UserController::class, 'resetPassword'],
        );

        Route::apiResource(
            '/users',
            UserController::class,
        );

        /*
        |--------------------------------------------------------------------------
        | Role Management
        |--------------------------------------------------------------------------
        */

        

        Route::get(
            '/roles/permissions',
            [RoleController::class, 'permissions'],
        );

        Route::get(
    '/roles/export',
    [RoleController::class, 'export'],
);

Route::get(
    '/roles/permissions',
    [RoleController::class, 'permissions'],
);

Route::apiResource(
    '/roles',
    RoleController::class,
);

 
    });
});