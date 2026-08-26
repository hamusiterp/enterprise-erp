<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_task_history', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_instance_id')
                ->constrained('workflow_instances')
                ->cascadeOnDelete();

            $table->foreignId('workflow_task_id')
                ->nullable()
                ->constrained('workflow_tasks')
                ->nullOnDelete();

            $table->foreignId('from_state_id')
                ->nullable()
                ->constrained('workflow_states')
                ->restrictOnDelete();

            $table->foreignId('to_state_id')
                ->nullable()
                ->constrained('workflow_states')
                ->restrictOnDelete();

            /*
             * Examples:
             *
             * created
             * submitted
             * approved
             * received
             * stock_checked
             * returned
             * rejected
             * completed
             */
            $table->string('action', 100);

            $table->foreignId('performed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('performed_at');

            $table->text('remarks')
                ->nullable();

            /*
             * Extra contextual information.
             *
             * Example:
             * {
             *   "requested_qty": 10,
             *   "available_qty": 4,
             *   "shortage_qty": 6
             * }
             */
            $table->jsonb('metadata')
                ->nullable();

            $table->timestamps();

            $table->index([
                'workflow_instance_id',
                'performed_at',
            ]);

            $table->index('action');
            $table->index('performed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_task_history');
    }
};