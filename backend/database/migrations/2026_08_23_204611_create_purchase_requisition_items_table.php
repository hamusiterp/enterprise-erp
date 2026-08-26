<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requisition_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('purchase_requisition_id')
                ->constrained('purchase_requisitions')
                ->cascadeOnDelete();

            /*
             * Original SR line.
             */
            $table->foreignId('store_requisition_item_id')
                ->constrained('store_requisition_items')
                ->restrictOnDelete();

            $table->foreignId('item_id')
                ->constrained('sales_item')
                ->restrictOnDelete();

            $table->foreignId('uom_id')
                ->constrained('units_of_measurement')
                ->restrictOnDelete();

            /*
             * Snapshot quantities.
             */
            $table->decimal('sr_qty', 18, 4);

            $table->decimal(
                'available_qty',
                18,
                4
            )->default(0);

            $table->decimal('pr_qty', 18, 4);

            $table->date(
                'expected_delivery_date'
            )->nullable();

            $table->string(
                'priority',
                30
            )->nullable();

            $table->string(
                'delivery_type',
                50
            )->nullable();

            $table->text('remark')->nullable();

            $table->timestamps();

            $table->index('item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'purchase_requisition_items'
        );
    }
};