import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api/wallet.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { CreateWalletRequest, UpdateWalletRequest } from '../types/wallet.types';

export const useWallets = () => {
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return walletApi.getAll(user.id);
    },
    enabled: !!user?.id && !!accessToken,
    retry: 1,
  });
};

export const useWallet = (id: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['wallet', id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return walletApi.getById(id, user.id);
    },
    enabled: !!user?.id && !!id,
    retry: 1,
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: number; data: UpdateWalletRequest; userId: number }) =>
      walletApi.update(id, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) =>
      walletApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};
