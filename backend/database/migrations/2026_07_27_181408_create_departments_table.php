<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table): void {
            $table->id();

            $table->string('department_id')->unique();
            $table->string('department_name');

            $table->string('status', 20)
                ->default('active');

            $table->timestamps();
            $table->softDeletes();

            $table->index('department_name');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};