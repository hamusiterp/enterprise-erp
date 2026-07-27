<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Remove the normal unique constraints.
         * These constraints include soft-deleted records.
         */
        DB::statement(
            'ALTER TABLE departments
             DROP CONSTRAINT IF EXISTS departments_department_name_unique'
        );

        DB::statement(
            'ALTER TABLE departments
             DROP CONSTRAINT IF EXISTS departments_department_id_unique'
        );

        /*
         * Remove indexes if they already exist.
         */
        DB::statement(
            'DROP INDEX IF EXISTS departments_department_name_active_unique'
        );

        DB::statement(
            'DROP INDEX IF EXISTS departments_department_id_active_unique'
        );

        /*
         * Enforce uniqueness only for records that are not deleted.
         */
        DB::statement(
            'CREATE UNIQUE INDEX departments_department_name_active_unique
             ON departments (LOWER(department_name))
             WHERE deleted_at IS NULL'
        );

        DB::statement(
            'CREATE UNIQUE INDEX departments_department_id_active_unique
             ON departments (department_id)
             WHERE deleted_at IS NULL'
        );
    }

    public function down(): void
    {
        DB::statement(
            'DROP INDEX IF EXISTS departments_department_name_active_unique'
        );

        DB::statement(
            'DROP INDEX IF EXISTS departments_department_id_active_unique'
        );

        DB::statement(
            'ALTER TABLE departments
             ADD CONSTRAINT departments_department_name_unique
             UNIQUE (department_name)'
        );

        DB::statement(
            'ALTER TABLE departments
             ADD CONSTRAINT departments_department_id_unique
             UNIQUE (department_id)'
        );
    }
};