<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units_of_measurement', function (Blueprint $table) {
            $table->id();

            /*
             * Examples:
             * PCS
             * KG
             * LTR
             * BOX
             */
            $table->string('code', 30)->unique();

            /*
             * Examples:
             * Pieces
             * Kilogram
             * Litre
             */
            $table->string('name', 100);

            /*
             * Optional symbol used on forms/reports.
             *
             * Examples:
             * kg
             * L
             * m
             */
            $table->string('symbol', 30)
                ->nullable();

            /*
             * Optional category.
             *
             * quantity
             * weight
             * volume
             * length
             * area
             * package
             * other
             */
            $table->string('category', 50)
                ->nullable();

            /*
             * Number of decimal places normally allowed.
             *
             * PCS = 0
             * KG  = 3
             * LTR = 2
             */
            $table->unsignedSmallInteger('decimal_places')
                ->default(0);

            $table->boolean('is_active')
                ->default(true);

            $table->text('description')
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

            $table->index('name');
            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units_of_measurement');
    }
};