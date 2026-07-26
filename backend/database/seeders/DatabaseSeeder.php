<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'admin@enterprise.test',
            ],
            [
                'name' => 'System Administrator',
                'password' => 'Admin@12345',
                'status' => 'active',
            ],
        );

        $this->call(RolesAndPermissionsSeeder::class);
    }
}