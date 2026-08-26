<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->id();

            /*
             * Generated from Document Numbering.
             */
            $table->string('pr_no', 100)->unique();

            $table->date('pr_date');

            /*
             * Source Store Requisition.
             */
            $table->foreignId('store_requisition_id')
                ->constrained('store_requisitions')
                ->restrictOnDelete();

            /*
             * Keep workflow traceability.
             */
            $table->foreignId('workflow_instance_id')
                ->nullable()
                ->constrained('workflow_instances')
                ->nullOnDelete();

            $table->string('used_for', 30);

            $table->foreignId('project_id')
                ->nullable()
                ->constrained('sales_project')
                ->nullOnDelete();

            $table->foreignId('used_for_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->foreignId('from_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->string('to_location')->nullable();

            $table->text('remarks')->nullable();

            /*
             * draft
             * submitted
             * approved
             * returned
             * cancelled
             */
            $table->string('status', 30)
                ->default('draft');

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index('pr_date');
            $table->index('status');
            $table->index('used_for');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_requisitions');
    }
};