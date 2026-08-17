<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reporting_periods', function (Blueprint $table) {
            $table->id();

            $table->foreignId('fiscal_year_id')
                ->constrained('fiscal_years')
                ->restrictOnDelete();

            /*
             * Examples:
             * Meskerem
             * Tikimt
             * January
             * February
             */
            $table->string('name', 100);

            /*
             * Optional short code:
             * MES, TIK, JAN, FEB
             */
            $table->string('code', 30);

            /*
             * Controls report/chart ordering.
             *
             * Meskerem = 1
             * Tikimt   = 2
             * ...
             *
             * January  = 1
             * February = 2
             */
            $table->unsignedSmallInteger('period_number');

            /*
             * Actual Gregorian boundaries used by PostgreSQL.
             */
            $table->date('start_date');
            $table->date('end_date');

            /*
             * Display calendar.
             *
             * gregorian
             * ethiopian
             * custom
             */
            $table->string('calendar_type', 30)
                ->default('gregorian');

            /*
             * Optional display values.
             *
             * These are useful when the company wants reports
             * to show Ethiopian dates while PostgreSQL continues
             * working with Gregorian dates.
             */
            $table->string('display_start_date', 50)
                ->nullable();

            $table->string('display_end_date', 50)
                ->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->boolean('is_closed')
                ->default(false);

            $table->text('remarks')
                ->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            /*
             * A fiscal year cannot contain duplicate
             * period numbers or codes.
             */
            $table->unique(
                ['fiscal_year_id', 'period_number'],
                'reporting_periods_fy_number_unique'
            );

            $table->unique(
                ['fiscal_year_id', 'code'],
                'reporting_periods_fy_code_unique'
            );

            $table->index([
                'fiscal_year_id',
                'start_date',
                'end_date',
            ]);

            $table->index('calendar_type');
            $table->index('is_active');
            $table->index('is_closed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reporting_periods');
    }
};