import api from './api';

export interface MobileUser {
  id: number;
  name: string;
  email: string;

  status?: string | null;

  roles?: string[] | {
    id?: number;
    name?: string;
  }[];

  created_at?: string | null;
}

function normalizeUsers(responseData: any): MobileUser[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.users)) {
    return responseData.users;
  }

  if (Array.isArray(responseData?.data?.data)) {
    return responseData.data.data;
  }

  return [];
}

export const usersApi = {
  async list(): Promise<MobileUser[]> {
    const response = await api.get('/admin/users');

    return normalizeUsers(response.data);
  },

  async get(id: number): Promise<MobileUser> {
    const response = await api.get(
      `/admin/users/${id}`
    );

    return response.data?.data ?? response.data;
  },

  async changeStatus(
    id: number,
    status: string
  ): Promise<void> {
    await api.patch(
      `/admin/users/${id}/status`,
      {
        status,
      }
    );
  },
  async resetPassword(
  id: number
): Promise<void> {
  await api.patch(
    `/admin/users/${id}/reset-password`
  );
},
async roles(): Promise<
  {
    id: number;
    name: string;
  }[]
> {
  const response =
    await api.get(
      '/admin/roles/options'
    );

  const data =
    response.data?.data ??
    response.data;

  if (Array.isArray(data)) {
    return data;
  }

  return [];
},
async update(
  id: number,
  data: {
    name: string;
    email: string;
    status: string;
    roles: string[];
  }
): Promise<void> {
  await api.put(
    `/admin/users/${id}`,
    data
  );
},

async create(
  data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    status: string;
    roles: string[];
  }
): Promise<void> {
  await api.post(
    '/admin/users',
    data
  );
},
};