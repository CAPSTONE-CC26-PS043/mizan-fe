export interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'cancelled';
  description?: string;
}

