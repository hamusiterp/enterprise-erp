<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->id();

            /*
             * Examples:
             * STORE_REQUISITION
             * PURCHASE_REQUISITION
             * PURCHASE_ORDER
             */
            $table->string('code', 100)->unique();

            $table->string('name', 150);

            /*
             * Module owning this workflow.
             *
             * Examples:
             * store
             * procurement
             * finance
             */
            $table->string('module_key', 100);

            $table->text('description')->nullable();

            /*
             * Only one version will normally be active.
             * Versioning lets us change future workflows
             * without destroying historical definitions.
             */
            $table->unsignedInteger('version')
                ->default(1);

            $table->boolean('is_active')
                ->default(true);

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('module_key');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_definitions');
    }
};