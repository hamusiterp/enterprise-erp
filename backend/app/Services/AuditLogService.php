<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService
{
    public static function log(
        ?int $userId,
        string $module,
        string $action,
        ?int $recordId,
        ?string $recordName,
        array|null $oldValues = null,
        array|null $newValues = null
    ): void {

        AuditLog::create([
            'user_id'      => $userId,
            'module'       => $module,
            'action'       => $action,
            'record_id'    => $recordId,
            'record_name'  => $recordName,
            'old_values'   => $oldValues,
            'new_values'   => $newValues,
            'ip_address'   => request()->ip(),
            'user_agent'   => request()->userAgent(),
        ]);
    }
}