import api from './api';

import {
  LoginCredentials,
  LoginResponse,
} from '../types/auth';

import { User } from '../types/user';

export const authApi = {
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/mobile/login',
      credentials
    );

    return response.data;
  },

  async user(): Promise<User> {
    const response = await api.get<User>(
      '/mobile/user'
    );

    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/mobile/logout');
  },
};