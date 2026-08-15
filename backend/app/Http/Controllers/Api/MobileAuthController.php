<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MobileAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where(
            'email',
            $credentials['email']
        )->first();

        if (
            !$user ||
            !Hash::check(
                $credentials['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'The provided credentials are incorrect.'
                ],
            ]);
        }

        if (
            isset($user->status) &&
            strtolower($user->status) !== 'active'
        ) {
            return response()->json([
                'message' => 'Your account is inactive.'
            ], 403);
        }

        $user->tokens()
            ->where('name', 'kascon-mobile')
            ->delete();

        $token = $user
            ->createToken('kascon-mobile')
            ->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,

                'status' => $user->status ?? null,

                'roles' => method_exists(
                    $user,
                    'getRoleNames'
                )
                    ? $user->getRoleNames()->values()
                    : [],

                'permissions' => method_exists(
                    $user,
                    'getAllPermissions'
                )
                    ? $user->getAllPermissions()
                        ->pluck('name')
                        ->values()
                    : [],
            ],
        ]);
    }


    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,

            'status' => $user->status ?? null,

            'roles' => method_exists(
                $user,
                'getRoleNames'
            )
                ? $user->getRoleNames()->values()
                : [],

            'permissions' => method_exists(
                $user,
                'getAllPermissions'
            )
                ? $user->getAllPermissions()
                    ->pluck('name')
                    ->values()
                : [],
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Logged out successfully.'
        ]);
    }
}