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
                ->date('contract_date')
                ->nullable()
                ->index();

            $table
                ->boolean('has_site_handover_date')
                ->default(false);

            $table
                ->date('site_handover_date')
                ->nullable();

            $table
                ->boolean('has_commencement_date')
                ->default(false);

            $table
                ->date('commencement_date')
                ->nullable();

            $table
                ->unsignedInteger('project_duration')
                ->nullable();

            $table
                ->string('duration_type', 30)
                ->nullable()
                ->index();

            /*
             * Used when duration_type is working_days.
             * It includes holidays and weekends.
             */
            $table
                ->unsignedInteger('no_of_holidays')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_project', function (Blueprint $table): void {
            $table->dropColumn([
                'contract_date',
                'has_site_handover_date',
                'site_handover_date',
                'has_commencement_date',
                'commencement_date',
                'project_duration',
                'duration_type',
                'no_of_holidays',
            ]);
        });
    }
};