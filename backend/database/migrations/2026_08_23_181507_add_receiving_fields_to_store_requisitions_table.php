<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('store_requisitions', function (Blueprint $table) {
            $table->date('sr_received_date')
                ->nullable();

            $table->foreignId('sr_received_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('store_requisitions', function (Blueprint $table) {
            $table->dropForeign([
                'sr_received_by',
            ]);

            $table->dropColumn([
                'sr_received_date',
                'sr_received_by',
            ]);
        });
    }
};