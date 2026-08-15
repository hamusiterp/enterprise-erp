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
                ->string('payment_term', 50)
                ->nullable()
                ->index();

            $table
                ->boolean('has_advance_payment')
                ->default(false);

            $table
                ->decimal('advance_percent', 5, 2)
                ->nullable();

            $table
                ->boolean('has_advance_repayment')
                ->default(false);

            /*
             * Percentage of project completion by which the
             * advance must be fully repaid.
             */
            $table
                ->decimal(
                    'advance_repayment_complete_percent',
                    5,
                    2
                )
                ->nullable();

            /*
             * Percentage deducted from each applicable payment.
             */
            $table
                ->decimal(
                    'advance_repayment_percent',
                    5,
                    2
                )
                ->nullable();

            $table
                ->string('advance_repayment_start', 30)
                ->nullable();

            $table
                ->unsignedInteger('interim_payment_schedule')
                ->nullable();

            $table
                ->date('advance_payment_due_date')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table->dropColumn([
                'payment_term',
                'has_advance_payment',
                'advance_percent',
                'has_advance_repayment',
                'advance_repayment_complete_percent',
                'advance_repayment_percent',
                'advance_repayment_start',
                'interim_payment_schedule',
                'advance_payment_due_date',
            ]);
        });
    }
};