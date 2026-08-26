<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_stock_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('store_stock_id')
                ->constrained('store_stocks')
                ->cascadeOnDelete();

            $table->foreignId('item_id')
                ->constrained('sales_item')
                ->restrictOnDelete();

            $table->string('transaction_type', 30);

            /*
             * opening
             * receipt
             * issue
             * adjustment_in
             * adjustment_out
             * reservation
             * reservation_release
             */

            $table->decimal('quantity', 18, 4);

            $table->decimal('balance_before', 18, 4);

            $table->decimal('balance_after', 18, 4);

            $table->string('reference_type', 100)
                ->nullable();

            $table->unsignedBigInteger('reference_id')
                ->nullable();

            $table->string('reference_no', 100)
                ->nullable();

            $table->text('remarks')
                ->nullable();

            $table->foreignId('performed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('transaction_date')
                ->useCurrent();

            $table->timestamps();

            $table->index([
                'item_id',
                'transaction_type',
            ]);

            $table->index([
                'reference_type',
                'reference_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'store_stock_transactions'
        );
    }
};