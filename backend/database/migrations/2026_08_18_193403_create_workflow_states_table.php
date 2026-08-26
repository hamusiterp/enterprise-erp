<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_states', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workflow_definition_id')
                ->constrained('workflow_definitions')
                ->cascadeOnDelete();

            /*
             * Machine-readable state.
             *
             * draft
             * submitted
             * approved
             * store_review
             * partially_issued
             * fully_issued
             * closed
             */
            $table->string('code', 100);

            /*
             * User-facing label.
             */
            $table->string('name', 150);

            $table->unsignedInteger('sequence')
                ->default(1);

            /*
             * Initial state:
             * new transactions start here.
             */
            $table->boolean('is_initial')
                ->default(false);

            /*
             * Final state:
             * no normal processing after this state.
             */
            $table->boolean('is_final')
                ->default(false);

            /*
             * Allows records in this state to be edited.
             * Example: Draft = true.
             */
            $table->boolean('is_editable')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            $table->string('color', 30)
                ->nullable();

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->unique(
                [
                    'workflow_definition_id',
                    'code',
                ],
                'workflow_state_code_unique'
            );

            $table->index([
                'workflow_definition_id',
                'sequence',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_states');
    }
};