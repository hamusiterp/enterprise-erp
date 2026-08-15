<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_supplier', function (Blueprint $table): void {
            $table->id();

            /*
             * Generated automatically:
             * SUP000001, SUP000002, SUP000003...
             */
            $table
                ->string('supplier_no', 20)
                ->unique();

            $table
                ->string('supplier_name', 200)
                ->index();

            /*
             * Supplier category from sales_category.
             * Only categories with type = supplier
             * will be shown in the frontend form.
             */
            $table
                ->foreignId('category_id')
                ->constrained(
                    table: 'sales_category',
                    indexName: 'sales_supplier_category_fk'
                )
                ->restrictOnDelete();

            $table
                ->text('address')
                ->nullable();

            $table
                ->string('phone_number', 50)
                ->index();

            /*
             * TIN conditional fields.
             */
            $table
                ->boolean('has_tin')
                ->default(false);

            $table
                ->string('tin', 50)
                ->nullable()
                ->index();

            /*
             * Legacy-compatible authenticated-user name.
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

            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            /*
             * Preserves the legacy approved_by value.
             * We will connect approval workflow later.
             */
            $table
                ->string('approved_by', 500)
                ->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index([
                'category_id',
                'status',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_supplier');
    }
};