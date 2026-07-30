<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_bank', function (Blueprint $table) {
            $table->id();

            $table->string('bank_id', 20)->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('bank_name_orginal', 200);

            $table->string('account_no', 50)->nullable();
            $table->string('branch', 50)->nullable();
            $table->string('contact_address', 50)->nullable();

            $table->decimal('begnning_amount', 64, 2)->nullable();
            $table->decimal('begnning__amount_left', 64, 2)->nullable();

            $table->string('od_available', 20)->nullable();
            $table->string('start_date', 10)->nullable();
            $table->string('end_date', 10)->nullable();
            $table->decimal('od_amount', 64, 2)->nullable();
            $table->decimal('od_amount_left', 64, 2)->nullable();
            $table->decimal('min_amount', 64, 2)->default(0);
            $table->string('od_limit', 20)->default('');
            $table->string('od_status', 30)->nullable();

            $table->string('term_loan', 20)->nullable();
            $table->string('term_loan_start_date', 10)->nullable();
            $table->string('term_loan_end_date', 10)->nullable();
            $table->decimal('term_loan_amount', 64, 2)->nullable();

            $table->decimal('transfer_rate', 64, 2)->default(0);
            $table->decimal('repayment_amount', 64, 2)->nullable();
            $table->string('repayment_amount_left', 20)->default('');

            $table->string('term_loan_relief', 20)->default('');
            $table->string('term_loan_relief_start_date', 20)->default('');
            $table->string('term_loan_relief_end_date', 20)->default('');

            $table->string('period', 20)->nullable();
            $table->string('ethiopian_date', 10)->nullable();
            $table->string('date_registered', 10)->nullable();

            $table->string('cob_balance', 20)->default('');
            $table->string('status', 20)->default('active');
            $table->string('last_activity', 100)->default('');
            $table->string('suggestion', 20)->default('');
            $table->string('end_balance', 20)->default('');
            $table->string('loan_status', 20)->default('');
            $table->string('credit_suggestion', 20)->default('');
            $table->string('category', 500)->default('');
            $table->string('start_month', 50)->default('');

            $table->timestamps();
            $table->softDeletes();

            $table->index('bank_id');
            $table->index('bank_name');
            $table->index('account_no');
            $table->index('status');
            $table->index('od_status');
            $table->index('loan_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_bank');
    }
};