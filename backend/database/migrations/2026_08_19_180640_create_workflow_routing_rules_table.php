<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_routing_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_definition_id')
                ->constrained('workflow_definitions')
                ->cascadeOnDelete();

            /*
             * Usually the stage/task that receives the work.
             */
            $table->foreignId('workflow_state_id')
                ->constrained('workflow_states')
                ->cascadeOnDelete();

            /*
             * Optional specific transition that creates this task.
             *
             * Example:
             * Submitted -> Approve SR
             */
            $table->foreignId('workflow_transition_id')
                ->nullable()
                ->constrained('workflow_transitions')
                ->cascadeOnDelete();

            /*
             * department
             * role
             * user
             * permission
             */
            $table->string('assignment_type', 30);

            /*
             * department / role / user ID
             */
            $table->unsignedBigInteger('assigned_to_id')
                ->nullable();

            /*
             * Permission key:
             * store-requisitions.approve
             */
            $table->string('assigned_to_key', 150)
                ->nullable();

            /*
             * first_available
             * all
             * manual
             */
            $table->string('assignment_mode', 30)
                ->default('all');

            /*
             * Optional SLA duration.
             */
            $table->unsignedInteger('sla_minutes')
                ->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->unsignedInteger('priority')
                ->default(100);

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

            $table->index([
                'workflow_definition_id',
                'workflow_state_id',
            ]);

            $table->index('workflow_transition_id');

            $table->index([
                'assignment_type',
                'assigned_to_id',
            ]);

            $table->index('assigned_to_key');
            $table->index('priority');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_routing_rules');
    }
};