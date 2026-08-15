import api from './api';

export interface Role {
  id: number;
  name: string;
  guard_name?: string;

  permissions: string[];
  permissions_count?: number;
  users_count?: number;
  is_system?: boolean;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface PermissionItem {
  id: number;
  name: string;
  label: string;
}

export interface PermissionGroup {
  module: string;
  label: string;
  permissions: PermissionItem[];
}

function normalizeRoles(data: any): Role[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.data)) {
    return data.data.data;
  }

  return [];
}

export const rolesApi = {
  async list(): Promise<Role[]> {
    const response =
      await api.get('/admin/roles');

    return normalizeRoles(
      response.data
    );
  },

  async get(
    id: number
  ): Promise<Role> {
    const response =
      await api.get(
        `/admin/roles/${id}`
      );

    return (
      response.data?.data ??
      response.data
    );
  },

  async permissions():
    Promise<PermissionGroup[]> {

    const response =
      await api.get(
        '/admin/roles/permissions'
      );

    const data =
      response.data?.data ??
      response.data;

    return Array.isArray(data)
      ? data
      : [];
  },

  async create(
    data: {
      name: string;
      permissions: string[];
    }
  ): Promise<void> {

    await api.post(
      '/admin/roles',
      data
    );
  },

  async update(
    id: number,
    data: {
      name: string;
      permissions: string[];
    }
  ): Promise<void> {

    await api.put(
      `/admin/roles/${id}`,
      data
    );
  },

  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/admin/roles/${id}`
    );
  },
};