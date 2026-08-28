<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_price_requests', function (Blueprint $table) {
            $table->id();

            $table->string('request_no', 100)->unique();
            $table->date('request_date');

            // Where the request came from
            $table->string('source_type', 50);
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('source_reference', 150)->nullable();

            // Optional workflow linkage
            $table->foreignId('workflow_instance_id')
                ->nullable()
                ->constrained('workflow_instances')
                ->nullOnDelete();

            $table->foreignId('workflow_task_id')
                ->nullable()
                ->constrained('workflow_tasks')
                ->nullOnDelete();

            // Main request status
            $table->string('status', 30)->default('pending');

            $table->text('remarks')->nullable();

            $table->foreignId('requested_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('requested_at')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index('source_type');
            $table->index('source_id');
            $table->index('source_reference');
            $table->index('status');
            $table->index('request_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_price_requests');
    }
};