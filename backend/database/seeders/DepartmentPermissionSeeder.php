<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DepartmentPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'departments.view',
            'departments.create',
            'departments.update',
            'departments.delete',
            'departments.export',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);
        }

        $administrator = Role::query()
            ->where('name', 'Administrator')
            ->where('guard_name', 'web')
            ->first();

        if ($administrator) {
            $administrator->givePermissionTo(
                $permissions
            );
        }
    }
}