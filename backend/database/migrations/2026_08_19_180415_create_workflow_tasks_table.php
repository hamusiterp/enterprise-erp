<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_instance_id')
                ->constrained('workflow_instances')
                ->cascadeOnDelete();

            $table->foreignId('workflow_state_id')
                ->constrained('workflow_states')
                ->restrictOnDelete();

            /*
             * Who owns the task?
             *
             * department
             * role
             * user
             * permission
             */
            $table->string('assignment_type', 30)
                ->nullable();

            /*
             * Used for department/role/user IDs.
             */
            $table->unsignedBigInteger('assigned_to_id')
                ->nullable();

            /*
             * Used for keys such as:
             * store-requisitions.stock-check
             */
            $table->string('assigned_to_key', 150)
                ->nullable();

            /*
             * pending
             * in_progress
             * completed
             * returned
             * rejected
             * cancelled
             */
            $table->string('status', 30)
                ->default('pending');

            $table->foreignId('received_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('completed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
             * Time task entered the user's/unit's queue.
             */
            $table->timestamp('received_at')
                ->nullable();

            /*
             * When someone actually starts processing it.
             */
            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();

            /*
             * Useful later for SLA/overdue monitoring.
             */
            $table->timestamp('due_at')
                ->nullable();

            $table->text('remarks')
                ->nullable();

            $table->timestamps();

            $table->index([
                'workflow_instance_id',
                'status',
            ]);

            $table->index([
                'assignment_type',
                'assigned_to_id',
            ]);

            $table->index('assigned_to_key');
            $table->index('workflow_state_id');
            $table->index('due_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_tasks');
    }
};