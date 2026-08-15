<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table
                ->boolean('is_used')
                ->default(false)
                ->index();

            $table
                ->string('used_reference_type', 50)
                ->nullable();

            $table
                ->unsignedBigInteger('used_reference_id')
                ->nullable()
                ->index();

            $table
                ->dateTime('used_at')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('erp_cheque', function (Blueprint $table): void {
            $table->dropColumn([
                'is_used',
                'used_reference_type',
                'used_reference_id',
                'used_at',
            ]);
        });
    }
};