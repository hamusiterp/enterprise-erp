import apiClient from './client';

import type {
  PaginatedUsersResponse,
  RolesResponse,
  SystemUser,
  UserFilters,
  UserFormValues,
  UserStatus,
} from '../types/user';

interface UserResourceResponse {
  data: SystemUser;
}

interface MessageResponse {
  message: string;
}

function removeEmptyParameters(
  parameters: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '',
    ),
  );
}

export async function fetchUsers(
  filters: UserFilters,
): Promise<PaginatedUsersResponse> {
  const response = await apiClient.get<PaginatedUsersResponse>(
    '/api/admin/users',
    {
      params: removeEmptyParameters(filters),
    },
  );

  return response.data;
}

export async function fetchRoles(): Promise<RolesResponse> {
  const response = await apiClient.get<RolesResponse>(
    '/api/admin/roles/options',
  );

  return response.data;
}

export async function createUser(
  values: UserFormValues,
): Promise<SystemUser> {
  const response = await apiClient.post<UserResourceResponse>(
    '/api/admin/users',
    values,
  );

  return response.data.data;
}

export async function updateUser(
  userId: number,
  values: UserFormValues,
): Promise<SystemUser> {
  const response = await apiClient.put<UserResourceResponse>(
    `/api/admin/users/${userId}`,
    values,
  );

  return response.data.data;
}

export async function deleteUser(
  userId: number,
): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/api/admin/users/${userId}`,
  );

  return response.data;
}

export async function changeUserStatus(
  userId: number,
  status: UserStatus,
): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(
    `/api/admin/users/${userId}/status`,
    {
      status,
    },
  );

  return response.data;
}

export async function resetUserPassword(
  userId: number,
  password: string,
  passwordConfirmation: string,
): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(
    `/api/admin/users/${userId}/reset-password`,
    {
      password,
      password_confirmation: passwordConfirmation,
    },
  );

  return response.data;
}

export async function exportUsers(
  filters: Pick<
    UserFilters,
    'search' | 'status' | 'role'
  >,
): Promise<void> {
  const response = await apiClient.get(
    '/api/admin/users/export',
    {
      params: removeEmptyParameters(filters),
      responseType: 'blob',
    },
  );

  const contentDisposition =
    response.headers['content-disposition'];

  let fileName = `users-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  const fileNameMatch = contentDisposition?.match(
    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
  );

  if (fileNameMatch?.[1]) {
    fileName = fileNameMatch[1].replace(/['"]/g, '');
  }

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data]),
  );

  const downloadLink = document.createElement('a');

  downloadLink.href = blobUrl;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  window.URL.revokeObjectURL(blobUrl);
}