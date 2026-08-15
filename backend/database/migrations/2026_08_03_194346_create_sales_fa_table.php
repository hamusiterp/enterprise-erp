<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_fa', function (Blueprint $table): void {
            $table->id();

            /*
             * Generated automatically:
             * FA000001, FA000002, FA000003...
             */
            $table
                ->string('asset_no', 20)
                ->unique();

            /*
             * Existing vehicle or machinery internal number.
             */
            $table
                ->string('vehicle_no', 50)
                ->nullable()
                ->index();

            $table
                ->string('tag_no', 50)
                ->unique();

            $table
                ->string('plate_no', 50)
                ->nullable()
                ->index();

            /*
             * References sales_category.
             * The frontend will load only categories
             * where type = machine.
             */
            $table
                ->foreignId('category_id')
                ->constrained(
                    table: 'sales_category',
                    indexName: 'sales_fa_category_fk'
                )
                ->restrictOnDelete();

            /*
             * Machinery/vehicle identification.
             */
            $table
                ->string('name_of_machinery', 200)
                ->index();

            $table
                ->string('make_of_vehicle', 100)
                ->nullable();

            $table
                ->string('model', 100)
                ->nullable();

            $table
                ->string('make_of_year', 20)
                ->nullable();

            $table
                ->string('chassis_no', 100)
                ->nullable()
                ->index();

            $table
                ->string('engine_no', 100)
                ->nullable()
                ->index();

            $table
                ->string('engine_model', 100)
                ->nullable();

            $table
                ->string('make_of_engine', 100)
                ->nullable();

            $table
                ->decimal('horse_power', 12, 2)
                ->nullable();

            $table
                ->string('type_of_fuel', 50)
                ->nullable()
                ->index();

            /*
             * Reading type values:
             * engine_horse_power
             * km_reading
             */
            $table
                ->string('reading_type', 30)
                ->nullable()
                ->index();

            $table
                ->decimal('reading', 18, 2)
                ->nullable();

            /*
             * Fuel and consumption information.
             */
            $table
                ->decimal('consumption', 12, 2)
                ->nullable();

            $table
                ->decimal('standard_consumption', 12, 2)
                ->nullable();

            $table
                ->decimal('tanker_capacity', 12, 2)
                ->nullable();

            $table
                ->date('last_refill')
                ->nullable();

            /*
             * Gauge availability.
             */
            $table
                ->boolean('has_gauge')
                ->default(false);

            /*
             * Gauge reading or percentage, when applicable.
             */
            $table
                ->decimal('gauge_reading', 12, 2)
                ->nullable();

            /*
             * Service information.
             */
            $table
                ->unsignedInteger('service_interval')
                ->nullable();

            $table
                ->date('last_service')
                ->nullable();

            /*
             * Important dates.
             */
            $table
                ->date('purchase_date')
                ->nullable()
                ->index();

            $table
                ->date('licence_renewal_date')
                ->nullable()
                ->index();

            $table
                ->date('last_inspection_renewal_date')
                ->nullable()
                ->index();

            $table
                ->date('last_insurance_renewal_date')
                ->nullable()
                ->index();

            /*
             * Uploaded image paths.
             */
            $table
                ->string('front_view_photo', 500)
                ->nullable();

            $table
                ->string('rear_view_photo', 500)
                ->nullable();

            $table
                ->string('right_side_view_photo', 500)
                ->nullable();

            $table
                ->string('left_side_view_photo', 500)
                ->nullable();

            /*
             * Uploaded document paths.
             */
            $table
                ->string('libre_document', 500)
                ->nullable();

            $table
                ->string('inspection_document', 500)
                ->nullable();

            $table
                ->string('insurance_document', 500)
                ->nullable();

            /*
             * Useful additional fixed-asset fields.
             */
            $table
                ->string('asset_condition', 30)
                ->default('good')
                ->index();

            $table
                ->string('current_location', 200)
                ->nullable();

            $table
                ->string('assigned_to', 200)
                ->nullable();

            $table
                ->text('remarks')
                ->nullable();

            $table
                ->string('status', 20)
                ->default('active')
                ->index();

            /*
             * Registration and audit information.
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
                ->date('registered_date')
                ->nullable()
                ->index();

            $table
                ->string('edited_by', 100)
                ->nullable();

            $table
                ->foreignId('edited_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index([
                'category_id',
                'status',
            ]);

            $table->index([
                'asset_condition',
                'current_location',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_fa');
    }
};