import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '../api/budget.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { CreateBudgetRequest, UpdateBudgetRequest, DeleteBudgetRequest } from '../types/budget.types';

export const useBudgets = () => {
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return budgetApi.getAll(user.id);
    },
    enabled: !!user?.id && !!accessToken,
    retry: 1,
  });
};

export const useBudget = (id: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return budgetApi.getById(id, user.id);
    },
    enabled: !!user?.id && !!id,
    retry: 1,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: number; data: UpdateBudgetRequest; userId: number }) =>
      budgetApi.update(id, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: DeleteBudgetRequest) =>
      budgetApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};
