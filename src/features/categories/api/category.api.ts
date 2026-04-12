import { apiService } from '@/services/api.service';
import { apiEndpoints } from '@/config/api.config';
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category.types';

export const categoryApi = {
  getAll: async (userId: number): Promise<CategoryResponse> => {
    const response = await apiService.get<CategoryResponse>(
      `${apiEndpoints.categories}?user_id=${userId}`
    );
    return response;
  },

  getById: async (id: number, userId: number): Promise<CategoryResponse> => {
    const response = await apiService.get<CategoryResponse>(
      `${apiEndpoints.categories}/${id}?user_id=${userId}`
    );
    return response;
  },

  create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await apiService.post<CategoryResponse>(apiEndpoints.categories, data);
    return response;
  },

  update: async (id: number, userId: number, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await apiService.put<CategoryResponse>(
      `${apiEndpoints.categories}/${id}?user_id=${userId}`,
      data
    );
    return response;
  },

  delete: async (id: number, userId: number): Promise<CategoryResponse> => {
    const response = await apiService.delete<CategoryResponse>(
      `${apiEndpoints.categories}/${id}?user_id=${userId}`
    );
    return response;
  },
};
