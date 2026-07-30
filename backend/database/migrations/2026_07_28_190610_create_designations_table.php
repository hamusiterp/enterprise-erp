<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designations', function (Blueprint $table) {
            $table->id();

            $table->string('code', 50)->unique();
            $table->string('name', 150);

            $table
                ->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->unsignedInteger('level')->nullable();

            $table
                ->string('status', 20)
                ->default('active');

            $table->text('description')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('department_id');
            $table->index('level');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('designations');
    }
};