<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'sales_purchaser_account',
            function (Blueprint $table): void {
                $table->id();

                /*
                 * Proper relationship to the purchaser table.
                 */
                $table
                    ->foreignId('purchaser_id')
                    ->constrained(
                        table: 'sales_purchaser',
                        indexName: 'sales_purchaser_account_purchaser_fk'
                    )
                    ->cascadeOnDelete();

                /*
                 * Bank is selected from the completed Bank module.
                 */
                $table
                    ->foreignId('bank_id')
                    ->constrained(
                        table: 'sales_bank',
                        indexName: 'sales_purchaser_account_bank_fk'
                    )
                    ->restrictOnDelete();

                $table
                    ->string('account_number', 50)
                    ->index();

                /*
                 * Optional account label:
                 * Main Account, Payroll, USD Account, etc.
                 */
                $table
                    ->string('account_name', 100)
                    ->nullable();

                $table
                    ->string('currency', 10)
                    ->nullable();

                $table
                    ->boolean('is_primary')
                    ->default(false)
                    ->index();

                $table
                    ->string('status', 20)
                    ->default('active')
                    ->index();

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

                /*
                 * Prevent the same account number from being registered
                 * more than once under the same bank.
                 */
                $table->unique(
                    [
                        'bank_id',
                        'account_number',
                    ],
                    'sales_purchaser_account_bank_number_unique'
                );

                $table->index([
                    'purchaser_id',
                    'status',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'sales_purchaser_account'
        );
    }
};