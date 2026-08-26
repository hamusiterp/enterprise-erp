<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_instances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_definition_id')
                ->constrained('workflow_definitions')
                ->restrictOnDelete();

            /*
             * Root business record.
             *
             * Example:
             * subject_type = store_requisition
             * subject_id   = 125
             */
            $table->string('subject_type', 100);
            $table->unsignedBigInteger('subject_id');

            /*
             * Human-readable root reference.
             *
             * Example:
             * SR/2026-27/000125
             */
            $table->string('reference_no', 100)
                ->nullable();

            $table->foreignId('current_state_id')
                ->nullable()
                ->constrained('workflow_states')
                ->restrictOnDelete();

            /*
             * running
             * completed
             * cancelled
             * rejected
             */
            $table->string('status', 30)
                ->default('running');

            $table->foreignId('started_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();

            $table->timestamps();

            $table->unique(
                [
                    'workflow_definition_id',
                    'subject_type',
                    'subject_id',
                ],
                'workflow_instance_subject_unique'
            );

            $table->index([
                'subject_type',
                'subject_id',
            ]);

            $table->index('reference_no');
            $table->index('status');
            $table->index('current_state_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_instances');
    }
};