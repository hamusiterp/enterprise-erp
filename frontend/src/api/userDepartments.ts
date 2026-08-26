import apiClient from './client';

export interface UserDepartmentAssignment {
  department_id: number;
  department_code: string;
  department_name: string;
  status: string;
  is_primary: boolean;
  is_active: boolean;
  effective_from: string | null;
  effective_to: string | null;
}

export interface SaveUserDepartmentAssignment {
  department_id: number;
  is_primary: boolean;
  is_active: boolean;
  effective_from: string | null;
  effective_to: string | null;
}

interface UserDepartmentsResponse {
  success: boolean;
  data: UserDepartmentAssignment[];
}

interface SaveUserDepartmentsResponse {
  success: boolean;
  message: string;
  data: unknown[];
}

export async function fetchUserDepartments(
  userId: number,
): Promise<UserDepartmentAssignment[]> {
  const response =
    await apiClient.get<UserDepartmentsResponse>(
      `/api/admin/users/${userId}/departments`,
    );

  return response.data.data;
}

export async function updateUserDepartments(
  userId: number,
  departments: SaveUserDepartmentAssignment[],
) {
  const response =
    await apiClient.post(
      `/api/admin/users/${userId}/departments`,
      {
        departments,
      },
    );

  return response.data;
}