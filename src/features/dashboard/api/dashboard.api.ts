import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { DashboardResponse } from '../types/dashboard.types';

export const dashboardApi = {
  getDashboard: async (userId: number): Promise<DashboardResponse> => {
    const response = await apiService.get<DashboardResponse>(
      `${apiEndpoints.dashboard}?user_id=${userId}`
    );
    return response;
  },
};
