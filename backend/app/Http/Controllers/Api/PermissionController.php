<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('permissions.view'),
            403,
            'You are not authorized to view permissions.'
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],
            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:100',
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $perPage = (int) (
            $validated['per_page'] ?? 10
        );

        $query = Permission::query()
            ->where('guard_name', 'web')
            ->withCount('roles');

        if ($search !== '') {
            $query->where(
                'name',
                'ilike',
                '%' . $search . '%'
            );
        }

        $permissions = $query
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json([
            'data' => collect($permissions->items())
                ->map(
                    fn (Permission $permission) =>
                        $this->formatPermission($permission)
                )
                ->values(),

            'meta' => [
                'current_page' =>
                    $permissions->currentPage(),

                'last_page' =>
                    $permissions->lastPage(),

                'per_page' =>
                    $permissions->perPage(),

                'total' =>
                    $permissions->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('permissions.create'),
            403,
            'You are not authorized to create permissions.'
        );

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'permissions',
                    'name'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'guard_name',
                            'web'
                        )
                ),
            ],
        ]);

        $name = $this->normalizeName(
            $validated['name']
        );

        $permission = Permission::create([
            'name' => $name,
            'guard_name' => 'web',
        ]);

        app(PermissionRegistrar::class)
            ->forgetCachedPermissions();

        return response()->json([
            'message' =>
                'Permission created successfully.',

            'data' =>
                $this->formatPermission(
                    $permission
                ),
        ], 201);
    }

    public function show(
        Request $request,
        Permission $permission
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('permissions.view'),
            403
        );

        $this->ensureWebGuard($permission);

        $permission->loadCount('roles');

        return response()->json([
            'data' =>
                $this->formatPermission(
                    $permission
                ),
        ]);
    }

    public function update(
        Request $request,
        Permission $permission
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('permissions.update'),
            403,
            'You are not authorized to update permissions.'
        );

        $this->ensureWebGuard($permission);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'permissions',
                    'name'
                )
                    ->ignore($permission->id)
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'guard_name',
                                'web'
                            )
                    ),
            ],
        ]);

        $permission->update([
            'name' => $this->normalizeName(
                $validated['name']
            ),
        ]);

        app(PermissionRegistrar::class)
            ->forgetCachedPermissions();

        $permission->refresh();
        $permission->loadCount('roles');

        return response()->json([
            'message' =>
                'Permission updated successfully.',

            'data' =>
                $this->formatPermission(
                    $permission
                ),
        ]);
    }

    public function destroy(
        Request $request,
        Permission $permission
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('permissions.delete'),
            403,
            'You are not authorized to delete permissions.'
        );

        $this->ensureWebGuard($permission);

        $rolesCount = $permission
            ->roles()
            ->count();

        if ($rolesCount > 0) {
            return response()->json([
                'message' =>
                    'This permission is assigned to one or more roles and cannot be deleted.',
            ], 422);
        }

        $permission->delete();

        app(PermissionRegistrar::class)
            ->forgetCachedPermissions();

        return response()->json([
            'message' =>
                'Permission deleted successfully.',
        ]);
    }

    private function normalizeName(
        string $name
    ): string {
        return strtolower(
            preg_replace(
                '/\s+/',
                '',
                trim($name)
            ) ?? trim($name)
        );
    }

    private function ensureWebGuard(
        Permission $permission
    ): void {
        abort_unless(
            $permission->guard_name === 'web',
            404
        );
    }

    private function formatPermission(
        Permission $permission
    ): array {
        $parts = explode(
            '.',
            $permission->name,
            2
        );

        $module = $parts[0] ?? '';

        $action = $parts[1] ?? '';

        return [
            'id' => $permission->id,

            'name' => $permission->name,

            'module' => $module,

            'action' => $action,

            'roles_count' =>
                (int) (
                    $permission->roles_count ?? 0
                ),

            'guard_name' =>
                $permission->guard_name,

            'created_at' =>
                $permission->created_at
                    ?->toISOString(),

            'updated_at' =>
                $permission->updated_at
                    ?->toISOString(),
        ];
    }
}