<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();

            // Tax identity
            $table->string('code', 50);
            $table->string('name', 150);

            /*
             * Examples:
             * vat
             * withholding
             * pension_employee
             * pension_employer
             * levy
             * other
             */
            $table->string('type', 50);

            // Percentage rate
            // Example: 15.0000 means 15%
            $table->decimal('rate', 10, 4);

            // Country applicability
            $table->string('country_code', 10)->nullable();

            /*
             * Effective dating allows rates to change
             * without deleting historical rates.
             */
            $table->date('effective_from');

            $table->date('effective_to')->nullable();

            // Optional fiscal-year restriction
            $table->foreignId('fiscal_year_id')
                ->nullable()
                ->constrained('fiscal_years')
                ->restrictOnDelete();

            /*
             * Calculation behavior:
             *
             * add      = added to base amount
             * deduct   = deducted from base/payment
             * info     = informational/calculated only
             */
            $table->string('calculation_method', 30)
                ->default('add');

            // Whether this rate is available for use
            $table->boolean('is_active')
                ->default(true);

            // Useful for system defaults
            $table->boolean('is_default')
                ->default(false);

            $table->text('description')->nullable();

            // Audit ownership
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('code');
            $table->index('type');
            $table->index('country_code');
            $table->index('effective_from');
            $table->index('effective_to');
            $table->index('fiscal_year_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};