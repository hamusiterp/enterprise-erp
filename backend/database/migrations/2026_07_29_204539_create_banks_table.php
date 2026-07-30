<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Bank Basic Information
            |--------------------------------------------------------------------------
            */

            $table->string('code', 20)->unique();
            $table->string('name', 150);
            $table->string('official_name', 200)->nullable();

            $table->string('account_number', 50)->nullable();
            $table->string('branch', 100)->nullable();
            $table->string('contact_address', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Opening and Minimum Balances
            |--------------------------------------------------------------------------
            */

            $table
                ->decimal('opening_balance', 20, 2)
                ->default(0);

            $table
                ->decimal('opening_balance_remaining', 20, 2)
                ->default(0);

            $table
                ->decimal('minimum_balance', 20, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Overdraft Information
            |--------------------------------------------------------------------------
            */

            $table
                ->boolean('overdraft_available')
                ->default(false);

            $table
                ->date('overdraft_start_date')
                ->nullable();

            $table
                ->date('overdraft_end_date')
                ->nullable();

            $table
                ->decimal('overdraft_amount', 20, 2)
                ->default(0);

            $table
                ->decimal('overdraft_amount_remaining', 20, 2)
                ->default(0);

            $table
                ->decimal('overdraft_limit', 20, 2)
                ->default(0);

            $table
                ->string('overdraft_status', 30)
                ->default('inactive');

            /*
            |--------------------------------------------------------------------------
            | Term Loan Information
            |--------------------------------------------------------------------------
            */

            $table
                ->boolean('term_loan_available')
                ->default(false);

            $table
                ->date('term_loan_start_date')
                ->nullable();

            $table
                ->date('term_loan_end_date')
                ->nullable();

            $table
                ->decimal('term_loan_amount', 20, 2)
                ->default(0);

            $table
                ->decimal('transfer_rate', 10, 4)
                ->default(0);

            $table
                ->decimal('repayment_amount', 20, 2)
                ->default(0);

            $table
                ->decimal('repayment_amount_remaining', 20, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Term Loan Relief
            |--------------------------------------------------------------------------
            */

            $table
                ->boolean('term_loan_relief')
                ->default(false);

            $table
                ->date('term_loan_relief_start_date')
                ->nullable();

            $table
                ->date('term_loan_relief_end_date')
                ->nullable();

            $table
                ->string('loan_status', 30)
                ->default('inactive');

            /*
            |--------------------------------------------------------------------------
            | Reporting and Balance Information
            |--------------------------------------------------------------------------
            */

            $table
                ->string('period', 20)
                ->nullable();

            // Keep only the two requested business-date fields.
            $table
                ->date('gregorian_date')
                ->nullable();

            $table
                ->string('ethiopian_date', 20)
                ->nullable();

            $table
                ->decimal('cob_balance', 20, 2)
                ->default(0);

            $table
                ->decimal('ending_balance', 20, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Suggestions and Classification
            |--------------------------------------------------------------------------
            */

            $table
                ->string('suggestion', 100)
                ->nullable();

            $table
                ->string('credit_suggestion', 100)
                ->nullable();

            $table
                ->string('category', 500)
                ->nullable();

            $table
                ->string('start_month', 50)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status and Activity
            |--------------------------------------------------------------------------
            */

            $table
                ->string('status', 20)
                ->default('active');

            $table
                ->text('last_activity')
                ->nullable();

            $table->timestamps();
            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('name');
            $table->index('official_name');
            $table->index('account_number');
            $table->index('branch');
            $table->index('status');
            $table->index('overdraft_status');
            $table->index('loan_status');
            $table->index('gregorian_date');
            $table->index('ethiopian_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};