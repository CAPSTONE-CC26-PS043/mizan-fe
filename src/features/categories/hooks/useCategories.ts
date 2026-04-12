import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/category.types';

export const useCategories = () => {
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return categoryApi.getAll(user.id);
    },
    enabled: !!user?.id && !!accessToken,
    retry: 1,
  });
};

export const useCategory = (id: number) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return categoryApi.getById(id, user.id);
    },
    enabled: !!user?.id && !!id,
    retry: 1,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: number; data: UpdateCategoryRequest; userId: number }) =>
      categoryApi.update(id, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) =>
      categoryApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
