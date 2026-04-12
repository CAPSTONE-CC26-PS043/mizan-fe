export interface Category {
  id: number;
  user_id: number | null;
  name: string;
  is_default: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category | Category[] | null;
  message: string;
  statusCode: number;
}

export interface CreateCategoryRequest {
  name: string;
  user_id?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
}
