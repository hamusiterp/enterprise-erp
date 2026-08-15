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
                ->boolean('has_advance_bond')
                ->default(false);

            $table
                ->decimal('advance_bond_percent', 5, 2)
                ->nullable();

            $table
                ->string('advance_bond_type', 50)
                ->nullable();

            $table
                ->date('advance_bond_start_date')
                ->nullable();

            $table
                ->date('advance_bond_end_date')
                ->nullable();

            $table
                ->boolean('has_performance_bond')
                ->default(false);

            $table
                ->decimal('performance_bond_percent', 5, 2)
                ->nullable();

            $table
                ->string('performance_bond_type', 50)
                ->nullable();

            $table
                ->date('performance_bond_start_date')
                ->nullable();

            $table
                ->date('performance_bond_end_date')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table->dropColumn([
                'has_advance_bond',
                'advance_bond_percent',
                'advance_bond_type',
                'advance_bond_start_date',
                'advance_bond_end_date',
                'has_performance_bond',
                'performance_bond_percent',
                'performance_bond_type',
                'performance_bond_start_date',
                'performance_bond_end_date',
            ]);
        });
    }
};