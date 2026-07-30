<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Designation;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Services\AuditLogService;

class DesignationService
{
    public function create(
        array $data,
        int $registeredBy
    ): Designation {
        return DB::transaction(
            function () use (
                $data,
                $registeredBy
            ): Designation {
                $Designation = Designation::create([
                    'Designation_id' =>
                        $this->generateDesignationId(),

                    'Designation_name' =>
                        $data['Designation_name'],

                    'description' =>
                        $data['description'] ?? null,

                    'status' =>
                        $data['status'] ?? 'active',

                    'registered_by' =>
                        $registeredBy,
                ]);

                AuditLogService::log(
                $registeredBy,
                'Designations',
                'Create',
                $Designation->id,
                $Designation->Designation_name,
                null,
                $Designation->toArray()
            );

                return $Designation;
            },
            3
        );
    }

    public function update(
        Designation $Designation,
        array $data
    ): Designation {
        return DB::transaction(
            function () use (
                $Designation,
                $data
            ): Designation {
                $old = $Designation->toArray();
                $Designation->update([
                    'Designation_name' =>
                        $data['Designation_name'],

                    'description' =>
                        $data['description'] ?? null,

                    'status' =>
                        $data['status'],
                ]);

                AuditLogService::log(
                auth()->id(),
                'Designations',
                'Update',
                $Designation->id,
                $Designation->Designation_name,
                $old,
                $Designation->fresh()->toArray()
            );

                return $Designation->refresh();
            }
        );
    }

    public function changeStatus(
        Designation $Designation,
        string $status
    ): Designation {
        $old = $Designation->toArray();
        $Designation->update([
            'status' => $status,
        ]);

        AuditLogService::log(
        auth()->id(),
        'Designations',
        'Status Change',
        $Designation->id,
        $Designation->Designation_name,
        $old,
        $Designation->fresh()->toArray()
    );

        return $Designation->refresh();
    }

    private function generateDesignationId(): string
    {
        $lastDesignation = Designation::withTrashed()
            ->lockForUpdate()
            ->orderByDesc('id')
            ->first();

        if (!$lastDesignation) {
            return 'DEP001';
        }

        $lastNumber = (int) preg_replace(
            '/[^0-9]/',
            '',
            $lastDesignation->Designation_id
        );

        $nextNumber = $lastNumber + 1;

        if ($nextNumber > 99999999999999999) {
            throw new RuntimeException(
                'Designation number limit has been reached.'
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