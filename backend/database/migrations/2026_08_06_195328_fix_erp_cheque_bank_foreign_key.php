<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table->dropForeign('erp_cheque_bank_fk');
        });

        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table
                ->foreign('bank_id', 'erp_cheque_bank_fk')
                ->references('id')
                ->on('sales_bank') // replace with actual table
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table->dropForeign('erp_cheque_bank_fk');
        });

        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table
                ->foreign('bank_id', 'erp_cheque_bank_fk')
                ->references('id')
                ->on('sales_bank')
                ->restrictOnDelete();
        });
    }
};