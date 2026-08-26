<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_item', function (Blueprint $table) {
            $table->foreignId('uom_id')
                ->nullable()
                ->after('category')
                ->constrained('units_of_measurement')
                ->restrictOnDelete();

            $table->index('uom_id');
        });
    }

    public function down(): void
    {
        Schema::table('sales_item', function (Blueprint $table) {
            $table->dropForeign(['uom_id']);
            $table->dropIndex(['uom_id']);
            $table->dropColumn('uom_id');
        });
    }
};