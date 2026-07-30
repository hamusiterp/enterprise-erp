<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CodeGeneratorService
{
    /**
     * Generate the next sequential code.
     *
     * Examples:
     * DES001
     * DEP001
     * CUS001
     */
    public function generate(
        string $table,
        string $column,
        string $prefix,
        int $padding = 3
    ): string {
        $this->validateIdentifier($table);
        $this->validateIdentifier($column);

        if (!preg_match('/^[A-Z0-9]+$/', $prefix)) {
            throw new InvalidArgumentException(
                'The code prefix may contain only uppercase letters and numbers.'
            );
        }

        /*
         * PostgreSQL table lock prevents two users from receiving
         * the same code during simultaneous requests.
         *
         * This method must be called inside DB::transaction().
         */
        DB::statement(
            "LOCK TABLE {$table} IN SHARE ROW EXCLUSIVE MODE"
        );

        $prefixLength = strlen($prefix) + 1;

        $result = DB::table($table)
            ->selectRaw(
                "
                COALESCE(
                    MAX(
                        CASE
                            WHEN {$column} ~ ?
                            THEN CAST(
                                SUBSTRING({$column} FROM {$prefixLength})
                                AS INTEGER
                            )
                            ELSE 0
                        END
                    ),
                    0
                ) + 1 AS next_number
                ",
                ['^' . $prefix . '[0-9]+$']
            )
            ->first();

        $nextNumber = (int) ($result->next_number ?? 1);

        return $prefix . str_pad(
            (string) $nextNumber,
            $padding,
            '0',
            STR_PAD_LEFT
        );
    }

    private function validateIdentifier(string $identifier): void
    {
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $identifier)) {
            throw new InvalidArgumentException(
                'Invalid database identifier.'
            );
        }
    }
}