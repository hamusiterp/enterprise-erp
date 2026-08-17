<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_sequences', function (Blueprint $table) {
            $table->id();

            // Document identity
            $table->string('document_type', 100);
            $table->string('name', 150);
            $table->string('prefix', 30);

            // Fiscal year
            $table->foreignId('fiscal_year_id')
                ->constrained('fiscal_years')
                ->restrictOnDelete();

            // Number configuration
            $table->unsignedBigInteger('current_number')
                ->default(0);

            $table->unsignedInteger('number_length')
                ->default(6);

            /*
             * Examples:
             *
             * {PREFIX}/{FY}/{NUMBER}
             * {PREFIX}-{FY}-{NUMBER}
             * {PREFIX}/{NUMBER}
             */
            $table->string('format', 200)
                ->default('{PREFIX}/{FY}/{NUMBER}');

            // Future flexibility
            $table->boolean('reset_per_fiscal_year')
                ->default(true);

            $table->boolean('is_active')
                ->default(true);

            $table->text('remarks')->nullable();

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

            /*
             * One sequence for each document type
             * within each fiscal year.
             */
            $table->unique(
                ['document_type', 'fiscal_year_id'],
                'document_sequences_type_fy_unique'
            );

            $table->index('document_type');
            $table->index('fiscal_year_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_sequences');
    }
};