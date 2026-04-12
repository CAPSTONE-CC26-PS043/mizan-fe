import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { TransactionResponse, CreateTransactionRequest, DeleteTransactionRequest } from '../types/transaction.types';

export const transactionApi = {
  getAll: async (userId: number): Promise<TransactionResponse> => {
    const response = await apiService.get<TransactionResponse>(
      `${apiEndpoints.transactions}?user_id=${userId}`
    );
    return response;
  },

  getById: async (id: number, userId: number): Promise<TransactionResponse> => {
    const response = await apiService.get<TransactionResponse>(
      `${apiEndpoints.transactions}/${id}?user_id=${userId}`
    );
    return response;
  },

  create: async (data: CreateTransactionRequest): Promise<TransactionResponse> => {
    const response = await apiService.post<TransactionResponse>(apiEndpoints.transactions, data);
    return response;
  },

  delete: async (params: DeleteTransactionRequest): Promise<TransactionResponse> => {
    const response = await apiService.delete<TransactionResponse>(
      `${apiEndpoints.transactions}/${params.id}?user_id=${params.user_id}`
    );
    return response;
  },
};
