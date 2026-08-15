<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class AutoNumberService
{
    /**
     * Generate the next number safely inside a database transaction.
     *
     * Example:
     *
     * AutoNumberService::generate(
     *     modelClass: SalesPurchaser::class,
     *     column: 'purchaser_no',
     *     prefix: 'PUR',
     *     padding: 6
     * );
     *
     * Result:
     * PUR000001
     */
    public static function generate(
        string $modelClass,
        string $column,
        string $prefix,
        int $padding = 6
    ): string {
        self::validateArguments(
            $modelClass,
            $column,
            $prefix,
            $padding
        );

        /** @var Model $model */
        $model = new $modelClass();

        $connection = DB::connection(
            $model->getConnectionName()
        );

        /*
         * The transaction lock is effective only when this
         * method runs inside DB::transaction().
         */
        if ($connection->transactionLevel() < 1) {
            throw new RuntimeException(
                'AutoNumberService::generate() must be called inside a database transaction.'
            );
        }

        /*
         * Each table/column/prefix combination receives
         * its own PostgreSQL advisory transaction lock.
         */
        $lockKey = self::makeLockKey(
            $model->getTable(),
            $column,
            $prefix
        );

        $connection->select(
            'SELECT pg_advisory_xact_lock(?)',
            [$lockKey]
        );

        return self::buildNextNumber(
            modelClass: $modelClass,
            column: $column,
            prefix: $prefix,
            padding: $padding
        );
    }

    /**
     * Return the next expected number for display in a form.
     *
     * This preview is not reserved. The real number must be
     * generated again inside the store transaction.
     */
    public static function preview(
        string $modelClass,
        string $column,
        string $prefix,
        int $padding = 6
    ): string {
        self::validateArguments(
            $modelClass,
            $column,
            $prefix,
            $padding
        );

        return self::buildNextNumber(
            modelClass: $modelClass,
            column: $column,
            prefix: $prefix,
            padding: $padding
        );
    }

    /**
     * Read the maximum numeric suffix and build the next number.
     */
    private static function buildNextNumber(
        string $modelClass,
        string $column,
        string $prefix,
        int $padding
    ): string {
        /** @var Model $model */
        $model = new $modelClass();

        $query = $modelClass::query();

        /*
         * Include soft-deleted records so their numbers
         * are never reused.
         */
        if (
            in_array(
                SoftDeletes::class,
                class_uses_recursive($modelClass),
                true
            )
        ) {
            $query->withTrashed();
        }

        $suffixStart = strlen($prefix) + 1;

        /*
         * Identifiers cannot be parameter-bound, so the
         * column is validated before being used here.
         */
        $quotedColumn = '"' . $column . '"';

        $maxNumber = $query
            ->where(
                $column,
                'like',
                $prefix . '%'
            )
            ->whereRaw(
                "SUBSTRING({$quotedColumn} FROM ?) ~ '^[0-9]+$'",
                [$suffixStart]
            )
            ->selectRaw(
                "
                MAX(
                    CAST(
                        SUBSTRING({$quotedColumn} FROM ?)
                        AS BIGINT
                    )
                ) AS max_number
                ",
                [$suffixStart]
            )
            ->value('max_number');

        $nextNumber = max(
            ((int) $maxNumber) + 1,
            1
        );

        return $prefix . str_pad(
            (string) $nextNumber,
            $padding,
            '0',
            STR_PAD_LEFT
        );
    }

    /**
     * Create a stable PostgreSQL advisory-lock key.
     */
    private static function makeLockKey(
        string $table,
        string $column,
        string $prefix
    ): string {
        return sprintf(
            '%u',
            crc32(
                implode(':', [
                    'auto-number',
                    $table,
                    $column,
                    $prefix,
                ])
            )
        );
    }

    /**
     * Validate model and identifier arguments.
     */
    private static function validateArguments(
        string $modelClass,
        string $column,
        string $prefix,
        int $padding
    ): void {
        if (
            ! class_exists($modelClass)
            || ! is_subclass_of(
                $modelClass,
                Model::class
            )
        ) {
            throw new InvalidArgumentException(
                'The supplied model class must be an Eloquent model.'
            );
        }

        if (
            ! preg_match(
                '/^[A-Za-z_][A-Za-z0-9_]*$/',
                $column
            )
        ) {
            throw new InvalidArgumentException(
                'The auto-number column name is invalid.'
            );
        }

        if (
            $prefix === ''
            || ! preg_match(
                '/^[A-Za-z0-9_-]+$/',
                $prefix
            )
        ) {
            throw new InvalidArgumentException(
                'The auto-number prefix is invalid.'
            );
        }

        if (
            $padding < 1
            || $padding > 20
        ) {
            throw new InvalidArgumentException(
                'The auto-number padding must be between 1 and 20.'
            );
        }
    }
}