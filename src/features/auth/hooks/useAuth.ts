import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

interface AuthError {
  success: boolean;
  message: string;
  statusCode: number;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        navigate('/');
      }
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );
        navigate('/');
      }
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    navigate('/login');
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isAuthenticated,
  };
};

export const useCurrentUser = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getMe,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
