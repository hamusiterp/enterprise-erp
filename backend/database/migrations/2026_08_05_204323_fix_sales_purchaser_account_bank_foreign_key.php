<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'sales_purchaser_account',
            function (Blueprint $table): void {
                $table->dropForeign(
                    'sales_purchaser_account_bank_fk'
                );
            }
        );

        Schema::table(
            'sales_purchaser_account',
            function (Blueprint $table): void {
                $table
                    ->foreign('bank_id')
                    ->references('id')
                    ->on('sales_bank')
                    ->restrictOnDelete();
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'sales_purchaser_account',
            function (Blueprint $table): void {
                $table->dropForeign([
                    'bank_id',
                ]);
            }
        );

        Schema::table(
            'sales_purchaser_account',
            function (Blueprint $table): void {
                $table
                    ->foreign('bank_id')
                    ->references('id')
                    ->on('banks')
                    ->restrictOnDelete();
            }
        );
    }
};