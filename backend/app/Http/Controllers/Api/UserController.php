<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    /**
     * Display a paginated list of users.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(
            $request->user()?->can('users.view'),
            403,
            'You are not authorized to view users.',
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'locked',
                ]),
            ],

            'role' => [
                'nullable',
                'string',
                'max:255',
            ],

            'sort_by' => [
                'nullable',
                Rule::in([
                    'name',
                    'email',
                    'status',
                    'created_at',
                    'updated_at',
                ]),
            ],

            'sort_direction' => [
                'nullable',
                Rule::in([
                    'asc',
                    'desc',
                ]),
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:100',
            ],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $status = (string) ($validated['status'] ?? '');
        $role = (string) ($validated['role'] ?? '');
        $sortBy = (string) ($validated['sort_by'] ?? 'created_at');
        $sortDirection = (string) ($validated['sort_direction'] ?? 'desc');
        $perPage = (int) ($validated['per_page'] ?? 10);

        $users = User::query()
            ->with('roles')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(
                        function (Builder $query) use ($search): void {
                            $query
                                ->where('name', 'ilike', "%{$search}%")
                                ->orWhere('email', 'ilike', "%{$search}%");
                        },
                    );
                },
            )
            ->when(
                $status !== '',
                function (Builder $query) use ($status): void {
                    $query->where('status', $status);
                },
            )
            ->when(
                $role !== '',
                function (Builder $query) use ($role): void {
                    $query->role($role);
                },
            )
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): UserResource
    {
        $user = DB::transaction(
            function () use ($request): User {
                $validated = $request->validated();

                $roles = $validated['roles'];

                unset($validated['roles']);

                $user = User::create($validated);

                $user->syncRoles($roles);

                return $user;
            },
        );

        return new UserResource(
            $user->load('roles'),
        );
    }

    /**
     * Display one user.
     */
    public function show(
        Request $request,
        User $user,
    ): UserResource {
        abort_unless(
            $request->user()?->can('users.view'),
            403,
            'You are not authorized to view this user.',
        );

        return new UserResource(
            $user->load('roles'),
        );
    }

    /**
     * Update an existing user.
     */
    public function update(
        UpdateUserRequest $request,
        User $user,
    ): UserResource {
        DB::transaction(
            function () use ($request, $user): void {
                $validated = $request->validated();

                $roles = $validated['roles'];

                unset($validated['roles']);

                if (
                    ! isset($validated['password']) ||
                    $validated['password'] === null ||
                    $validated['password'] === ''
                ) {
                    unset($validated['password']);
                }

                $user->update($validated);

                $user->syncRoles($roles);
            },
        );

        return new UserResource(
            $user->fresh()->load('roles'),
        );
    }

    /**
     * Delete a user.
     */
    public function destroy(
        Request $request,
        User $user,
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('users.delete'),
            403,
            'You are not authorized to delete users.',
        );

        if ($request->user()?->is($user)) {
            return response()->json(
                [
                    'message' => 'You cannot delete your own account.',
                ],
                422,
            );
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Return available roles.
     */
    public function roles(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->can('roles.view'),
            403,
            'You are not authorized to view roles.',
        );

        $roles = Role::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return response()->json([
            'data' => $roles,
        ]);
    }

    /**
     * Change a user's account status.
     */
    public function changeStatus(
        Request $request,
        User $user,
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('users.change-status'),
            403,
            'You are not authorized to change user status.',
        );

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                    'locked',
                ]),
            ],
        ]);

        if (
            $request->user()?->is($user) &&
            $validated['status'] !== 'active'
        ) {
            return response()->json(
                [
                    'message' => 'You cannot deactivate or lock your own account.',
                ],
                422,
            );
        }

        $user->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'User status updated successfully.',
            'user' => new UserResource(
                $user->fresh()->load('roles'),
            ),
        ]);
    }

    /**
     * Reset a user's password.
     */
    public function resetPassword(
        Request $request,
        User $user,
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('users.reset-password'),
            403,
            'You are not authorized to reset passwords.',
        );

        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }

    /**
     * Export the filtered user list to Excel.
     */
    public function export(Request $request): StreamedResponse
    {
        abort_unless(
            $request->user()?->can('users.export'),
            403,
            'You are not authorized to export users.',
        );

        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                    'locked',
                ]),
            ],

            'role' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $status = (string) ($validated['status'] ?? '');
        $role = (string) ($validated['role'] ?? '');

        $users = User::query()
            ->with('roles')
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(
                        function (Builder $query) use ($search): void {
                            $query
                                ->where('name', 'ilike', "%{$search}%")
                                ->orWhere('email', 'ilike', "%{$search}%");
                        },
                    );
                },
            )
            ->when(
                $status !== '',
                function (Builder $query) use ($status): void {
                    $query->where('status', $status);
                },
            )
            ->when(
                $role !== '',
                function (Builder $query) use ($role): void {
                    $query->role($role);
                },
            )
            ->orderBy('name')
            ->get();

        $fileName = 'users-'.now()->format('Y-m-d-His').'.xlsx';

        return response()->streamDownload(
            function () use ($users): void {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                $sheet->setTitle('Users');

                $sheet->fromArray(
                    [
                        [
                            'ID',
                            'Name',
                            'Email',
                            'Roles',
                            'Status',
                            'Created Date',
                            'Updated Date',
                        ],
                    ],
                    null,
                    'A1',
                );

                $rowNumber = 2;

                foreach ($users as $user) {
                    $sheet->fromArray(
                        [
                            [
                                $user->id,
                                $user->name,
                                $user->email,
                                $user->roles
                                    ->pluck('name')
                                    ->join(', '),
                                ucfirst($user->status),
                                $user->created_at?->format(
                                    'Y-m-d H:i:s',
                                ),
                                $user->updated_at?->format(
                                    'Y-m-d H:i:s',
                                ),
                            ],
                        ],
                        null,
                        "A{$rowNumber}",
                    );

                    $rowNumber++;
                }

                $lastRow = max($rowNumber - 1, 1);

                $sheet->getStyle('A1:G1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => [
                            'rgb' => 'FFFFFF',
                        ],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => '155EEF',
                        ],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => [
                                'rgb' => 'D0D5DD',
                            ],
                        ],
                    ],
                ]);

                if ($lastRow >= 2) {
                    $sheet
                        ->getStyle("A2:G{$lastRow}")
                        ->getBorders()
                        ->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN)
                        ->getColor()
                        ->setRGB('D0D5DD');
                }

                $sheet->freezePane('A2');
                $sheet->setAutoFilter("A1:G{$lastRow}");

                $sheet->getRowDimension(1)->setRowHeight(24);

                foreach (range('A', 'G') as $column) {
                    $sheet
                        ->getColumnDimension($column)
                        ->setAutoSize(true);
                }

                $sheet
                    ->getStyle("A1:G{$lastRow}")
                    ->getAlignment()
                    ->setVertical(Alignment::VERTICAL_CENTER);

                $writer = new Xlsx($spreadsheet);
                $writer->save('php://output');

                $spreadsheet->disconnectWorksheets();

                unset($spreadsheet);
            },
            $fileName,
            [
                'Content-Type' =>
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Cache-Control' =>
                    'max-age=0, no-cache, no-store, must-revalidate',

                'Pragma' => 'public',
            ],
        );
    }
}