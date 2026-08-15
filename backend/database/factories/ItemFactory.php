<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;

    public function definition(): array
    {
        $number = fake()->unique()->numberBetween(
            1001,
            999999
        );

        return [
            'item_no' => 'ITM' . $number,
            'item_description' => fake()->words(
                4,
                true
            ),
            'category' => fake()->randomElement([
                'Office Supplies',
                'Construction Materials',
                'Electrical',
                'Furniture',
                'IT Equipment',
                'Cleaning Supplies',
            ]),
            'unit' => fake()->randomElement([
                'Piece',
                'Box',
                'Pack',
                'Kilogram',
                'Liter',
                'Meter',
                'Set',
            ]),
            'status' => fake()->randomElement([
                'active',
                'inactive',
            ]),
            'product_date' => fake()->date(),
            'type' => fake()->randomElement([
                'Product',
                'Material',
                'Asset',
                'Consumable',
            ]),
            'inventory' => fake()->randomElement([
                'Stock',
                'Non-Stock',
            ]),
            'registered_by' => 'System',
            'registered_by_user_id' => null,
            'date_registered' => now()->toDateString(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (): array => [
            'status' => 'active',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'status' => 'inactive',
        ]);
    }
}