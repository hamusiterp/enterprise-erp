<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();

            // Company identity
            $table->string('company_name', 200);
            $table->string('trading_name', 200)->nullable();
            $table->string('company_code', 50)->nullable();

            // Branding
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();

            // Contact information
            $table->string('email', 150)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('phone_2', 50)->nullable();
            $table->string('website', 200)->nullable();

            // Address
            $table->string('country', 100)->nullable();
            $table->string('country_code', 10)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state_region', 150)->nullable();
            $table->text('address')->nullable();
            $table->string('postal_code', 30)->nullable();

            // Legal / tax information
            $table->string('tin_number', 100)->nullable();
            $table->string('vat_number', 100)->nullable();
            $table->string('registration_number', 100)->nullable();

            // Localization
            $table->string('default_currency', 10)->default('ETB');
            $table->string('timezone', 100)->default('Africa/Addis_Ababa');
            $table->string('date_format', 30)->default('Y-m-d');

            // Print settings
            $table->string('print_header')->nullable();
            $table->text('print_footer')->nullable();

            // Status
            $table->boolean('is_active')->default(true);

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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};