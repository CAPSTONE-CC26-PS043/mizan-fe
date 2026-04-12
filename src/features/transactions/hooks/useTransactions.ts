import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transaction.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { CreateTransactionRequest } from '../types/transaction.types';

export const useTransactions = () => {
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return transactionApi.getAll(user.id);
    },
    enabled: !!user?.id && !!accessToken,
    retry: 1,
  });
};

export const useTransaction = (id: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return transactionApi.getById(id, user.id);
    },
    enabled: !!user?.id && !!id,
    retry: 1,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) =>
      transactionApi.delete({ id, user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
