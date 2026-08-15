<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_customer', function (Blueprint $table): void {
            $table->id();

            /*
             * Generated automatically:
             * CUS000001, CUS000002, CUS000003...
             */
            $table
                ->string('customer_no', 20)
                ->unique();

            /*
             * individual | company
             */
            $table
                ->string('customer_type', 30)
                ->index();

            /*
             * Required only when customer_type = individual.
             */
            $table
                ->string('firstname', 50)
                ->nullable();

            $table
                ->string('lastname', 50)
                ->nullable();

            /*
             * Required only when customer_type = company.
             */
            $table
                ->string('company_name', 200)
                ->nullable()
                ->index();

            $table
                ->string('email_address', 100)
                ->nullable()
                ->index();

            /*
             * Required only for company customers.
             */
            $table
                ->string('tin_number', 50)
                ->nullable()
                ->index();

            $table
                ->string('contact_person', 100)
                ->nullable();

            $table
                ->string('phone_number', 50)
                ->index();

            /*
             * active | inactive
             */
            $table
                ->string('customer_status', 20)
                ->default('active')
                ->index();

            /*
             * Yes/No stored as boolean.
             */
            $table
                ->boolean('withhold')
                ->default(false);

            /*
             * Required only when withhold = true.
             */
            $table
                ->decimal('withhold_percent', 5, 2)
                ->nullable();

            $table
                ->string('location', 100);

            /*
             * Yes/No stored as boolean.
             */
            $table
                ->boolean('withhold_from_advance')
                ->default(false);

            /*
             * Registration audit fields.
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

            $table->index([
                'customer_type',
                'customer_status',
            ]);

            $table->index([
                'withhold',
                'withhold_from_advance',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_customer');
    }
};