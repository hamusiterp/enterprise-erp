import apiClient from './client';
import type {
  LoginCredentials,
  LoginResponse,
  UserResponse,
} from '../types/auth';

export async function getCsrfCookie(): Promise<void> {
  await apiClient.get('/sanctum/csrf-cookie');
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await getCsrfCookie();

  const response = await apiClient.post<LoginResponse>(
    '/api/login',
    credentials,
  );

  return response.data;
}

export async function getAuthenticatedUser(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/api/user');

  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/logout');
}