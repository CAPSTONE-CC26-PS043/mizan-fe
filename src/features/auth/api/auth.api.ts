import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { AuthResponse, LoginRequest, RegisterRequest, RefreshResponse } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(apiEndpoints.auth.login, data);
    return response;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(apiEndpoints.auth.register, data);
    return response;
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await apiService.post<RefreshResponse>(apiEndpoints.auth.refresh, { refreshToken });
    return response;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await apiService.get<AuthResponse>(`${apiEndpoints.auth.login}/me`);
    return response;
  },
};
