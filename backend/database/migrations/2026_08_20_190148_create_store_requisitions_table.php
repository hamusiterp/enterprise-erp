<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_requisitions', function (Blueprint $table) {
            $table->id();

            /*
             * Assigned when the request is posted.
             *
             * All SR variants share this sequence.
             */
            $table->string('sr_no', 100)
                ->nullable()
                ->unique();

            /*
             * General SR
             * Fixed Asset SR
             * Internal Inventory SR
             */
            $table->string('request_type', 50)
                ->default('general');

            /*
             * Determines whether MR fields are required
             * on ALL requisition item lines.
             */
            $table->boolean('mr_requested')
                ->default(false);

            /*
             * Project or Department.
             *
             * Mainly used by the Project/Department SR form.
             */
            $table->string('used_for', 30)
                ->nullable();

            $table->foreignId('project_id')
                ->nullable()
                ->constrained('sales_project')
                ->nullOnDelete();

            /*
             * When Used For = Department.
             */
            $table->foreignId('used_for_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            /*
             * Department originating the SR.
             */
            $table->foreignId('from_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            /*
             * Main Store for the current process.
             *
             * Keep as text until/if a Store master
             * is introduced.
             */
            $table->string('to_location', 150)
                ->default('Main Store');

            /*
             * goods
             * fuel_oil
             */
            $table->string('voucher_sr_type', 30)
                ->nullable();

            /*
             * Required only when voucher_sr_type = fuel_oil
             *
             * purchased
             * stock
             */
            $table->string('fuel_oil_source', 30)
                ->nullable();

            /*
             * Current business status.
             *
             * draft
             * posted
             * submitted
             * completed
             * cancelled
             *
             * Detailed current stage comes from
             * workflow_instances.current_state_id.
             */
            $table->string('status', 30)
                ->default('draft');

            /*
             * Link to the workflow instance after
             * the SR workflow starts.
             */
            $table->foreignId('workflow_instance_id')
                ->nullable()
                ->constrained('workflow_instances')
                ->nullOnDelete();

            /*
             * Fiscal year owning this SR number.
             */
            $table->foreignId('fiscal_year_id')
                ->nullable()
                ->constrained('fiscal_years')
                ->restrictOnDelete();

            $table->foreignId('requested_by')
                ->constrained('users')
                ->restrictOnDelete();

            /*
             * The requester's department at the time
             * the SR is created.
             */
            $table->foreignId('requested_department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->timestamp('sr_date')
                ->nullable();

            $table->timestamp('posted_at')
                ->nullable();

            $table->foreignId('posted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index('request_type');
            $table->index('mr_requested');
            $table->index('used_for');
            $table->index('voucher_sr_type');
            $table->index('status');
            $table->index('sr_date');

            $table->index([
                'requested_department_id',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_requisitions');
    }
};