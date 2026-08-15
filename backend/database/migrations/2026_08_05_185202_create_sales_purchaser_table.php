<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_purchaser', function (Blueprint $table): void {
            $table->id();

            /*
             * Generated automatically:
             * PUR000001, PUR000002, PUR000003...
             */
            $table
                ->string('purchaser_no', 20)
                ->unique();

            $table
                ->string('purchaser_name', 100)
                ->index();

            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            /*
             * Registration information.
             */
            $table
                ->string('registered_by', 100)
                ->nullable();

            $table
                ->foreignId('registered_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table
                ->date('date_registered')
                ->nullable()
                ->index();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_purchaser');
    }
};