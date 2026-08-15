<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table
                ->boolean('has_price_adjustment')
                ->default(false);

            $table
                ->decimal('price_adjustment_percent', 5, 2)
                ->nullable();

            $table
                ->boolean('has_retention')
                ->default(false);

            $table
                ->decimal('retention_percent', 5, 2)
                ->nullable();

            $table
                ->boolean('has_price_index')
                ->default(false);

            $table
                ->boolean('has_liquidity_damage')
                ->default(false);

            $table
                ->decimal('liquidity_percent', 5, 2)
                ->nullable();

            $table
                ->decimal('liquidity_limit', 30, 2)
                ->nullable();

            $table
                ->unsignedInteger('minimum_payment_time')
                ->nullable();

            /*
             * Engineering facilities are stored as a PostgreSQL JSON array:
             * ["vehicle", "telephone", "internet"]
             */
            $table
                ->json('engineering_facilities')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table->dropColumn([
                'has_price_adjustment',
                'price_adjustment_percent',
                'has_retention',
                'retention_percent',
                'has_price_index',
                'has_liquidity_damage',
                'liquidity_percent',
                'liquidity_limit',
                'minimum_payment_time',
                'engineering_facilities',
            ]);
        });
    }
};