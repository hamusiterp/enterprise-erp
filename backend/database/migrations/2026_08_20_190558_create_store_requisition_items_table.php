<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_requisition_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('store_requisition_id')
                ->constrained('store_requisitions')
                ->cascadeOnDelete();

            $table->foreignId('item_id')
                ->constrained('sales_item')
                ->restrictOnDelete();

            /*
             * Snapshot of the selected UOM at request time.
             * Normally this comes from the item's registered UOM.
             */
            $table->foreignId('uom_id')
                ->constrained('units_of_measurement')
                ->restrictOnDelete();

            /*
             * MR fields are required only when
             * store_requisitions.mr_requested = true.
             */
            $table->date('mr_date')
                ->nullable();

            $table->string('mr_no', 100)
                ->nullable();

            $table->decimal('mr_qty', 18, 4)
                ->nullable();

            /*
             * Requested Store Requisition quantity.
             */
            $table->decimal('sr_qty', 18, 4);

            /*
             * Must be a future date.
             * Urgent requests will later be validated
             * to be within 3 days.
             */
            $table->date('expected_delivery_date');

            /*
             * over_qty_based
             * at_any_time
             */
            $table->string('delivery_type', 30);

            /*
             * urgent
             * high
             * normal
             * low
             */
            $table->string('priority', 20);

            /*
             * Required only when priority = urgent.
             */
            $table->string('urgency_reason', 255)
                ->nullable();

            $table->text('remark')
                ->nullable();

            /*
             * These are for Stock Balance Check later.
             */
            $table->decimal('available_qty', 18, 4)
                ->nullable();

            $table->decimal('issued_qty', 18, 4)
                ->default(0);

            $table->decimal('shortage_qty', 18, 4)
                ->nullable();

            /*
             * pending
             * available
             * partially_available
             * unavailable
             * issued
             */
            $table->string('stock_status', 30)
                ->default('pending');

            $table->unsignedInteger('line_no');

            $table->timestamps();

            $table->unique(
                [
                    'store_requisition_id',
                    'line_no',
                ],
                'sr_item_line_unique'
            );

            $table->index('item_id');
            $table->index('uom_id');
            $table->index('priority');
            $table->index('stock_status');
            $table->index('expected_delivery_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_requisition_items');
    }
};