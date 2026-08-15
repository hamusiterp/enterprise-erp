<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_item', function (Blueprint $table): void {
            $table->id();

            $table
                ->string('item_no', 30)
                ->unique();

            $table->text('item_description');

            $table
                ->string('category', 50)
                ->index();

            $table
                ->string('unit', 20)
                ->index();

            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            $table
                ->date('product_date')
                ->nullable()
                ->index();

            $table
                ->string('type', 30)
                ->index();

            $table
                ->string('inventory', 20)
                ->index();

            $table
                ->string('registered_by', 100)
                ->nullable();

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
                'category',
                'status',
            ]);

            $table->index([
                'type',
                'status',
            ]);

            $table->index([
                'inventory',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_item');
    }
};