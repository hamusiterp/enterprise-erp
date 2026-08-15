<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'sales_subcontractor',
            function (Blueprint $table): void {
                $table->id();

                /*
                 * company
                 * individual
                 */
                $table
                    ->string('type', 20)
                    ->index();

                /*
                 * Required only for Individual.
                 */
                $table
                    ->string('firstname', 100)
                    ->nullable();

                $table
                    ->string('lastname', 100)
                    ->nullable();

                /*
                 * Required only for Company.
                 */
                $table
                    ->string('company_name', 150)
                    ->nullable();

                $table
                    ->string('tin_no', 50)
                    ->nullable();

                $table
                    ->text('address');

                $table
                    ->string('contact_person', 100);

                $table
                    ->string('phone_number', 100);

                /*
                 * Allowed:
                 * 0
                 * 2
                 * 10
                 * 15
                 */
                $table
                    ->decimal(
                        'tax_percent',
                        5,
                        2
                    )
                    ->default(0);

                /*
                 * Selected from the existing
                 * sales_category table.
                 */
                $table
                    ->foreignId('category_id')
                    ->constrained(
                        table: 'sales_category',
                        indexName: 'sales_subcontractor_category_fk'
                    )
                    ->restrictOnDelete();

                $table
                    ->string('status', 20)
                    ->default('active')
                    ->index();

                $table
                    ->string('registered_by', 100)
                    ->nullable();

                $table
                    ->foreignId(
                        'registered_by_user_id'
                    )
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                $table
                    ->date('date_registered')
                    ->nullable()
                    ->index();

                $table->timestamps();

                /*
                 * Keep records for future reference.
                 */
                $table->softDeletes();

                $table->index([
                    'type',
                    'status',
                ]);

                $table->index([
                    'category_id',
                    'status',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'sales_subcontractor'
        );
    }
};