import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { WalletResponse, CreateWalletRequest, UpdateWalletRequest } from '../types/wallet.types';

export const walletApi = {
  getAll: async (userId: number): Promise<WalletResponse> => {
    const response = await apiService.get<WalletResponse>(
      `${apiEndpoints.wallets}?user_id=${userId}`
    );
    return response;
  },

  getById: async (id: number, userId: number): Promise<WalletResponse> => {
    const response = await apiService.get<WalletResponse>(
      `${apiEndpoints.wallets}/${id}?user_id=${userId}`
    );
    return response;
  },

  create: async (data: CreateWalletRequest): Promise<WalletResponse> => {
    const response = await apiService.post<WalletResponse>(apiEndpoints.wallets, data);
    return response;
  },

  update: async (id: number, userId: number, data: UpdateWalletRequest): Promise<WalletResponse> => {
    const response = await apiService.put<WalletResponse>(
      `${apiEndpoints.wallets}/${id}?user_id=${userId}`,
      data
    );
    return response;
  },

  delete: async (id: number, userId: number): Promise<WalletResponse> => {
    const response = await apiService.delete<WalletResponse>(
      `${apiEndpoints.wallets}/${id}?user_id=${userId}`
    );
    return response;
  },
};
