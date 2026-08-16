<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fiscal_years', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100);
            $table->string('code', 50)->unique();

            $table->date('start_date');
            $table->date('end_date');

            $table->boolean('is_current')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_locked')->default(false);

            $table->string('status', 30)->default('open');

            $table->text('remarks')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('start_date');
            $table->index('end_date');
            $table->index('is_current');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fiscal_years');
    }
};