<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_category', function (Blueprint $table): void {
            $table->id();

            $table
                ->string('category', 50)
                ->index();

            $table
                ->string('type', 20)
                ->index();

            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            $table->timestamps();
            $table->softDeletes();

            /*
             * The same category name may exist under a different type,
             * but the same category/type combination cannot be repeated.
             */
            $table->unique([
                'category',
                'type',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_category');
    }
};