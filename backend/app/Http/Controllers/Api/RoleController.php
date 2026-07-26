<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RoleController extends Controller
{
    /**
     * Display a paginated list of roles.
     */
    public function index(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('roles.view'),
            403,
            'You are not authorized to view roles.'
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

        $query = Role::query()
            ->where('guard_name', 'web')
            ->with([
                'permissions:id,name',
            ])
            ->withCount('permissions');

        if ($search !== '') {
            $this->applySearch(
                $query,
                $search
            );
        }

        $roles = $query
            ->orderBy('name')
            ->paginate($perPage);

        $roleIds = collect($roles->items())
            ->pluck('id')
            ->all();

        $userCounts = $this->getUserCounts(
            $roleIds
        );

        $data = collect($roles->items())
            ->map(
                function (Role $role) use (
                    $userCounts
                ): array {
                    return $this->formatRole(
                        $role,
                        (int) (
                            $userCounts[$role->id] ?? 0
                        )
                    );
                }
            )
            ->values();

        return response()->json([
            'data' => $data,

            'meta' => [
                'current_page' =>
                    $roles->currentPage(),

                'from' =>
                    $roles->firstItem(),

                'last_page' =>
                    $roles->lastPage(),

                'per_page' =>
                    $roles->perPage(),

                'to' =>
                    $roles->lastItem(),

                'total' =>
                    $roles->total(),
            ],
        ]);
    }

    /**
     * Store a new role.
     */
    public function store(
        Request $request
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('roles.create'),
            403,
            'You are not authorized to create roles.'
        );

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'roles',
                    'name'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'guard_name',
                            'web'
                        )
                ),
            ],

            'permissions' => [
                'required',
                'array',
                'min:1',
            ],

            'permissions.*' => [
                'required',
                'string',
                'distinct',

                Rule::exists(
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

        $role = DB::transaction(
            function () use ($validated): Role {
                $role = Role::create([
                    'name' => trim(
                        $validated['name']
                    ),

                    'guard_name' => 'web',
                ]);

                $role->syncPermissions(
                    $validated['permissions']
                );

                return $role;
            }
        );

        $role->load(
            'permissions:id,name'
        );

        $role->loadCount(
            'permissions'
        );

        return response()->json([
            'message' =>
                'Role created successfully.',

            'data' => $this->formatRole(
                $role,
                0
            ),
        ], 201);
    }

    /**
     * Display one role.
     */
    public function show(
        Request $request,
        Role $role
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('roles.view'),
            403,
            'You are not authorized to view this role.'
        );

        $this->ensureWebGuardRole($role);

        $role->load(
            'permissions:id,name'
        );

        $role->loadCount(
            'permissions'
        );

        $usersCount = $this->getRoleUserCount(
            $role->id
        );

        return response()->json([
            'data' => $this->formatRole(
                $role,
                $usersCount
            ),
        ]);
    }

    /**
     * Update an existing role.
     */
    public function update(
        Request $request,
        Role $role
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('roles.update'),
            403,
            'You are not authorized to update roles.'
        );

        $this->ensureWebGuardRole($role);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',

                Rule::unique(
                    'roles',
                    'name'
                )
                    ->ignore($role->id)
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'guard_name',
                                'web'
                            )
                    ),
            ],

            'permissions' => [
                'required',
                'array',
                'min:1',
            ],

            'permissions.*' => [
                'required',
                'string',
                'distinct',

                Rule::exists(
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

        DB::transaction(
            function () use (
                $role,
                $validated
            ): void {
                if (
                    $role->name ===
                    'Administrator'
                ) {
                    $allPermissions =
                        Permission::query()
                            ->where(
                                'guard_name',
                                'web'
                            )
                            ->pluck('name')
                            ->all();

                    $role->syncPermissions(
                        $allPermissions
                    );

                    return;
                }

                $role->update([
                    'name' => trim(
                        $validated['name']
                    ),
                ]);

                $role->syncPermissions(
                    $validated['permissions']
                );
            }
        );

        $role->refresh();

        $role->load(
            'permissions:id,name'
        );

        $role->loadCount(
            'permissions'
        );

        $usersCount = $this->getRoleUserCount(
            $role->id
        );

        $message =
            $role->name === 'Administrator'
                ? 'Administrator role retains all permissions.'
                : 'Role updated successfully.';

        return response()->json([
            'message' => $message,

            'data' => $this->formatRole(
                $role,
                $usersCount
            ),
        ]);
    }

    /**
     * Delete a role.
     */
    public function destroy(
        Request $request,
        Role $role
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('roles.delete'),
            403,
            'You are not authorized to delete roles.'
        );

        $this->ensureWebGuardRole($role);

        if (
            $role->name ===
            'Administrator'
        ) {
            return response()->json([
                'message' =>
                    'The Administrator role cannot be deleted.',
            ], 422);
        }

        $usersCount = $this->getRoleUserCount(
            $role->id
        );

        if ($usersCount > 0) {
            return response()->json([
                'message' =>
                    'This role is assigned to users and cannot be deleted.',
            ], 422);
        }

        $role->delete();

        return response()->json([
            'message' =>
                'Role deleted successfully.',
        ]);
    }

    /**
     * Return all permissions grouped by module.
     */
    public function permissions(
        Request $request
    ): JsonResponse {
        abort_unless(
            $request->user()?->can(
                'permissions.view'
            ),
            403,
            'You are not authorized to view permissions.'
        );

        $permissions =
            Permission::query()
                ->where(
                    'guard_name',
                    'web'
                )
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]);

        $groupedPermissions =
            $permissions
                ->groupBy(
                    function (
                        Permission $permission
                    ): string {
                        return explode(
                            '.',
                            $permission->name
                        )[0];
                    }
                )
                ->map(
                    function (
                        $items,
                        string $module
                    ): array {
                        return [
                            'module' => $module,

                            'label' => str(
                                $module
                            )
                                ->replace(
                                    '-',
                                    ' '
                                )
                                ->replace(
                                    '_',
                                    ' '
                                )
                                ->title()
                                ->toString(),

                            'permissions' =>
                                $items
                                    ->map(
                                        function (
                                            Permission $permission
                                        ): array {
                                            $parts =
                                                explode(
                                                    '.',
                                                    $permission->name,
                                                    2
                                                );

                                            $action =
                                                $parts[1]
                                                ?? $permission->name;

                                            return [
                                                'id' =>
                                                    $permission->id,

                                                'name' =>
                                                    $permission->name,

                                                'label' =>
                                                    str(
                                                        $action
                                                    )
                                                        ->replace(
                                                            '-',
                                                            ' '
                                                        )
                                                        ->replace(
                                                            '_',
                                                            ' '
                                                        )
                                                        ->title()
                                                        ->toString(),
                                            ];
                                        }
                                    )
                                    ->values()
                                    ->all(),
                        ];
                    }
                )
                ->values();

        return response()->json([
            'data' =>
                $groupedPermissions,
        ]);
    }

    /**
     * Export roles to Excel.
     */
    public function export(
        Request $request
    ): StreamedResponse {
        abort_unless(
            $request->user()?->can('roles.view'),
            403,
            'You are not authorized to export roles.'
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $query = Role::query()
            ->where('guard_name', 'web')
            ->with([
                'permissions:id,name',
            ])
            ->withCount('permissions');

        if ($search !== '') {
            $this->applySearch(
                $query,
                $search
            );
        }

        $roles = $query
            ->orderBy('name')
            ->get();

        $roleIds = $roles
            ->pluck('id')
            ->all();

        $userCounts = $this->getUserCounts(
            $roleIds
        );

        $spreadsheet =
            new Spreadsheet();

        $sheet =
            $spreadsheet
                ->getActiveSheet();

        $sheet->setTitle('Roles');

        $sheet->fromArray([
            [
                'ID',
                'Role Name',
                'Guard',
                'Assigned Users',
                'Permission Count',
                'Permissions',
                'System Role',
                'Created At',
                'Updated At',
            ],
        ], null, 'A1');

        $rowNumber = 2;

        foreach ($roles as $role) {
            $sheet->fromArray([
                [
                    $role->id,

                    $role->name,

                    $role->guard_name,

                    (int) (
                        $userCounts[
                            $role->id
                        ] ?? 0
                    ),

                    (int) (
                        $role->permissions_count
                        ?? $role
                            ->permissions
                            ->count()
                    ),

                    $role->permissions
                        ->pluck('name')
                        ->implode(', '),

                    $role->name ===
                    'Administrator'
                        ? 'Yes'
                        : 'No',

                    $role->created_at
                        ?->format(
                            'Y-m-d H:i:s'
                        ),

                    $role->updated_at
                        ?->format(
                            'Y-m-d H:i:s'
                        ),
                ],
            ], null, "A{$rowNumber}");

            $rowNumber++;
        }

        $sheet
            ->getStyle('A1:I1')
            ->getFont()
            ->setBold(true);

        $sheet
            ->getStyle('A1:I1')
            ->getAlignment()
            ->setHorizontal('center');

        $sheet->freezePane('A2');

        $lastRow = max(
            1,
            $rowNumber - 1
        );

        $sheet->setAutoFilter(
            "A1:I{$lastRow}"
        );

        foreach (
            range('A', 'I')
            as $column
        ) {
            $sheet
                ->getColumnDimension(
                    $column
                )
                ->setAutoSize(true);
        }

        $sheet
            ->getStyle(
                "F2:F{$lastRow}"
            )
            ->getAlignment()
            ->setWrapText(true);

        $fileName =
            'roles-' .
            now()->format(
                'Y-m-d-His'
            ) .
            '.xlsx';

        return response()->streamDownload(
            function () use (
                $spreadsheet
            ): void {
                $writer =
                    new Xlsx(
                        $spreadsheet
                    );

                $writer->save(
                    'php://output'
                );

                $spreadsheet
                    ->disconnectWorksheets();
            },
            $fileName,
            [
                'Content-Type' =>
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Cache-Control' =>
                    'max-age=0, no-cache, no-store, must-revalidate',
            ]
        );
    }

    /**
     * Apply database-compatible role search.
     */
    private function applySearch(
        Builder $query,
        string $search
    ): void {
        $operator =
            DB::connection()
                ->getDriverName() ===
            'pgsql'
                ? 'ilike'
                : 'like';

        $query->where(
            'name',
            $operator,
            '%' . $search . '%'
        );
    }

    /**
     * Return user counts keyed by role ID.
     */
    private function getUserCounts(
        array $roleIds
    ): array {
        if (empty($roleIds)) {
            return [];
        }

        return DB::table(
            'model_has_roles'
        )
            ->select(
                'role_id',
                DB::raw(
                    'COUNT(*) AS total'
                )
            )
            ->whereIn(
                'role_id',
                $roleIds
            )
            ->where(
                'model_type',
                User::class
            )
            ->groupBy('role_id')
            ->pluck(
                'total',
                'role_id'
            )
            ->map(
                fn ($count): int =>
                    (int) $count
            )
            ->all();
    }

    /**
     * Return the number of users assigned to one role.
     */
    private function getRoleUserCount(
        int $roleId
    ): int {
        return (int) DB::table(
            'model_has_roles'
        )
            ->where(
                'role_id',
                $roleId
            )
            ->where(
                'model_type',
                User::class
            )
            ->count();
    }

    /**
     * Ensure the role belongs to the web guard.
     */
    private function ensureWebGuardRole(
        Role $role
    ): void {
        abort_unless(
            $role->guard_name === 'web',
            404,
            'Role not found.'
        );
    }

    /**
     * Format a role for API responses.
     */
    private function formatRole(
        Role $role,
        int $usersCount
    ): array {
        return [
            'id' =>
                $role->id,

            'name' =>
                $role->name,

            'guard_name' =>
                $role->guard_name,

            'permissions' =>
                $role->permissions
                    ->pluck('name')
                    ->values()
                    ->all(),

            'permissions_count' =>
                (int) (
                    $role->permissions_count
                    ?? $role
                        ->permissions
                        ->count()
                ),

            'users_count' =>
                $usersCount,

            'is_system' =>
                $role->name ===
                'Administrator',

            'created_at' =>
                $role->created_at
                    ?->toISOString(),

            'updated_at' =>
                $role->updated_at
                    ?->toISOString(),
        ];
    }
}