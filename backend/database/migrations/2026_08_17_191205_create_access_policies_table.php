<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_policies', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);
            $table->string('code', 50)->unique();

            $table->text('description')->nullable();

            /*
             * allow = access is allowed only within schedules
             * deny  = access is denied within schedules
             */
            $table->string('policy_type', 20)
                ->default('allow');

            $table->boolean('is_active')
                ->default(true);

            $table->unsignedInteger('priority')
                ->default(100);

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->index('policy_type');
            $table->index('is_active');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_policies');
    }
};