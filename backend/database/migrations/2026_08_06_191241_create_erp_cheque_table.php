<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('erp_cheque', function (Blueprint $table): void {
            $table->id();

            /*
             * Selected from the existing Bank module.
             */
            $table
                ->foreignId('bank_id')
                ->constrained(
                    table: 'sales_bank',
                    indexName: 'erp_cheque_bank_fk'
                )
                ->restrictOnDelete();

            /*
             * Stored as a snapshot because the bank branch
             * could be changed later in the Bank module.
             */
            $table
                ->string('branch', 100);

            $table
                ->string('cheque_no', 50)
                ->unique();

            /*
             * Values:
             * fully
             * partially
             */
            $table
                ->string('signature_status', 20)
                ->index();

            /*
             * Values:
             * active
             * void
             */
            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            $table
                ->string('registered_by', 100)
                ->nullable();

            $table
                ->foreignId('registered_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table
                ->date('date_registered')
                ->nullable()
                ->index();

            $table
                ->string('void_by', 100)
                ->nullable();

            $table
                ->foreignId('void_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table
                ->date('void_date')
                ->nullable();

            $table
                ->string('active_by', 100)
                ->nullable();

            $table
                ->foreignId('active_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table
                ->date('active_date')
                ->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index([
                'bank_id',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('erp_cheque');
    }
};