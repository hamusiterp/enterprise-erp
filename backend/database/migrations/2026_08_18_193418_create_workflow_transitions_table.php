<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_transitions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_definition_id')
                ->constrained('workflow_definitions')
                ->cascadeOnDelete();

            $table->foreignId('from_state_id')
                ->constrained(
                    'workflow_states'
                )
                ->cascadeOnDelete();

            $table->foreignId('to_state_id')
                ->constrained(
                    'workflow_states'
                )
                ->cascadeOnDelete();

            /*
             * Machine action:
             *
             * submit
             * approve
             * reject
             * return
             * resubmit
             * review
             * issue
             * close
             */
            $table->string('action', 100);

            /*
             * Button/display label.
             *
             * Submit
             * Approve
             * Return to Requester
             */
            $table->string('name', 150);

            /*
             * Spatie permission required
             * to execute this transition.
             *
             * Example:
             * store-requisitions.approve
             */
            $table->string('permission_name', 150)
                ->nullable();

            /*
             * Important for your requirement:
             *
             * return = true means this transition
             * sends the process backwards.
             */
            $table->boolean('is_return')
                ->default(false);

            /*
             * Some actions must require explanation.
             *
             * Return  -> normally true
             * Reject  -> normally true
             * Approve -> configurable
             */
            $table->boolean('requires_remarks')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            $table->unsignedInteger('sequence')
                ->default(1);

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index([
                'workflow_definition_id',
                'from_state_id',
            ]);

            $table->index([
                'workflow_definition_id',
                'to_state_id',
            ]);

            $table->index('action');
            $table->index('permission_name');
            $table->index('is_return');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_transitions');
    }
};