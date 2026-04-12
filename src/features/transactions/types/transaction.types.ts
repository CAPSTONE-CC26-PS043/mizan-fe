export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category_id: number | null;
  category?: {
    id: number;
    name: string;
  };
  type: TransactionType;
  wallet_id: number | null;
  description: string | null;
  source: string;
  status: string;
  transaction_date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction | Transaction[] | null;
  message: string;
  statusCode: number;
}

export interface CreateTransactionRequest {
  amount: number;
  description?: string;
  category_id: number;
  wallet_id: number;
  user_id: number;
  type: TransactionType;
  source?: string;
  status?: string;
  transaction_date?: string;
}

export interface DeleteTransactionRequest {
  id: number;
  user_id: number;
}
