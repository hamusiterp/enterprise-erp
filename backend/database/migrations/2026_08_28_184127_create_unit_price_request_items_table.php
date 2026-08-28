<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_price_request_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('unit_price_request_id')
                ->constrained('unit_price_requests')
                ->cascadeOnDelete();

            // Source line/item reference
            $table->string('source_item_type', 50)->nullable();
            $table->unsignedBigInteger('source_item_id')->nullable();

            // Item master linkage
            $table->foreignId('item_id')
                ->nullable()
                ->constrained('sales_item')
                ->restrictOnDelete();

            $table->foreignId('uom_id')
                ->nullable()
                ->constrained('units_of_measurement')
                ->restrictOnDelete();

            $table->decimal('quantity', 18, 4)->default(0);

            // Pricing
            $table->decimal('previous_unit_price', 18, 2)->nullable();
            $table->decimal('unit_price', 18, 2)->nullable();

            $table->decimal('vat_percentage', 5, 2)->default(0);
            $table->decimal('tax_amount', 18, 2)->default(0);
            $table->decimal('line_total', 18, 2)->default(0);
            $table->decimal('grand_total', 18, 2)->default(0);

            // Supplier information
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->string('supplier_name', 200)->nullable();
            $table->decimal('supplier_stock', 18, 4)->nullable();

            // Pricing process
            $table->string('status', 30)->default('pending');

            $table->foreignId('price_updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('price_updated_at')->nullable();

            $table->foreignId('price_confirmed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('price_confirmed_at')->nullable();

            $table->text('confirmation_notes')->nullable();

            // Out of stock handling
            $table->boolean('is_out_of_stock')->default(false);
            $table->text('out_of_stock_reason')->nullable();

            $table->timestamps();

            $table->index('source_item_type');
            $table->index('source_item_id');
            $table->index('status');
            $table->index('supplier_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_price_request_items');
    }
};