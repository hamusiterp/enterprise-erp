<?php

namespace App\Http\Middleware;

use App\Services\AccessPolicyService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccessPolicy
{
    public function __construct(
        private readonly AccessPolicyService $accessPolicyService
    ) {
    }

    public function handle(
        Request $request,
        Closure $next,
        ?string $module = null,
        ?string $permission = null
    ): Response {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $allowed = $this->accessPolicyService->isAllowed(
            $user,
            $module,
            $permission
        );

        if (!$allowed) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Access is not allowed at this time.',
                'code' =>
                    'ACCESS_TIME_RESTRICTED',
            ], 403);
        }

        return $next($request);
    }
}