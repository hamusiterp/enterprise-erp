export interface MobileModule {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  route?: string;
  permissionKeywords?: string[];
}

export const mobileModules: MobileModule[] = [

  

  {
    key: 'administration',
    title: 'Administration',
    subtitle: 'Users, roles and setup',
    icon: 'settings-outline',
    route: '/(app)/administration',
    permissionKeywords: [
      'user',
      'role',
      'permission',
      'department',
      'designation',
    ],
  },

  {
  key: 'management',
  title: 'Management',
  subtitle: 'Banks, items and operational master data',
  icon: 'grid-outline',
  route: '/(app)/management',
},

  {
    key: 'projects',
    title: 'Projects',
    subtitle: 'Manage projects',
    icon: 'briefcase-outline',
    permissionKeywords: [
      'project',
    ],
  },

  {
    key: 'customers',
    title: 'Customers',
    subtitle: 'Customer management',
    icon: 'people-outline',
    permissionKeywords: [
      'customer',
    ],
  },

  {
    key: 'suppliers',
    title: 'Suppliers',
    subtitle: 'Supplier management',
    icon: 'cube-outline',
    permissionKeywords: [
      'supplier',
    ],
  },

  {
    key: 'purchasers',
    title: 'Purchasers',
    subtitle: 'Sales purchasers',
    icon: 'cart-outline',
    permissionKeywords: [
      'purchaser',
    ],
  },

  {
    key: 'cheques',
    title: 'Cheques',
    subtitle: 'Cheque management',
    icon: 'wallet-outline',
    permissionKeywords: [
      'cheque',
    ],
  },

];