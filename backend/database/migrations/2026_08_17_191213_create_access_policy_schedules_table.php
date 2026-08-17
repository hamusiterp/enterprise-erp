<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_policy_schedules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('access_policy_id')
                ->constrained('access_policies')
                ->cascadeOnDelete();

            /*
             * 1 = Monday
             * 2 = Tuesday
             * ...
             * 7 = Sunday
             */
            $table->unsignedSmallInteger('day_of_week');

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            /*
             * false means this day is completely blocked
             */
            $table->boolean('is_allowed_day')
                ->default(true);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->unique(
                ['access_policy_id', 'day_of_week'],
                'access_policy_schedule_day_unique'
            );

            $table->index('day_of_week');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_policy_schedules');
    }
};