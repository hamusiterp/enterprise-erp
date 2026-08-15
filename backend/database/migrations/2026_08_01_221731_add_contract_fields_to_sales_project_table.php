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
                ->string('business_unit', 100)
                ->nullable()
                ->index();

            $table
                ->string('contract_type', 100)
                ->nullable()
                ->index();

            $table
                ->decimal(
                    'contract_amount_before_vat',
                    30,
                    2
                )
                ->nullable();

            $table
                ->string('contract_pricing_type', 100)
                ->nullable()
                ->index();
        });
    }

    public function down(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table->dropColumn([
                'business_unit',
                'contract_type',
                'contract_amount_before_vat',
                'contract_pricing_type',
            ]);
        });
    }
};