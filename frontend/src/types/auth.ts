export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface UserResponse {
  user: AuthUser;
}