<?php

namespace App\Services;

use App\Models\User;
use App\Models\WorkflowTask;
use Illuminate\Auth\Access\AuthorizationException;

class WorkflowTaskOwnershipService
{
    public function userCanHandle(
        User $user,
        WorkflowTask $task
    ): bool {
        return match ($task->assignment_type) {

            'user' =>
                $task->assigned_to_id === $user->id,

            'role' =>
                $task->assigned_to_id !== null
                && $user->roles()
                    ->where(
                        'roles.id',
                        $task->assigned_to_id
                    )
                    ->exists(),

            'permission' =>
                $task->assigned_to_key !== null
                && $user->can(
                    $task->assigned_to_key
                ),

            'department' =>
                $task->assigned_to_id !== null
                && $this->userBelongsToDepartment(
                    $user,
                    $task->assigned_to_id
                ),

            default => false,
        };
    }

    public function authorize(
        User $user,
        WorkflowTask $task
    ): void {
        if (!$this->userCanHandle(
            $user,
            $task
        )) {
            throw new AuthorizationException(
                'You are not assigned to this workflow task.'
            );
        }
    }

    private function userBelongsToDepartment(
        User $user,
        int $departmentId
    ): bool {
        $today = now()->toDateString();

        return $user->departments()
            ->where(
                'departments.id',
                $departmentId
            )
            ->wherePivot(
                'is_active',
                true
            )
            ->where(function ($query) use ($today) {
                $query
                    ->whereNull(
                        'user_departments.effective_from'
                    )
                    ->orWhere(
                        'user_departments.effective_from',
                        '<=',
                        $today
                    );
            })
            ->where(function ($query) use ($today) {
                $query
                    ->whereNull(
                        'user_departments.effective_to'
                    )
                    ->orWhere(
                        'user_departments.effective_to',
                        '>=',
                        $today
                    );
            })
            ->exists();
    }
}