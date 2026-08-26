<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_departments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('department_id')
                ->constrained('departments')
                ->cascadeOnDelete();

            /*
             * A user may belong to more than one department,
             * but one can be marked as the primary department.
             */
            $table->boolean('is_primary')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            /*
             * Useful when a user is temporarily transferred
             * or assigned to another department.
             */
            $table->date('effective_from')
                ->nullable();

            $table->date('effective_to')
                ->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->unique(
                ['user_id', 'department_id'],
                'user_department_unique'
            );

            $table->index([
                'department_id',
                'is_active',
            ]);

            $table->index([
                'user_id',
                'is_primary',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_departments');
    }
};