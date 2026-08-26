<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.export',
            'users.reset-password',
            'users.change-status',

            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',

            'permissions.view',
            'audit-logs.view',
            'system-settings.manage',
            'company-settings.view',
            'company-settings.manage',
            'fiscal-years.view',
            'fiscal-years.manage',
            'fiscal-years.close',
            'fiscal-years.lock',
            'document-sequences.view',
            'document-sequences.manage',
            'tax-rates.view',
            'tax-rates.manage',
            'reporting-periods.view',
            'reporting-periods.manage',
            'access-policies.view',
            'access-policies.manage',
            'workflow-settings.view',
            'workflow-settings.manage',
            'store-requisitions.view',
            'store-requisitions.create',
            'store-requisitions.submit',
            'store-requisitions.approve',
            'store-requisitions.return',
            'store-requisitions.document-receive',
            'store-requisitions.stock-check',
            'units-of-measurement.view',
            'units-of-measurement.manage',
           
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $administrator = Role::findOrCreate('Administrator', 'web');
        $manager = Role::findOrCreate('Manager', 'web');
        $officer = Role::findOrCreate('Officer', 'web');
        $viewer = Role::findOrCreate('Viewer', 'web');

        $administrator->syncPermissions(Permission::all());

        $manager->syncPermissions([
            'users.view',
            'users.create',
            'users.update',
            'users.export',
            'roles.view',
        ]);

        $officer->syncPermissions([
            'users.view',
        ]);

        $viewer->syncPermissions([
            'users.view',
        ]);

        $adminUser = User::where(
            'email',
            'admin@enterprise.test',
        )->first();

        if ($adminUser) {
            $adminUser->syncRoles([$administrator]);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}