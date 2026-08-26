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

export interface UserDepartmentsResponse {
  success: boolean;
  data: UserDepartmentAssignment[];
}

export interface SaveUserDepartmentsResponse {
  success: boolean;
  message: string;
  data: unknown[];
}