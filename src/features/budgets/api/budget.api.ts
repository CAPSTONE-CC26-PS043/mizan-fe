import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { BudgetResponse, CreateBudgetRequest, UpdateBudgetRequest } from '../types/budget.types';

export const budgetApi = {
  getAll: async (userId: number): Promise<BudgetResponse> => {
    const response = await apiService.get<BudgetResponse>(
      `${apiEndpoints.budgets}?user_id=${userId}`
    );
    return response;
  },

  getById: async (id: number, userId: number): Promise<BudgetResponse> => {
    const response = await apiService.get<BudgetResponse>(
      `${apiEndpoints.budgets}/${id}?user_id=${userId}`
    );
    return response;
  },

  create: async (data: CreateBudgetRequest): Promise<BudgetResponse> => {
    const response = await apiService.post<BudgetResponse>(apiEndpoints.budgets, data);
    return response;
  },

  update: async (id: number, userId: number, data: UpdateBudgetRequest): Promise<BudgetResponse> => {
    const response = await apiService.put<BudgetResponse>(
      `${apiEndpoints.budgets}/${id}?user_id=${userId}`,
      data
    );
    return response;
  },

  delete: async (id: number, userId: number): Promise<BudgetResponse> => {
    const response = await apiService.delete<BudgetResponse>(
      `${apiEndpoints.budgets}/${id}?user_id=${userId}`
    );
    return response;
  },
};
