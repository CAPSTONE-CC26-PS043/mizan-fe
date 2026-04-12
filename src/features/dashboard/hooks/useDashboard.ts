import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const useDashboard = () => {
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return dashboardApi.getDashboard(user.id);
    },
    enabled: !!user?.id && !!accessToken,
    retry: 1,
  });
};
