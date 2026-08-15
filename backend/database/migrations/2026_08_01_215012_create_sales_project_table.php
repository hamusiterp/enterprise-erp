<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_project', function (Blueprint $table): void {
            $table->id();

            /*
             * Generated automatically:
             * PRJ1001, PRJ1002, PRJ1003...
             */
            $table
                ->string('project_no', 20)
                ->unique();

            /*
             * Bid or Work Order
             */
            $table
                ->string('project_source', 30)
                ->index();

            /*
             * Bid ID is stored as a string for compatibility
             * with the legacy bid_reference field.
             */
            $table
                ->string('bid_reference', 30)
                ->nullable()
                ->index();

            $table
                ->string('work_order_no', 30)
                ->nullable()
                ->index();

            $table->text('project_name');

            /*
             * Preserved from the legacy structure.
             * We will define its exact business purpose later.
             */
            $table
                ->text('project_name_letter')
                ->nullable();

            $table->text('project_description');

            $table->text('location');

            /*
             * References sales_customer.id.
             *
             * We intentionally do not add a database foreign key yet,
             * because sales_customer is a legacy table that may not
             * have a PostgreSQL-compatible bigint primary key.
             */
            $table
                ->unsignedBigInteger('customer_id')
                ->nullable()
                ->index();

            /*
             * Customer display name copied at registration time.
             * This preserves the employer name even if the customer
             * record is changed later.
             */
            $table->text('employer');

            /*
             * Consultant selection and conditional name.
             */
            $table
                ->boolean('has_consultant')
                ->default(false);

            $table
                ->text('consultant')
                ->nullable();

            /*
             * Specified-area selection and conditional area.
             */
            $table
                ->boolean('has_specified_area')
                ->default(false);

            $table
                ->string('area', 100)
                ->nullable();

            $table
                ->string('construction_project_type', 30)
                ->index();

            /*
             * Active/inactive project status.
             */
            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            /*
             * Legacy-compatible username field.
             */
            $table
                ->string('registered_by', 100)
                ->nullable();

            /*
             * Link to the authenticated Laravel user.
             */
            $table
                ->foreignId('registered_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table
                ->date('date_registered')
                ->nullable()
                ->index();

            $table->timestamps();
            $table->softDeletes();

            $table->index([
                'project_source',
                'status',
            ]);

            $table->index([
                'construction_project_type',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_project');
    }
};