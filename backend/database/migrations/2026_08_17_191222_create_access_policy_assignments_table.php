<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_policy_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('access_policy_id')
                ->constrained('access_policies')
                ->cascadeOnDelete();

            /*
             * Assignment target:
             *
             * system
             * module
             * permission
             * role
             * user
             */
            $table->string('target_type', 30);

            /*
             * Examples:
             *
             * system:
             * target_key = "system"
             *
             * module:
             * target_key = "store"
             *
             * permission:
             * target_key = "store-requisitions.issue"
             *
             * role:
             * target_id = roles.id
             *
             * user:
             * target_id = users.id
             */
            $table->string('target_key', 150)
                ->nullable();

            $table->unsignedBigInteger('target_id')
                ->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->dateTime('effective_from')
                ->nullable();

            $table->dateTime('effective_to')
                ->nullable();

            $table->text('remarks')
                ->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('access_policy_id');
            $table->index('target_type');
            $table->index('target_key');
            $table->index('target_id');
            $table->index('is_active');
            $table->index('effective_from');
            $table->index('effective_to');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_policy_assignments');
    }
};