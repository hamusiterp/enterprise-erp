import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { authApi } from '../api/authApi';
import { tokenService } from '../services/tokenService';

import { User } from '../types/user';
import { LoginCredentials } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (
    credentials: LoginCredentials
  ) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const restoreSession = useCallback(
    async () => {
      try {
        const token =
          await tokenService.get();

        if (!token) {
          setUser(null);
          return;
        }

        const currentUser =
          await authApi.user();

        setUser(currentUser);
      } catch (error) {
        await tokenService.remove();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (
    credentials: LoginCredentials
  ) => {
    try {
      const response =
        await authApi.login(credentials);

      await tokenService.save(
        response.token
      );

      setUser(response.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.errors
            ?.email?.[0] ||
          'Unable to login. Please check your credentials.';

        throw new Error(message);
      }

      throw new Error(
        'Unable to login. Please try again.'
      );
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if the server logout fails,
      // remove the local token.
    } finally {
      await tokenService.remove();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}