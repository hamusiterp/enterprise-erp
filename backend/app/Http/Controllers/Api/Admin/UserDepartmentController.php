<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserDepartmentController extends Controller
{
    /**
     * Get department assignments for one user.
     */
    public function index(
        Request $request,
        User $user
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('users.view'),
            403,
            'You do not have permission to view user departments.'
        );

        $departments = $user
            ->departments()
            ->orderBy('department_name')
            ->get()
            ->map(function ($department) {
                return [
                    'department_id' =>
                        $department->id,

                    'department_code' =>
                        $department->department_id,

                    'department_name' =>
                        $department->department_name,

                    'status' =>
                        $department->status,

                    'is_primary' =>
                        (bool) $department->pivot->is_primary,

                    'is_active' =>
                        (bool) $department->pivot->is_active,

                    'effective_from' =>
                        $department->pivot->effective_from,

                    'effective_to' =>
                        $department->pivot->effective_to,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    /**
     * Replace the user's department assignments.
     */
    public function update(
        Request $request,
        User $user
    ): JsonResponse {
        abort_unless(
            $request->user()?->can('users.update'),
            403,
            'You do not have permission to manage user departments.'
        );

        $validated = $request->validate([
            'departments' => [
                'required',
                'array',
            ],

            'departments.*.department_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists(
                    'departments',
                    'id'
                )->whereNull('deleted_at'),
            ],

            'departments.*.is_primary' => [
                'required',
                'boolean',
            ],

            'departments.*.is_active' => [
                'required',
                'boolean',
            ],

            'departments.*.effective_from' => [
                'nullable',
                'date',
            ],

            'departments.*.effective_to' => [
                'nullable',
                'date',
                'after_or_equal:departments.*.effective_from',
            ],
        ]);

        $assignments =
            $validated['departments'];

        /*
         * If departments exist, exactly one ACTIVE
         * assignment must be primary.
         */
        if (count($assignments) > 0) {
            $activeAssignments =
                collect($assignments)
                    ->where(
                        'is_active',
                        true
                    );

            $primaryCount =
                $activeAssignments
                    ->where(
                        'is_primary',
                        true
                    )
                    ->count();

            if (
                $activeAssignments->isNotEmpty()
                && $primaryCount !== 1
            ) {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'Exactly one active department must be marked as primary.',
                ], 422);
            }

            /*
             * An inactive assignment should never
             * remain the primary department.
             */
            $invalidPrimary =
                collect($assignments)
                    ->contains(
                        fn ($item) =>
                            $item['is_primary']
                            && !$item['is_active']
                    );

            if ($invalidPrimary) {
                return response()->json([
                    'success' => false,
                    'message' =>
                        'An inactive department cannot be the primary department.',
                ], 422);
            }
        }

        DB::transaction(
            function () use (
                $user,
                $assignments,
                $request
            ) {
                $syncData = [];

                foreach (
                    $assignments
                    as $assignment
                ) {
                    $syncData[
                        $assignment[
                            'department_id'
                        ]
                    ] = [
                        'is_primary' =>
                            $assignment[
                                'is_primary'
                            ],

                        'is_active' =>
                            $assignment[
                                'is_active'
                            ],

                        'effective_from' =>
                            $assignment[
                                'effective_from'
                            ] ?? null,

                        'effective_to' =>
                            $assignment[
                                'effective_to'
                            ] ?? null,

                        'created_by' =>
                            $request->user()->id,
                    ];
                }

                $user
                    ->departments()
                    ->sync($syncData);
            }
        );

        return response()->json([
            'success' => true,
            'message' =>
                'User department assignments updated successfully.',

            'data' =>
                $user
                    ->departments()
                    ->orderBy(
                        'department_name'
                    )
                    ->get(),
        ]);
    }

    public function store(
    Request $request,
    User $user
): JsonResponse {
    $validated = $request->validate([
        'departments' => [
            'required',
            'array',
        ],

        'departments.*.department_id' => [
            'required',
            'integer',
            'exists:departments,id',
            'distinct',
        ],

        'departments.*.is_primary' => [
            'required',
            'boolean',
        ],

        'departments.*.is_active' => [
            'required',
            'boolean',
        ],

        'departments.*.effective_from' => [
            'nullable',
            'date',
        ],

        'departments.*.effective_to' => [
            'nullable',
            'date',
            'after_or_equal:departments.*.effective_from',
        ],
    ]);

    /*
     * Only one department may be primary.
     */
    $primaryCount = collect(
        $validated['departments']
    )
        ->where(
            'is_primary',
            true
        )
        ->count();

    if ($primaryCount > 1) {
        return response()->json([
            'message' =>
                'Only one department can be set as the primary department.',
        ], 422);
    }

    DB::transaction(
        function () use (
            $user,
            $validated
        ) {
            $syncData = [];

            foreach (
                $validated['departments']
                as $department
            ) {
                $syncData[
                    $department[
                        'department_id'
                    ]
                ] = [
                    'is_primary' =>
                        $department[
                            'is_primary'
                        ],

                    'is_active' =>
                        $department[
                            'is_active'
                        ],

                    'effective_from' =>
                        $department[
                            'effective_from'
                        ] ?? null,

                    'effective_to' =>
                        $department[
                            'effective_to'
                        ] ?? null,
                ];
            }

            /*
             * Synchronize instead of inserting duplicates.
             *
             * Existing departments are updated,
             * removed departments are detached,
             * new departments are attached.
             */
            $user
                ->departments()
                ->sync(
                    $syncData
                );
        }
    );

    $departments =
        $user
            ->departments()
            ->orderByPivot(
                'is_primary',
                'desc'
            )
            ->orderBy(
                'department_name'
            )
            ->get();

    return response()->json([
        'success' => true,

        'message' =>
            'User department assignments updated successfully.',

        'data' =>
            $departments,
    ]);
}
}