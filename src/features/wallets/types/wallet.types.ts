export interface Wallet {
  id: number;
  user_id: number;
  name: string;
  current_balance: number;
  target_balance: number | null;
  description: string | null;
  is_default: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WalletResponse {
  success: boolean;
  data: Wallet | Wallet[] | null;
  message: string;
  statusCode: number;
}

export interface CreateWalletRequest {
  name: string;
  current_balance?: number;
  target_balance?: number;
  user_id: number;
}

export interface UpdateWalletRequest {
  name?: string;
  current_balance?: number;
  target_balance?: number;
}
