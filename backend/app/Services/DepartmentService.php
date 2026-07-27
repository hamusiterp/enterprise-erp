<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Department;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Services\AuditLogService;

class DepartmentService
{
    public function create(
        array $data,
        int $registeredBy
    ): Department {
        return DB::transaction(
            function () use (
                $data,
                $registeredBy
            ): Department {
                $department = Department::create([
                    'department_id' =>
                        $this->generateDepartmentId(),

                    'department_name' =>
                        $data['department_name'],

                    'description' =>
                        $data['description'] ?? null,

                    'status' =>
                        $data['status'] ?? 'active',

                    'registered_by' =>
                        $registeredBy,
                ]);

                AuditLogService::log(
                $registeredBy,
                'Departments',
                'Create',
                $department->id,
                $department->department_name,
                null,
                $department->toArray()
            );

                return $department;
            },
            3
        );
    }

    public function update(
        Department $department,
        array $data
    ): Department {
        return DB::transaction(
            function () use (
                $department,
                $data
            ): Department {
                $old = $department->toArray();
                $department->update([
                    'department_name' =>
                        $data['department_name'],

                    'description' =>
                        $data['description'] ?? null,

                    'status' =>
                        $data['status'],
                ]);

                AuditLogService::log(
                auth()->id(),
                'Departments',
                'Update',
                $department->id,
                $department->department_name,
                $old,
                $department->fresh()->toArray()
            );

                return $department->refresh();
            }
        );
    }

    public function changeStatus(
        Department $department,
        string $status
    ): Department {
        $old = $department->toArray();
        $department->update([
            'status' => $status,
        ]);

        AuditLogService::log(
        auth()->id(),
        'Departments',
        'Status Change',
        $department->id,
        $department->department_name,
        $old,
        $department->fresh()->toArray()
    );

        return $department->refresh();
    }

    private function generateDepartmentId(): string
    {
        $lastDepartment = Department::withTrashed()
            ->lockForUpdate()
            ->orderByDesc('id')
            ->first();

        if (!$lastDepartment) {
            return 'DEP001';
        }

        $lastNumber = (int) preg_replace(
            '/[^0-9]/',
            '',
            $lastDepartment->department_id
        );

        $nextNumber = $lastNumber + 1;

        if ($nextNumber > 99999999999999999) {
            throw new RuntimeException(
                'Department number limit has been reached.'
            );
        }

        return 'DEP' . str_pad(
            (string) $nextNumber,
            3,
            '0',
            STR_PAD_LEFT
        );
    }
}