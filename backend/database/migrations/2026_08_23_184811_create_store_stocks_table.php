<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_stocks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')
                ->constrained('sales_item')
                ->restrictOnDelete();

            $table->foreignId('uom_id')
                ->nullable()
                ->constrained('units_of_measurement')
                ->nullOnDelete();

            $table->decimal('quantity_on_hand', 18, 4)
                ->default(0);

            $table->decimal('reserved_quantity', 18, 4)
                ->default(0);

            $table->decimal('available_quantity', 18, 4)
                ->default(0);

            $table->decimal('minimum_stock_level', 18, 4)
                ->nullable();

            $table->decimal('maximum_stock_level', 18, 4)
                ->nullable();

            $table->string('location', 150)
                ->default('Main Store');

            $table->string('status', 20)
                ->default('active');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->unique([
                'item_id',
                'location',
            ]);

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_stocks');
    }
};