export interface Budget {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  category_id: number | null;
  category?: {
    id: number;
    name: string;
  };
  wallet_id: number | null;
  wallet?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BudgetResponse {
  success: boolean;
  data: Budget | Budget[] | null;
  message: string;
  statusCode?: number;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  user_id: number;
  start_date: string;
  end_date: string;
  wallet_id?: number;
  category_id?: number;
}

export interface UpdateBudgetRequest {
  name?: string;
  amount?: number;
  is_active?: boolean;
  wallet_id?: number;
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface DeleteBudgetRequest {
  id: number;
  user_id: number;
}
