import {
  MobileModule,
} from '../constants/modules';

export function canAccessModule(
  permissions: string[] | undefined,
  roles: string[] | undefined,
  module: MobileModule
): boolean {

  const normalizedRoles =
    (roles ?? []).map(
      (role) => role.toLowerCase()
    );

  /*
   * Super Admin / Admin gets all
   */
  if (
    normalizedRoles.includes(
      'super admin'
    ) ||
    normalizedRoles.includes(
      'super-admin'
    ) ||
    normalizedRoles.includes(
      'admin'
    )
  ) {
    return true;
  }

  /*
   * Temporarily allow modules when
   * no permissions were returned.
   *
   * We will tighten this after we
   * inspect the exact permission names
   * used in KASCON.
   */
  if (!permissions?.length) {
    return true;
  }

  if (
    !module.permissionKeywords?.length
  ) {
    return true;
  }

  const normalized =
    permissions.map(
      (permission) =>
        permission.toLowerCase()
    );

  return module.permissionKeywords.some(
    (keyword) =>
      normalized.some(
        (permission) =>
          permission.includes(
            keyword.toLowerCase()
          )
      )
  );
}