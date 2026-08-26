<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'store_requisition_items',
            function (Blueprint $table) {

                if (
                    !Schema::hasColumn(
                        'store_requisition_items',
                        'stock_status'
                    )
                ) {
                    $table->string(
                        'stock_status',
                        30
                    )->nullable();
                }

                if (
                    !Schema::hasColumn(
                        'store_requisition_items',
                        'stock_checked_by'
                    )
                ) {
                    $table->foreignId(
                        'stock_checked_by'
                    )
                        ->nullable()
                        ->constrained('users')
                        ->nullOnDelete();
                }

                if (
                    !Schema::hasColumn(
                        'store_requisition_items',
                        'stock_checked_at'
                    )
                ) {
                    $table->timestamp(
                        'stock_checked_at'
                    )->nullable();
                }

                if (
                    !Schema::hasColumn(
                        'store_requisition_items',
                        'stock_check_remark'
                    )
                ) {
                    $table->text(
                        'stock_check_remark'
                    )->nullable();
                }
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'store_requisition_items',
            function (Blueprint $table) {

                if (
                    Schema::hasColumn(
                        'store_requisition_items',
                        'stock_checked_by'
                    )
                ) {
                    $table->dropForeign([
                        'stock_checked_by',
                    ]);
                }

                $columns = [];

                foreach ([
                    'stock_status',
                    'stock_checked_by',
                    'stock_checked_at',
                    'stock_check_remark',
                ] as $column) {
                    if (
                        Schema::hasColumn(
                            'store_requisition_items',
                            $column
                        )
                    ) {
                        $columns[] = $column;
                    }
                }

                if (!empty($columns)) {
                    $table->dropColumn(
                        $columns
                    );
                }
            }
        );
    }
};