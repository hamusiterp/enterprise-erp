<?php

namespace App\Services;

use App\Models\AccessPolicy;
use App\Models\AccessPolicyAssignment;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class AccessPolicyService
{
    public function isAllowed(
        User $user,
        ?string $module = null,
        ?string $permission = null,
        CarbonInterface|string|null $at = null
    ): bool {
        $at = $at instanceof CarbonInterface
            ? Carbon::instance($at)
            : ($at ? Carbon::parse($at) : now());

        $assignments = AccessPolicyAssignment::query()
            ->with([
                'accessPolicy.schedules' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('day_of_week');
                },
            ])
            ->where('is_active', true)
            ->where(function ($query) use ($at) {
                $query
                    ->whereNull('effective_from')
                    ->orWhere('effective_from', '<=', $at);
            })
            ->where(function ($query) use ($at) {
                $query
                    ->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', $at);
            })
            ->get()
            ->filter(
                fn (AccessPolicyAssignment $assignment) =>
                    $this->assignmentMatches(
                        $assignment,
                        $user,
                        $module,
                        $permission
                    )
            )
            ->filter(
                fn (AccessPolicyAssignment $assignment) =>
                    $assignment->accessPolicy
                    && $assignment->accessPolicy->is_active
            )
            ->sortBy(
                fn (AccessPolicyAssignment $assignment) =>
                    $assignment->accessPolicy->priority
            );

        /*
         * No policy applies:
         * normal Laravel/Spatie permissions continue to control access.
         */
        if ($assignments->isEmpty()) {
            return true;
        }

        foreach ($assignments as $assignment) {
            $policy = $assignment->accessPolicy;

            $insideSchedule = $this->isInsideSchedule(
                $policy,
                $at
            );

            /*
             * ALLOW policy:
             * user must be inside the configured schedule.
             */
            if (
                $policy->policy_type === 'allow'
                && !$insideSchedule
            ) {
                return false;
            }

            /*
             * DENY policy:
             * user is blocked while inside the configured schedule.
             */
            if (
                $policy->policy_type === 'deny'
                && $insideSchedule
            ) {
                return false;
            }
        }

        return true;
    }

    private function assignmentMatches(
        AccessPolicyAssignment $assignment,
        User $user,
        ?string $module,
        ?string $permission
    ): bool {
        return match ($assignment->target_type) {
            'system' =>
                $assignment->target_key === null
                || $assignment->target_key === 'system',

            'module' =>
                $module !== null
                && $assignment->target_key === $module,

            'permission' =>
                $permission !== null
                && $assignment->target_key === $permission,

            'user' =>
                $assignment->target_id === $user->id,

            'role' =>
                $assignment->target_id !== null
                && $user->roles()
                    ->where(
                        'roles.id',
                        $assignment->target_id
                    )
                    ->exists(),

            default => false,
        };
    }

    private function isInsideSchedule(
        AccessPolicy $policy,
        CarbonInterface $at
    ): bool {
        /*
         * Carbon ISO weekday:
         * Monday = 1
         * ...
         * Sunday = 7
         */
        $dayOfWeek = $at->dayOfWeekIso;

        $schedule = $policy->schedules
            ->firstWhere(
                'day_of_week',
                $dayOfWeek
            );

        /*
         * No schedule for this day means the policy
         * does not grant/deny a time window on this day.
         */
        if (!$schedule) {
            return false;
        }

        if (!$schedule->is_allowed_day) {
            return false;
        }

        if (
            !$schedule->start_time
            || !$schedule->end_time
        ) {
            return true;
        }

        $currentTime = $at->format('H:i:s');

        /*
         * Normal range:
         * 07:30 → 18:30
         */
        if (
            $schedule->start_time
            <= $schedule->end_time
        ) {
            return $currentTime >= $schedule->start_time
                && $currentTime <= $schedule->end_time;
        }

        /*
         * Overnight range:
         * 22:00 → 06:00
         */
        return $currentTime >= $schedule->start_time
            || $currentTime <= $schedule->end_time;
    }
}